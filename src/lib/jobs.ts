import { getClassType, getPlan } from "@/config/tenant";
import type { Db } from "./types";
import { notify } from "./notify";
import { latestMembership } from "./membership";
import { formatDay, formatTime } from "./time";
import { closePastClasses } from "./booking";

const HOUR = 3_600_000;

/** Tell members about classes starting in the next 24 hours. Runs hourly in production. */
export function sendClassReminders(db: Db, at: Date): number {
  let sent = 0;
  for (const b of db.bookings) {
    if (b.status !== "booked") continue;
    const slot = db.slots.find((s) => s.id === b.slotId);
    if (!slot || slot.status !== "scheduled") continue;
    const ms = new Date(slot.startsAt).getTime() - at.getTime();
    if (ms <= 0 || ms > 24 * HOUR) continue;
    const name = getClassType(slot.classTypeId)?.name ?? "Clase";
    const n = notify(db, b.memberId, "reminder", "Tu clase es pronto", `${name}, ${formatDay(slot.startsAt)} ${formatTime(slot.startsAt)}.`, at, `rem_${b.id}`);
    if (n) sent++;
  }
  return sent;
}

/** Expire finished memberships and warn members whose plan ends within 3 days. Runs daily. */
export function runMembershipRenewals(db: Db, at: Date): { warned: number; expired: number } {
  let warned = 0;
  let expired = 0;
  for (const m of db.memberships) {
    if (m.status !== "active") continue;
    const end = new Date(m.endsAt);
    if (end < at) {
      m.status = "expired";
      expired++;
      continue;
    }
    const last = latestMembership(db, m.memberId);
    if (last && last.id !== m.id) continue; // a newer plan already follows this one
    if (end.getTime() - at.getTime() <= 3 * 24 * HOUR) {
      const plan = getPlan(m.planId);
      const n = notify(db, m.memberId, "renewal", "Tu plan está por vencer", `${plan?.name ?? "Tu plan"} termina el ${formatDay(m.endsAt)}. Renueva para no perder tus clases.`, at, `renew_${m.id}`);
      if (n) warned++;
    }
  }
  return { warned, expired };
}

export function runAllJobs(db: Db, at: Date) {
  closePastClasses(db, at);
  return { reminders: sendClassReminders(db, at), ...runMembershipRenewals(db, at) };
}
