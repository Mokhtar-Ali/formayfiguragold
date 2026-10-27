import { getPlan } from "@/config/tenant";
import type { Db, Membership, Payment } from "./types";
import { DomainError } from "./types";
import { nextId } from "./store";
import { addLedger } from "./ledger";
import { notify } from "./notify";
import { formatCop } from "./time";

/** Membership that covers a given moment, preferring the one that lasts longest. */
export function coveringMembership(db: Db, memberId: string, at: Date, nowDate: Date): Membership | undefined {
  return db.memberships
    .filter(
      (m) =>
        m.memberId === memberId &&
        m.status === "active" &&
        new Date(m.startsAt) <= nowDate &&
        new Date(m.endsAt) >= at,
    )
    .sort((a, b) => b.endsAt.localeCompare(a.endsAt))[0];
}

export function currentMembership(db: Db, memberId: string, nowDate: Date): Membership | undefined {
  return coveringMembership(db, memberId, nowDate, nowDate);
}

export function latestMembership(db: Db, memberId: string): Membership | undefined {
  return db.memberships.filter((m) => m.memberId === memberId).sort((a, b) => b.endsAt.localeCompare(a.endsAt))[0];
}

const receipt = (db: Db) => `BT-${String(db.payments.length + 1).padStart(5, "0")}`;

/**
 * Record a payment and, when approved, start the plan right away.
 * Declined payments are stored for the history but change nothing else.
 */
export function registerPayment(
  db: Db,
  memberId: string,
  planId: string,
  method: Payment["method"],
  outcome: "approved" | "declined",
  at: Date,
): { payment: Payment; membership?: Membership } {
  const plan = getPlan(planId);
  if (!plan) throw new DomainError("PLAN_NOT_FOUND", "El plan no existe.", 404);

  const payment: Payment = {
    id: nextId(db, "p"),
    memberId,
    planId,
    amountCop: plan.priceCop,
    method,
    status: outcome,
    at: at.toISOString(),
    receiptNo: receipt(db),
  };
  db.payments.push(payment);

  if (outcome === "declined") {
    notify(db, memberId, "payment", "Pago rechazado", `No pudimos procesar el pago de ${plan.name}. Intenta de nuevo.`, at);
    return { payment };
  }

  // On an early renewal the new plan runs after the current one ends, so no days are lost.
  // It is usable right away (startsAt is now) while endsAt reaches past the old plan.
  const last = latestMembership(db, memberId);
  const startMs = last && new Date(last.endsAt) > at ? new Date(last.endsAt).getTime() : at.getTime();
  const membership: Membership = {
    id: nextId(db, "ms"),
    memberId,
    planId,
    status: "active",
    startsAt: new Date(Math.min(startMs, at.getTime())).toISOString(),
    endsAt: new Date(startMs + plan.durationDays * 86_400_000).toISOString(),
  };
  db.memberships.push(membership);
  if (plan.kind !== "unlimited") addLedger(db, memberId, plan.credits, "plan", at, { refId: membership.id, note: plan.name });
  notify(
    db,
    memberId,
    "payment",
    "Pago aprobado",
    `Recibimos ${formatCop(plan.priceCop)} por ${plan.name}. Recibo ${payment.receiptNo}.`,
    at,
  );
  return { payment, membership };
}
