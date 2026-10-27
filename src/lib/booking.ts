import { getClassType, getPlan, tenant } from "@/config/tenant";
import type { Booking, Db, Profile, Slot, WaitlistEntry } from "./types";
import { DomainError } from "./types";
import { nextId } from "./store";
import { addLedger, balance } from "./ledger";
import { coveringMembership } from "./membership";
import { notify } from "./notify";
import { dateKey, formatDay, formatTime } from "./time";

const ACTIVE = new Set<Booking["status"]>(["booked", "attended"]);

export const activeBookings = (db: Db, slotId: string) =>
  db.bookings.filter((b) => b.slotId === slotId && ACTIVE.has(b.status));

export const spotsLeft = (db: Db, slot: Slot) => Math.max(0, slot.capacity - activeBookings(db, slot.id).length);

export const waitlistFor = (db: Db, slotId: string) =>
  db.waitlist.filter((w) => w.slotId === slotId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

function slotLabel(slot: Slot) {
  const name = getClassType(slot.classTypeId)?.name ?? "Clase";
  return `${name}, ${formatDay(slot.startsAt)} ${formatTime(slot.startsAt)}`;
}

function getSlot(db: Db, slotId: string): Slot {
  const slot = db.slots.find((s) => s.id === slotId);
  if (!slot) throw new DomainError("SLOT_NOT_FOUND", "La clase no existe.", 404);
  return slot;
}

/** Credit cost for this member on this slot: 0 with an unlimited plan, otherwise 1. */
function creditCost(db: Db, memberId: string, slot: Slot, now: Date): number {
  const m = coveringMembership(db, memberId, new Date(slot.startsAt), now);
  if (!m) throw new DomainError("NO_MEMBERSHIP", "Necesitas un plan activo para reservar.", 402);
  const unlimited = db.memberships.some(
    (x) =>
      x.memberId === memberId &&
      x.status === "active" &&
      new Date(x.startsAt) <= now &&
      new Date(x.endsAt) >= new Date(slot.startsAt) &&
      getPlan(x.planId)?.kind === "unlimited",
  );
  if (unlimited) return 0;
  if (balance(db, memberId) < 1) throw new DomainError("NO_CREDITS", "No tienes créditos disponibles.", 402);
  return 1;
}

function assertCanBook(db: Db, memberId: string, slot: Slot, now: Date) {
  if (slot.status !== "scheduled") throw new DomainError("SLOT_CANCELLED", "Esta clase fue cancelada.");
  if (new Date(slot.startsAt) <= now) throw new DomainError("SLOT_PAST", "Esta clase ya empezó.");
  const horizon = now.getTime() + tenant.booking.opensDaysAhead * 86_400_000;
  if (new Date(slot.startsAt).getTime() > horizon)
    throw new DomainError("TOO_EARLY", `Las reservas abren ${tenant.booking.opensDaysAhead} días antes.`);
  if (db.bookings.some((b) => b.slotId === slot.id && b.memberId === memberId && ACTIVE.has(b.status)))
    throw new DomainError("ALREADY_BOOKED", "Ya tienes esta clase reservada.", 409);
  if (db.waitlist.some((w) => w.slotId === slot.id && w.memberId === memberId))
    throw new DomainError("ALREADY_WAITLISTED", "Ya estás en la lista de espera.", 409);
  const day = dateKey(new Date(slot.startsAt));
  const sameDay = db.bookings.filter((b) => {
    if (b.memberId !== memberId || b.status !== "booked") return false;
    const s = db.slots.find((x) => x.id === b.slotId);
    return s ? dateKey(new Date(s.startsAt)) === day : false;
  }).length;
  if (sameDay >= tenant.booking.maxBookingsPerDay)
    throw new DomainError("DAILY_LIMIT", `Máximo ${tenant.booking.maxBookingsPerDay} clases por día.`);
}

export type BookResult =
  | { status: "booked"; booking: Booking }
  | { status: "waitlisted"; entry: WaitlistEntry; position: number };

/**
 * Book a class. The capacity check and the write happen in one synchronous
 * call, so two requests can never take the last spot. With Postgres this
 * becomes a single database function, as in the Focus portal.
 */
export function bookSlot(db: Db, memberId: string, slotId: string, now: Date): BookResult {
  const slot = getSlot(db, slotId);
  assertCanBook(db, memberId, slot, now);
  const cost = creditCost(db, memberId, slot, now);

  if (spotsLeft(db, slot) > 0) {
    const booking: Booking = {
      id: nextId(db, "b"),
      slotId,
      memberId,
      status: "booked",
      creditCost: cost,
      createdAt: now.toISOString(),
    };
    db.bookings.push(booking);
    if (cost) addLedger(db, memberId, -cost, "booking", now, { refId: booking.id, note: slotLabel(slot) });
    notify(db, memberId, "booking", "Reserva confirmada", slotLabel(slot), now);
    return { status: "booked", booking };
  }

  if (waitlistFor(db, slotId).length >= tenant.booking.waitlistMax)
    throw new DomainError("WAITLIST_FULL", "La clase y su lista de espera están llenas.", 409);
  const entry: WaitlistEntry = { id: nextId(db, "w"), slotId, memberId, createdAt: now.toISOString() };
  db.waitlist.push(entry);
  const position = waitlistFor(db, slotId).findIndex((w) => w.id === entry.id) + 1;
  notify(db, memberId, "waitlist", "Estás en la lista de espera", `${slotLabel(slot)}. Posición ${position}.`, now);
  return { status: "waitlisted", entry, position };
}

export function leaveWaitlist(db: Db, memberId: string, slotId: string) {
  const i = db.waitlist.findIndex((w) => w.slotId === slotId && w.memberId === memberId);
  if (i === -1) throw new DomainError("NOT_WAITLISTED", "No estabas en la lista de espera.", 404);
  db.waitlist.splice(i, 1);
}

/** Fill free spots from the front of the waitlist. Members who can no longer book are skipped. */
export function promoteWaitlist(db: Db, slotId: string, now: Date): Booking[] {
  const slot = getSlot(db, slotId);
  const promoted: Booking[] = [];
  if (slot.status !== "scheduled" || new Date(slot.startsAt) <= now) return promoted;

  for (const entry of waitlistFor(db, slotId)) {
    if (spotsLeft(db, slot) === 0) break;
    db.waitlist.splice(db.waitlist.findIndex((w) => w.id === entry.id), 1);
    try {
      const cost = creditCost(db, entry.memberId, slot, now);
      const booking: Booking = {
        id: nextId(db, "b"),
        slotId,
        memberId: entry.memberId,
        status: "booked",
        creditCost: cost,
        createdAt: now.toISOString(),
      };
      db.bookings.push(booking);
      if (cost) addLedger(db, entry.memberId, -cost, "booking", now, { refId: booking.id, note: slotLabel(slot) });
      notify(db, entry.memberId, "waitlist", "Se liberó un cupo", `Ya estás dentro: ${slotLabel(slot)}.`, now);
      promoted.push(booking);
    } catch {
      notify(db, entry.memberId, "waitlist", "No pudimos reservar tu cupo", `${slotLabel(slot)}. Revisa tu plan o tus créditos.`, now);
    }
  }
  return promoted;
}

export interface CancelOptions {
  /** Staff can cancel at any time. Members must respect the time limit. */
  actor: Profile;
}

export function cancelBooking(db: Db, bookingId: string, opts: CancelOptions, now: Date): { refunded: boolean } {
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking || booking.status !== "booked") throw new DomainError("BOOKING_NOT_FOUND", "La reserva no existe.", 404);
  const slot = getSlot(db, booking.slotId);
  const isStaff = opts.actor.role === "reception" || opts.actor.role === "admin";
  if (!isStaff && opts.actor.id !== booking.memberId) throw new DomainError("FORBIDDEN", "No puedes cancelar esta reserva.", 403);

  const msLeft = new Date(slot.startsAt).getTime() - now.getTime();
  if (msLeft <= 0) throw new DomainError("SLOT_PAST", "Esta clase ya empezó.");
  if (!isStaff && msLeft < tenant.booking.cancelWindowHours * 3_600_000)
    throw new DomainError("CANCEL_TOO_LATE", `Solo puedes cancelar hasta ${tenant.booking.cancelWindowHours} horas antes.`);

  booking.status = "cancelled";
  booking.cancelledAt = now.toISOString();
  const refunded = booking.creditCost > 0;
  if (refunded) addLedger(db, booking.memberId, booking.creditCost, "refund", now, { refId: booking.id, note: slotLabel(slot) });
  notify(db, booking.memberId, "cancel", "Reserva cancelada", refunded ? `${slotLabel(slot)}. Te devolvimos el crédito.` : slotLabel(slot), now);
  promoteWaitlist(db, slot.id, now);
  return { refunded };
}

