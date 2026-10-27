import assert from "node:assert/strict";
import { colombianHolidays, holidayName } from "../src/lib/holidays";
import { generateSlots } from "../src/lib/schedule";
import { seedDb, DEMO_ACCOUNTS } from "../src/lib/seed";
import { emptyDb, nextId } from "../src/lib/store";
import { classTypes, coaches, events, templates } from "../src/config/tenant";
import { addSuggestion, eventSpotsLeft, signUpForEvent } from "../src/lib/events";
import { bookSlot, cancelBooking, checkIn, spotsLeft, waitlistFor, cancelSlot } from "../src/lib/booking";
import { registerPayment } from "../src/lib/membership";
import { balance } from "../src/lib/ledger";
import { sendClassReminders, runMembershipRenewals } from "../src/lib/jobs";
import { buildReport } from "../src/lib/reports";
import { openStatus } from "../src/lib/hours";
import { tenant } from "../src/config/tenant";
import { addDays, fromKey } from "../src/lib/time";
import { createClass } from "../src/lib/classes";
import { DomainError } from "../src/lib/types";
import type { Db, Profile, Slot } from "../src/lib/types";

let passed = 0;
const failures: string[] = [];
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ok  ${name}`); }
  catch (e) { failures.push(name); console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}
function throwsCode(fn: () => unknown, code: string) {
  try { fn(); } catch (e) { assert.ok(e instanceof DomainError, "expected DomainError"); assert.equal((e as DomainError).code, code); return; }
  assert.fail(`expected ${code}`);
}

const NOW = new Date("2026-10-26T15:00:00Z"); // Monday 10:00 in Bogota
const HOUR = 3_600_000;

function world() {
  const db = emptyDb();
  const mk = (id: string, role: Profile["role"], extra: Partial<Profile> = {}): Profile => {
    const p: Profile = { id, name: id, email: `${id}@x.co`, phone: "300", emergencyName: "e", emergencyPhone: "310", role, createdAt: NOW.toISOString(), ...extra };
    db.profiles.push(p); return p;
  };
  const admin = mk("admin", "admin");
  const reception = mk("rec", "reception");
  const coach = mk("coach", "coach", { coachId: "c_andres" });
  const a = mk("a", "member"); const b = mk("b", "member"); const c = mk("c", "member");
  const slot = (id: string, startMs: number, capacity: number, coachId = "c_andres"): Slot => {
    const s: Slot = { id, classTypeId: classTypes[0].id, startsAt: new Date(startMs).toISOString(), endsAt: new Date(startMs + HOUR).toISOString(), capacity, coachId, status: "scheduled" };
    db.slots.push(s); return s;
  };
  return { db, admin, reception, coach, a, b, c, slot };
}

console.log("holidays");
test("2026 fixed and moved holidays", () => {
  const h = colombianHolidays(2026);
  assert.ok(h.has("2026-01-01"));
  assert.ok(h.has("2026-12-25"));
  assert.ok(h.has("2026-07-20"));
  assert.ok(h.has("2026-08-07"));
  assert.ok(h.has("2026-01-12"), "Reyes moves to Monday Jan 12");
  assert.ok(h.has("2026-04-02") && h.has("2026-04-03"), "Holy Thursday and Friday");
});
test("holidayName finds one", () => assert.ok(holidayName("2026-12-25")));

console.log("schedule");
test("slots skip holidays and are deterministic", () => {
  const s1 = generateSlots("2026-12-21", "2026-12-27", templates);
  const s2 = generateSlots("2026-12-21", "2026-12-27", templates);
  assert.deepEqual(s1.map((s) => s.id), s2.map((s) => s.id));
  assert.ok(!s1.some((s) => s.id.endsWith("2026-12-25")));
  assert.equal(new Set(s1.map((s) => s.id)).size, s1.length);
});

console.log("credits and booking");
test("pack gives credits, booking spends one, cancel refunds", () => {
  const { db, a, slot } = world();
  registerPayment(db, a.id, "pack12", "bold", "approved", NOW);
  const s = slot("s1", NOW.getTime() + 24 * HOUR, 5);
  assert.equal(balance(db, a.id), 12);
  const r = bookSlot(db, a.id, s.id, NOW);
  assert.equal(r.status, "booked");
  assert.equal(balance(db, a.id), 11);
  const booking = db.bookings[0];
  cancelBooking(db, booking.id, { actor: a }, NOW);
  assert.equal(balance(db, a.id), 12);
});
test("no plan, no booking", () => {
  const { db, a, slot } = world();
  const s = slot("s1", NOW.getTime() + 24 * HOUR, 5);
  throwsCode(() => bookSlot(db, a.id, s.id, NOW), "NO_MEMBERSHIP");
});
test("declined payment gives nothing", () => {
  const { db, a } = world();
  registerPayment(db, a.id, "pack12", "bold", "declined", NOW);
  assert.equal(balance(db, a.id), 0);
  assert.equal(db.memberships.length, 0);
});
test("no credits left blocks booking", () => {
  const { db, a, slot } = world();
  registerPayment(db, a.id, "dia", "cash", "approved", NOW);
  const s1 = slot("s1", NOW.getTime() + 2 * HOUR, 5);
  const s2 = slot("s2", NOW.getTime() + 4 * HOUR, 5);
  bookSlot(db, a.id, s1.id, NOW);
  throwsCode(() => bookSlot(db, a.id, s2.id, NOW), "NO_CREDITS");
});
test("double booking is refused", () => {
  const { db, a, slot } = world();
  registerPayment(db, a.id, "mensual", "bold", "approved", NOW);
  const s = slot("s1", NOW.getTime() + 24 * HOUR, 5);
  bookSlot(db, a.id, s.id, NOW);
  throwsCode(() => bookSlot(db, a.id, s.id, NOW), "ALREADY_BOOKED");
});
test("unlimited plan costs no credits", () => {
  const { db, a, slot } = world();
  registerPayment(db, a.id, "mensual", "bold", "approved", NOW);
  const s = slot("s1", NOW.getTime() + 24 * HOUR, 5);
  bookSlot(db, a.id, s.id, NOW);
  assert.equal(balance(db, a.id), 0);
  assert.equal(db.bookings[0].creditCost, 0);
});
test("daily limit of 2", () => {
  const { db, a, slot } = world();
  registerPayment(db, a.id, "mensual", "bold", "approved", NOW);
  const base = NOW.getTime() + 24 * HOUR;
  const s1 = slot("s1", base, 5), s2 = slot("s2", base + 2 * HOUR, 5), s3 = slot("s3", base + 4 * HOUR, 5);
  bookSlot(db, a.id, s1.id, NOW); bookSlot(db, a.id, s2.id, NOW);
  throwsCode(() => bookSlot(db, a.id, s3.id, NOW), "DAILY_LIMIT");
});
test("booking opens only 14 days ahead", () => {
  const { db, a, slot } = world();
  registerPayment(db, a.id, "mensual", "bold", "approved", NOW);
  const s = slot("s1", NOW.getTime() + 20 * 24 * HOUR, 5);
  throwsCode(() => bookSlot(db, a.id, s.id, NOW), "TOO_EARLY");
});
test("past class cannot be booked", () => {
  const { db, a, slot } = world();
  registerPayment(db, a.id, "mensual", "bold", "approved", NOW);
  const s = slot("s1", NOW.getTime() - HOUR, 5);
  throwsCode(() => bookSlot(db, a.id, s.id, NOW), "SLOT_PAST");
});
test("member cannot cancel inside 2 hours, staff can", () => {
  const { db, a, reception, slot } = world();
  registerPayment(db, a.id, "pack12", "bold", "approved", NOW);
  const s = slot("s1", NOW.getTime() + HOUR, 5);
  bookSlot(db, a.id, s.id, NOW);
  const id = db.bookings[0].id;
  throwsCode(() => cancelBooking(db, id, { actor: a }, NOW), "CANCEL_TOO_LATE");
  cancelBooking(db, id, { actor: reception }, NOW);
  assert.equal(balance(db, a.id), 12);
});
test("another member cannot cancel my booking", () => {
  const { db, a, b, slot } = world();
  registerPayment(db, a.id, "mensual", "bold", "approved", NOW);
  const s = slot("s1", NOW.getTime() + 24 * HOUR, 5);
  bookSlot(db, a.id, s.id, NOW);
  throwsCode(() => cancelBooking(db, db.bookings[0].id, { actor: b }, NOW), "FORBIDDEN");
});

console.log("capacity and waitlist");
test("full class sends the next member to the waitlist, cancel promotes in order", () => {
  const { db, a, b, c, slot } = world();
  for (const m of [a, b, c]) registerPayment(db, m.id, "pack12", "bold", "approved", NOW);
  const s = slot("s1", NOW.getTime() + 24 * HOUR, 1);
  assert.equal(bookSlot(db, a.id, s.id, NOW).status, "booked");
  const rb = bookSlot(db, b.id, s.id, new Date(NOW.getTime() + 1000));
  const rc = bookSlot(db, c.id, s.id, new Date(NOW.getTime() + 2000));
  assert.equal(rb.status, "waitlisted"); assert.equal(rc.status, "waitlisted");
  assert.equal(spotsLeft(db, s), 0);
  assert.equal(waitlistFor(db, s.id).length, 2);
  cancelBooking(db, db.bookings.find((x) => x.memberId === a.id)!.id, { actor: a }, NOW);
  const bBooking = db.bookings.find((x) => x.memberId === b.id && x.status === "booked");
  assert.ok(bBooking, "b promoted first");
  assert.ok(!db.bookings.find((x) => x.memberId === c.id && x.status === "booked"), "c still waiting");
  assert.equal(waitlistFor(db, s.id).length, 1);
  assert.equal(balance(db, b.id), 11);
  assert.ok(db.notifications.some((n) => n.memberId === b.id && n.kind === "waitlist"));
});
test("class never exceeds capacity", () => {
  const { db, slot, a, b, c } = world();
  const s = slot("s1", NOW.getTime() + 24 * HOUR, 2);
  for (const m of [a, b, c]) registerPayment(db, m.id, "mensual", "bold", "approved", NOW);
  for (const m of [a, b, c]) bookSlot(db, m.id, s.id, NOW);
  assert.equal(db.bookings.filter((x) => x.status === "booked").length, 2);
});
test("cancelling a class refunds everyone and clears the waitlist", () => {
  const { db, a, b, slot } = world();
  for (const m of [a, b]) registerPayment(db, m.id, "pack12", "bold", "approved", NOW);
  const s = slot("s1", NOW.getTime() + 24 * HOUR, 1);
  bookSlot(db, a.id, s.id, NOW); bookSlot(db, b.id, s.id, NOW);
  cancelSlot(db, s.id, NOW);
  assert.equal(balance(db, a.id), 12);
  assert.equal(db.waitlist.length, 0);
  assert.equal(s.status, "cancelled");
});

console.log("check-in");
test("reception checks in same day; members cannot; coaches only their classes", () => {
  const { db, a, reception, coach, slot } = world();
  registerPayment(db, a.id, "mensual", "bold", "approved", NOW);
  const today = slot("today", NOW.getTime() + 3 * HOUR, 5);
  const other = slot("other", NOW.getTime() + 4 * HOUR, 5, "c_laura");
  bookSlot(db, a.id, today.id, NOW); bookSlot(db, a.id, other.id, NOW);
  const b1 = db.bookings.find((x) => x.slotId === today.id)!;
  const b2 = db.bookings.find((x) => x.slotId === other.id)!;
  throwsCode(() => checkIn(db, b1.id, a, NOW), "FORBIDDEN");
  throwsCode(() => checkIn(db, b2.id, coach, NOW), "FORBIDDEN");
  assert.equal(checkIn(db, b1.id, coach, NOW).status, "attended");
  assert.equal(checkIn(db, b2.id, reception, NOW).status, "attended");
});
test("check-in on another day is refused", () => {
  const { db, a, reception, slot } = world();
  registerPayment(db, a.id, "mensual", "bold", "approved", NOW);
  const s = slot("s1", NOW.getTime() + 48 * HOUR, 5);
  bookSlot(db, a.id, s.id, NOW);
  throwsCode(() => checkIn(db, db.bookings[0].id, reception, NOW), "NOT_TODAY");
});

console.log("jobs");
test("reminders are sent once", () => {
  const { db, a, slot } = world();
  registerPayment(db, a.id, "mensual", "bold", "approved", NOW);
  const s = slot("s1", NOW.getTime() + 5 * HOUR, 5);
  bookSlot(db, a.id, s.id, NOW);
  assert.equal(sendClassReminders(db, NOW), 1);
  assert.equal(sendClassReminders(db, NOW), 0);
});
test("renewal warning once, expiry afterwards", () => {
  const { db, a } = world();
  registerPayment(db, a.id, "dia", "cash", "approved", new Date(NOW.getTime() - 0.5 * 86_400_000));
  const r1 = runMembershipRenewals(db, NOW);
  assert.equal(r1.warned, 1);
  assert.equal(runMembershipRenewals(db, NOW).warned, 0);
  const later = new Date(NOW.getTime() + 3 * 86_400_000);
  assert.equal(runMembershipRenewals(db, later).expired, 1);
});
test("early renewal does not lose days", () => {
  const { db, a } = world();
  const first = registerPayment(db, a.id, "mensual", "bold", "approved", NOW).membership!;
  const second = registerPayment(db, a.id, "mensual", "bold", "approved", new Date(NOW.getTime() + 10 * 86_400_000)).membership!;
  assert.equal(new Date(second.endsAt).getTime(), new Date(first.endsAt).getTime() + 30 * 86_400_000);
});

console.log("admin");
test("only admins create classes", () => {
  const { db, admin, reception } = world();
  const input = { classTypeId: classTypes[0].id, date: "2026-11-02", time: "18:00", durationMin: 60, capacity: 10, coachId: coaches[0].id };
  throwsCode(() => createClass(db, reception, input, NOW), "FORBIDDEN");
  const s = createClass(db, admin, input, NOW);
  assert.equal(s.capacity, 10);
  throwsCode(() => createClass(db, admin, { ...input, date: "2026-10-01" }, NOW), "BAD_INPUT");
});

console.log("seed");
let seeded: Db;
test("seed builds a coherent demo", () => {
  seeded = seedDb(NOW);
  assert.ok(seeded.profiles.filter((p) => p.role === "member").length >= 60);
  const demo = seeded.profiles.find((p) => p.id === DEMO_ACCOUNTS.member)!;
  assert.ok(demo);
  const bal = balance(seeded, demo.id);
  assert.ok(bal >= 0 && bal <= 12, `demo balance ${bal}`);
  for (const m of seeded.profiles) assert.ok(balance(seeded, m.id) >= 0, `negative balance for ${m.id}`);
  for (const s of seeded.slots) {
    const n = seeded.bookings.filter((b) => b.slotId === s.id && (b.status === "booked" || b.status === "attended")).length;
    assert.ok(n <= s.capacity, `${s.id} over capacity`);
  }
  assert.equal(new Set(seeded.slots.map((s) => s.id)).size, seeded.slots.length);
});
test("seed has a full class with a waitlist", () => {
  const full = seeded.slots.filter((s) => new Date(s.startsAt) > NOW && spotsLeft(seeded, s) === 0 && waitlistFor(seeded, s.id).length >= 1);
  assert.ok(full.length >= 1);
});
test("seed is deterministic", () => {
  const again = seedDb(NOW);
  assert.equal(again.payments.length, seeded.payments.length);
  assert.equal(again.bookings.length, seeded.bookings.length);
});
test("report numbers are sane", () => {
  const r = buildReport(seeded, NOW);
  assert.ok(r.activeMembers > 10);
  assert.ok(r.revenue30d > 0);
  assert.ok(r.occupancy30d > 0 && r.occupancy30d <= 1);
  assert.equal(r.weekly.length, 8);
  assert.ok(nextId(seeded, "t"));
});

console.log("events and suggestions");
test("an event never takes more people than its capacity", () => {
  const db = emptyDb();
  const e = { ...events[0], capacity: 5, maxPerSignup: 3 };
  const early = new Date(e.date + "T00:00:00-05:00");
  early.setDate(early.getDate() - 10);
  signUpForEvent(db, e, { name: "Ana", phone: "3000000000", people: 3 }, early);
  throwsCode(() => signUpForEvent(db, e, { name: "Luis", phone: "3000000001", people: 3 }, early), "NOT_ENOUGH_SPOTS");
  signUpForEvent(db, e, { name: "Luis", phone: "3000000001", people: 2 }, early);
  assert.equal(eventSpotsLeft(db, e), 0);
  throwsCode(() => signUpForEvent(db, e, { name: "Eva", phone: "3000000002", people: 1 }, early), "SOLD_OUT");
});
test("event signups are refused after the event starts and for bad group sizes", () => {
  const db = emptyDb();
  const e = { ...events[0], capacity: 10, maxPerSignup: 2 };
  const late = new Date(e.date + "T23:00:00-05:00");
  throwsCode(() => signUpForEvent(db, e, { name: "Ana", phone: "3000000000", people: 1 }, late), "EVENT_PAST");
  const early = new Date(late.getTime() - 20 * 86_400_000);
  throwsCode(() => signUpForEvent(db, e, { name: "Ana", phone: "3000000000", people: 3 }, early), "BAD_PEOPLE");
  throwsCode(() => signUpForEvent(db, e, { name: "Ana", phone: "3000000000", people: 0 }, early), "BAD_PEOPLE");
});
test("suggestions are stored unread and need a real message", () => {
  const db = emptyDb();
  throwsCode(() => addSuggestion(db, { kind: "idea", message: "ok" }, NOW), "BAD_INPUT");
  const s = addSuggestion(db, { kind: "idea", name: "  ", message: "Más clases los sábados, por favor." }, NOW);
  assert.equal(s.read, false);
  assert.equal(s.name, undefined);
  assert.equal(db.suggestions.length, 1);
});
test("the seed leaves each event with a few spots left", () => {
  for (const e of events) {
    const left = eventSpotsLeft(seeded, e);
    assert.ok(left > 0 && left <= 7, `${e.id} has ${left} left`);
  }
});

console.log("opening hours");
test("open now follows the weekly hours and skips closed days", () => {
  const monday = "2026-11-02";
  for (let i = 0; i < 7; i++) {
    const key = addDays(monday, i);
    const wd = (1 + i) % 7;
    const hours = tenant.openingHours[wd];
    const noon = fromKey(key, "12:00");
    const s = openStatus(noon);
    if (!hours) {
      assert.equal(s.open, false, `${key} should be closed`);
      assert.ok(s.at > noon, "next opening is later");
      assert.ok(tenant.openingHours[(wd + s.dayOffset) % 7], "next opening falls on an open day");
    } else {
      const [o, c] = hours;
      const inside = noon >= fromKey(key, o) && noon < fromKey(key, c);
      assert.equal(s.open, inside, `${key} noon`);
      const early = openStatus(fromKey(key, "03:00"));
      assert.equal(early.open, false);
      assert.equal(early.at.getTime(), fromKey(key, o).getTime());
    }
  }
});

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
