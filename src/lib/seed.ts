import { getPlan, plans, templates, tenant } from "@/config/tenant";
import type { Db, Profile } from "./types";
import { emptyDb, nextId } from "./store";
import { generateSlots } from "./schedule";
import { addDays, dateKey } from "./time";
import { registerPayment } from "./membership";
import { addLedger, balance } from "./ledger";
import { bookSlot, spotsLeft } from "./booking";

/** Small deterministic random generator, so every start of the demo looks the same. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Sofía", "Mateo", "Valentina", "Santiago", "Isabella", "Samuel", "Mariana", "Daniel", "Gabriela", "Nicolás", "Daniela", "Sebastián", "Juliana", "Alejandro", "Laura", "Felipe", "Camilo", "Paula", "Andrés", "Manuela", "Esteban", "Natalia", "Tomás", "Lucía"];
const LAST = ["Restrepo", "Gómez", "Zuluaga", "Ospina", "Arango", "Londoño", "Vélez", "Cardona", "Henao", "Giraldo", "Mejía", "Bedoya", "Álvarez", "Montoya", "Salazar", "Duque"];

export const DEMO_ACCOUNTS = {
  member: "demo_member",
  coach: "demo_coach",
  reception: "demo_reception",
  admin: "demo_admin",
} as const;

export function seedDb(nowDate: Date): Db {
  const db = emptyDb();
  const r = rng(20261026);
  const day = 86_400_000;
  const today = dateKey(nowDate);

  db.templates = templates.map((t) => ({ ...t }));
  const horizon = addDays(today, tenant.booking.scheduleWeeksAhead * 7);
  db.slots = generateSlots(addDays(today, -63), horizon, db.templates);
  db.slotsGeneratedUntil = horizon;

  const mk = (p: Partial<Profile> & Pick<Profile, "id" | "name" | "role">, daysAgo: number): Profile => {
    const slug = p.name.toLowerCase().normalize("NFD").replace(/[^a-z ]/g, "").replace(/ +/g, ".");
    const profile: Profile = {
      email: `${slug}@ejemplo.com`,
      phone: `300 ${String(Math.floor(r() * 9_000_000) + 1_000_000)}`,
      emergencyName: "Contacto de ejemplo",
      emergencyPhone: "310 000 0000",
      createdAt: new Date(nowDate.getTime() - daysAgo * day).toISOString(),
      ...p,
    };
    db.profiles.push(profile);
    return profile;
  };

  // Staff and the demo member
  mk({ id: DEMO_ACCOUNTS.admin, name: "Admin Demo", role: "admin", isDemoAccount: true }, 400);
  mk({ id: DEMO_ACCOUNTS.reception, name: "Recepción Demo", role: "reception", isDemoAccount: true }, 400);
  mk({ id: DEMO_ACCOUNTS.coach, name: "Coach Andrés", role: "coach", coachId: "c_andres", isDemoAccount: true }, 400);
  const demo = mk({ id: DEMO_ACCOUNTS.member, name: "Camila Demo", role: "member", isDemoAccount: true }, 20);

  // The demo member: a 12-class pack that started 20 days ago
  registerPayment(db, demo.id, "pack12", "bold", "approved", new Date(nowDate.getTime() - 20 * day));

  // Sixty sample members who joined over the last 90 days
  const members: Profile[] = [];
  for (let i = 0; i < 60; i++) {
    const name = `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`;
    const joined = Math.floor(r() * 90) + 1;
    const m = mk({ id: `m_${i + 1}`, name, role: "member" }, joined);
    members.push(m);
    const pick = r();
    let plan = pick < 0.5 ? "mensual" : pick < 0.78 ? "pack12" : pick < 0.95 ? "pack8" : "dia";
    let start = new Date(m.createdAt);
    // Follow the member through renewals until today. Some leave.
    for (let guard = 0; guard < 6; guard++) {
      const method = r() < 0.75 ? "bold" : r() < 0.6 ? "cash" : "transfer";
      if (r() < 0.04) registerPayment(db, m.id, plan, "bold", "declined", start);
      const { membership } = registerPayment(db, m.id, plan, method, "approved", start);
      if (!membership) break;
      const end = new Date(membership.endsAt);
      if (end > nowDate) break;
      if (r() > 0.7) break; // left the gym
      start = end;
      plan = r() < 0.8 ? plan : plans[Math.floor(r() * 3)].id;
    }
  }

  // Past classes, oldest first so credit balances stay honest
  const past = db.slots.filter((s) => new Date(s.startsAt) < nowDate).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  for (const slot of past) {
    const start = new Date(slot.startsAt);
    let taken = 0;
    for (const m of members) {
      if (taken >= slot.capacity) break;
      const covering = db.memberships.find(
        (x) => x.memberId === m.id && x.status === "active" && new Date(x.startsAt) <= start && new Date(x.endsAt) >= start,
      );
      if (!covering) continue;
      const unlimited = getPlan(covering.planId)?.kind === "unlimited";
      if (r() > (unlimited ? 0.2 : 0.13)) continue;
      if (!unlimited && balance(db, m.id) < 1) continue;
      const id = nextId(db, "b");
      const attended = r() < 0.86;
      db.bookings.push({
        id,
        slotId: slot.id,
        memberId: m.id,
        status: attended ? "attended" : "no_show",
        creditCost: unlimited ? 0 : 1,
        createdAt: new Date(start.getTime() - day).toISOString(),
        checkedInAt: attended ? start.toISOString() : undefined,
      });
      if (!unlimited) addLedger(db, m.id, -1, "booking", new Date(start.getTime() - day), { refId: id });
      taken++;
    }
  }

  // The demo member went to four Híbrido classes
  const demoPast = past.filter((s) => s.classTypeId === "hibrido").slice(-4);
  for (const slot of demoPast) {
    const id = nextId(db, "b");
    db.bookings.push({
      id,
      slotId: slot.id,
      memberId: demo.id,
      status: "attended",
      creditCost: 1,
      createdAt: new Date(new Date(slot.startsAt).getTime() - day).toISOString(),
      checkedInAt: slot.startsAt,
    });
    addLedger(db, demo.id, -1, "booking", new Date(slot.startsAt), { refId: id });
  }

  // Upcoming classes, booked through the real engine
  const upcoming = db.slots.filter((s) => new Date(s.startsAt) > nowDate).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const window = upcoming.filter((s) => new Date(s.startsAt).getTime() < nowDate.getTime() + 13 * day);
  const hib = window.filter((s) => s.classTypeId === "hibrido");
  const shuffled = [...members].sort(() => r() - 0.5);
  for (const slot of window) {
    const fullTarget = hib[0] && slot.id === hib[0].id;
    const nearFull = hib[1] && slot.id === hib[1].id;
    const target = fullTarget ? slot.capacity : nearFull ? slot.capacity - 1 : Math.floor(slot.capacity * (0.3 + r() * 0.5));
    for (const m of shuffled) {
      if (spotsLeft(db, slot) <= (slot.capacity - target)) break;
      try { bookSlot(db, m.id, slot.id, nowDate); } catch { /* member cannot book this one, try the next */ }
    }
    if (fullTarget) {
      let waiting = 0;
      for (const m of shuffled) {
        if (waiting >= 2) break;
        try {
          const res = bookSlot(db, m.id, slot.id, nowDate);
          if (res.status === "waitlisted") waiting++;
        } catch { /* skip */ }
      }
    }
  }

  // The demo member already has one class booked
  const cycling = window.find((s) => s.classTypeId === "cycling");
  if (cycling) { try { bookSlot(db, demo.id, cycling.id, nowDate); } catch { /* ignore */ } }

  // Quiet the bell for sample data, then leave a couple of fresh notices for the demo member
  for (const n of db.notifications) n.readAt = n.createdAt;
  const fresh = new Date(nowDate.getTime() - 3_600_000);
  db.notifications.push(
    { id: nextId(db, "n"), memberId: demo.id, kind: "system", title: "Bienvenida a la demo", body: "Esta es una demostración con datos de ejemplo. Prueba reservar, cancelar y entrar a la lista de espera.", createdAt: fresh.toISOString() },
    { id: nextId(db, "n"), memberId: demo.id, kind: "reminder", title: "Recuerda tu próxima clase", body: "Revisa tus reservas en el portal.", createdAt: new Date(fresh.getTime() + 600_000).toISOString() },
  );
  return db;
}