/** Cancel a whole class: every booking is refunded and every member is told. */
export function cancelSlot(db: Db, slotId: string, now: Date) {
  const slot = getSlot(db, slotId);
  if (slot.status === "cancelled") return;
  slot.status = "cancelled";
  for (const b of db.bookings.filter((x) => x.slotId === slotId && x.status === "booked")) {
    b.status = "cancelled";
    b.cancelledAt = now.toISOString();
    if (b.creditCost > 0) addLedger(db, b.memberId, b.creditCost, "refund", now, { refId: b.id, note: slotLabel(slot) });
    notify(db, b.memberId, "cancel", "Clase cancelada", `${slotLabel(slot)}. ${b.creditCost ? "Te devolvimos el crédito." : ""}`.trim(), now);
  }
  for (const w of waitlistFor(db, slotId)) {
    notify(db, w.memberId, "cancel", "Clase cancelada", `${slotLabel(slot)}. Saliste de la lista de espera.`, now);
  }
  db.waitlist = db.waitlist.filter((w) => w.slotId !== slotId);
}

export function checkIn(db: Db, bookingId: string, actor: Profile, now: Date): Booking {
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) throw new DomainError("BOOKING_NOT_FOUND", "La reserva no existe.", 404);
  const slot = getSlot(db, booking.slotId);
  if (actor.role === "member") throw new DomainError("FORBIDDEN", "No tienes permiso.", 403);
  if (actor.role === "coach" && actor.coachId !== slot.coachId)
    throw new DomainError("FORBIDDEN", "Solo puedes registrar asistencia en tus clases.", 403);
  if (booking.status === "attended") return booking;
  if (booking.status !== "booked") throw new DomainError("BAD_STATE", "Esta reserva no está activa.");
  if (dateKey(new Date(slot.startsAt)) !== dateKey(now))
    throw new DomainError("NOT_TODAY", "Solo se registra asistencia el día de la clase.");
  booking.status = "attended";
  booking.checkedInAt = now.toISOString();
  return booking;
}

/** Past classes: whoever booked and was not checked in becomes a no-show. */
export function closePastClasses(db: Db, now: Date) {
  const ended = new Map(db.slots.map((s) => [s.id, new Date(s.endsAt) <= now]));
  for (const b of db.bookings) {
    if (b.status === "booked" && ended.get(b.slotId)) b.status = "no_show";
  }
}
