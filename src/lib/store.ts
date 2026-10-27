import type { Db } from "./types";

/**
 * In-memory database for the demo, kept on globalThis so every route and
 * server component in the process shares one copy.
 *
 * Production swaps this file for Postgres (Supabase, like Focus). All reads
 * and writes in the app go through the functions in lib/, never through this
 * object directly from a page, so the swap stays in one place.
 */
const KEY = Symbol.for("forma-y-figura.db");
type G = typeof globalThis & { [KEY]?: Db };

export function emptyDb(): Db {
  return {
    profiles: [],
    memberships: [],
    ledger: [],
    templates: [],
    slots: [],
    bookings: [],
    waitlist: [],
    notifications: [],
    payments: [],
    contracts: [],
    eventSignups: [],
    suggestions: [],
    seq: 1,
    slotsGeneratedUntil: "",
  };
}

export function setDb(db: Db) {
  (globalThis as G)[KEY] = db;
}

export function rawDb(): Db | undefined {
  return (globalThis as G)[KEY];
}

export function nextId(db: Db, prefix: string): string {
  return `${prefix}_${(db.seq++).toString(36)}`;
}
