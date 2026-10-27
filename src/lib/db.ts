import { tenant } from "@/config/tenant";
import type { Db } from "./types";
import { rawDb, setDb } from "./store";
import { seedDb } from "./seed";
import { generateSlots } from "./schedule";
import { addDays, dateKey, now } from "./time";
import { closePastClasses } from "./booking";

/** Add slots until the schedule reaches the configured horizon. Safe to run often. */
export function ensureHorizon(db: Db, at: Date) {
  const target = addDays(dateKey(at), tenant.booking.scheduleWeeksAhead * 7);
  if (db.slotsGeneratedUntil >= target) return;
  const from = db.slotsGeneratedUntil ? addDays(db.slotsGeneratedUntil, 1) : dateKey(at);
  const known = new Set(db.slots.map((s) => s.id));
  for (const s of generateSlots(from, target, db.templates)) if (!known.has(s.id)) db.slots.push(s);
  db.slotsGeneratedUntil = target;
}

/** The one entry point to data for pages and routes. Seeds on first use. */
export function getDb(): Db {
  let db = rawDb();
  if (!db) {
    db = seedDb(now());
    setDb(db);
  }
  const at = now();
  ensureHorizon(db, at);
  closePastClasses(db, at);
  return db;
}

export function resetDb(): Db {
  const db = seedDb(now());
  setDb(db);
  return db;
}
