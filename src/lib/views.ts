import { getClassType, getCoach, getPlan } from "@/config/tenant";
import type { Db, Slot } from "./types";
import { activeBookings, spotsLeft, waitlistFor } from "./booking";
import { balance } from "./ledger";
import { currentMembership, latestMembership } from "./membership";

export interface ClassView {
  id: string;
  classTypeId: string;
  name: string;
  color: string;
  coach: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  spotsLeft: number;
  waitlistCount: number;
  cancelled: boolean;
  mine: "booked" | "waitlisted" | null;
  bookingId?: string;
  waitlistPosition?: number;
}

export function classView(db: Db, slot: Slot, memberId?: string): ClassView {
  const ct = getClassType(slot.classTypeId);
  const wl = waitlistFor(db, slot.id);
  const booking = memberId ? activeBookings(db, slot.id).find((b) => b.memberId === memberId && b.status === "booked") : undefined;
  const wlIndex = memberId ? wl.findIndex((w) => w.memberId === memberId) : -1;
  return {
    id: slot.id,
    classTypeId: slot.classTypeId,
    name: ct?.name ?? "Clase",
    color: ct?.color ?? "#ffc20e",
    coach: getCoach(slot.coachId)?.name ?? "",
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
    capacity: slot.capacity,
    spotsLeft: spotsLeft(db, slot),
    waitlistCount: wl.length,
    cancelled: slot.status === "cancelled",
    mine: booking ? "booked" : wlIndex >= 0 ? "waitlisted" : null,
    bookingId: booking?.id,
    waitlistPosition: wlIndex >= 0 ? wlIndex + 1 : undefined,
  };
}

export function memberSummary(db: Db, memberId: string, at: Date) {
  const p = db.profiles.find((x) => x.id === memberId);
  const current = currentMembership(db, memberId, at);
  const last = latestMembership(db, memberId);
  const ms = current ?? last;
  const plan = ms ? getPlan(ms.planId) : undefined;
  return {
    id: memberId,
    name: p?.name ?? "",
    email: p?.email ?? "",
    phone: p?.phone ?? "",
    createdAt: p?.createdAt ?? "",
    planName: plan?.name ?? null,
    planKind: plan?.kind ?? null,
    endsAt: ms?.endsAt ?? null,
    active: !!current,
    credits: balance(db, memberId),
  };
}
