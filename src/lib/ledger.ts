import type { Db, LedgerEntry } from "./types";
import { nextId } from "./store";

export function balance(db: Db, memberId: string): number {
  return db.ledger.reduce((sum, e) => (e.memberId === memberId ? sum + e.delta : sum), 0);
}

export function addLedger(
  db: Db,
  memberId: string,
  delta: number,
  reason: LedgerEntry["reason"],
  at: Date,
  extra: { refId?: string; note?: string } = {},
): LedgerEntry {
  const entry: LedgerEntry = { id: nextId(db, "l"), memberId, delta, reason, at: at.toISOString(), ...extra };
  db.ledger.push(entry);
  return entry;
}
