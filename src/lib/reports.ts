import { classTypes, getPlan, plans } from "@/config/tenant";
import type { Db } from "./types";
import { addDays, dateKey, mondayOf } from "./time";
import { balance } from "./ledger";
import { currentMembership } from "./membership";

const DAY = 86_400_000;

export interface Report {
  activeMembers: number;
  newMembers30d: number;
  revenue30d: number;
  revenueByPlan: { planId: string; name: string; total: number; count: number }[];
  attendance30d: number;
  noShowRate: number;
  occupancy30d: number;
  weekly: { weekStart: string; attended: number }[];
  byClassType: { id: string; name: string; color: string; attended: number; occupancy: number }[];
  atRisk: { memberId: string; name: string; reason: string }[];
}

export function buildReport(db: Db, at: Date): Report {
  const since = new Date(at.getTime() - 30 * DAY);
  const members = db.profiles.filter((p) => p.role === "member");
  const active = members.filter((m) => currentMembership(db, m.id, at));

  const pay = db.payments.filter((p) => p.status === "approved" && new Date(p.at) >= since);
  const revenueByPlan = plans
    .map((p) => {
      const rows = pay.filter((x) => x.planId === p.id);
      return { planId: p.id, name: p.name, total: rows.reduce((s, x) => s + x.amountCop, 0), count: rows.length };
    })
    .filter((r) => r.count > 0);

  const pastSlots = db.slots.filter((s) => s.status === "scheduled" && new Date(s.startsAt) >= since && new Date(s.startsAt) < at);
  const slotStats = pastSlots.map((s) => {
    const rows = db.bookings.filter((b) => b.slotId === s.id && (b.status === "attended" || b.status === "no_show"));
    return { slot: s, attended: rows.filter((b) => b.status === "attended").length, booked: rows.length };
  });
  const attended = slotStats.reduce((a, x) => a + x.attended, 0);
  const booked = slotStats.reduce((a, x) => a + x.booked, 0);
  const capacity = slotStats.reduce((a, x) => a + x.slot.capacity, 0);

  const weekly: Report["weekly"] = [];
  const thisMonday = mondayOf(dateKey(at));
  for (let i = 7; i >= 0; i--) {
    const start = addDays(thisMonday, -7 * i);
    const end = addDays(start, 7);
    const n = db.bookings.filter((b) => {
      if (b.status !== "attended") return false;
      const s = db.slots.find((x) => x.id === b.slotId);
      if (!s) return false;
      const k = dateKey(new Date(s.startsAt));
      return k >= start && k < end;
    }).length;
    weekly.push({ weekStart: start, attended: n });
  }

  const byClassType = classTypes.map((ct) => {
    const id = ct.id;
    const rows = slotStats.filter((x) => x.slot.classTypeId === id);
    const a = rows.reduce((s, x) => s + x.attended, 0);
    const cap = rows.reduce((s, x) => s + x.slot.capacity, 0);
    return { id, name: ct.name, color: ct.color, attended: a, occupancy: cap ? a / cap : 0 };
  });

  // At risk: active members who have not attended in 14 days, or whose plan is nearly out
  const atRisk: Report["atRisk"] = [];
  for (const m of active) {
    const last = db.bookings
      .filter((b) => b.memberId === m.id && b.status === "attended")
      .map((b) => db.slots.find((s) => s.id === b.slotId)?.startsAt ?? "")
      .sort()
      .pop();
    const idle = last ? (at.getTime() - new Date(last).getTime()) / DAY : (at.getTime() - new Date(m.createdAt).getTime()) / DAY;
    const ms = currentMembership(db, m.id, at);
    const plan = ms ? getPlan(ms.planId) : undefined;
    if (idle >= 14) atRisk.push({ memberId: m.id, name: m.name, reason: `Sin asistir hace ${Math.floor(idle)} días` });
    else if (plan?.kind !== "unlimited" && balance(db, m.id) <= 1) atRisk.push({ memberId: m.id, name: m.name, reason: "Le queda 1 crédito o menos" });
  }

  return {
    activeMembers: active.length,
    newMembers30d: members.filter((m) => new Date(m.createdAt) >= since).length,
    revenue30d: pay.reduce((s, p) => s + p.amountCop, 0),
    revenueByPlan,
    attendance30d: attended,
    noShowRate: booked ? 1 - attended / booked : 0,
    occupancy30d: capacity ? attended / capacity : 0,
    weekly,
    byClassType,
    atRisk: atRisk.slice(0, 12),
  };
}

export function membersCsv(db: Db, at: Date): string {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [["Nombre", "Correo", "Teléfono", "Plan", "Vence", "Créditos"].map(esc).join(",")];
  for (const m of db.profiles.filter((p) => p.role === "member")) {
    const ms = currentMembership(db, m.id, at);
    rows.push([m.name, m.email, m.phone, ms ? getPlan(ms.planId)?.name ?? "" : "Sin plan", ms ? dateKey(new Date(ms.endsAt)) : "", balance(db, m.id)].map(esc).join(","));
  }
  return rows.join("\n");
}
