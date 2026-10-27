import type { Db, EventDef, EventSignup, Suggestion, SuggestionKind } from "./types";
import { DomainError } from "./types";
import { nextId } from "./store";
import { fromKey } from "./time";

export const eventStart = (e: EventDef) => fromKey(e.date, e.time);

export function eventSpotsLeft(db: Db, e: EventDef): number {
  const taken = db.eventSignups.filter((s) => s.eventId === e.id).reduce((n, s) => n + s.people, 0);
  return Math.max(0, e.capacity - taken);
}

/** One signup can take up to maxPerSignup spots. The check and the write happen in one synchronous step. */
export function signUpForEvent(
  db: Db,
  e: EventDef,
  input: { name: string; phone: string; people: number },
  at: Date,
): EventSignup {
  if (eventStart(e) <= at) throw new DomainError("EVENT_PAST", "Este evento ya pasó.");
  if (!Number.isInteger(input.people) || input.people < 1 || input.people > e.maxPerSignup)
    throw new DomainError("BAD_PEOPLE", `Puedes inscribir de 1 a ${e.maxPerSignup} personas.`);
  const left = eventSpotsLeft(db, e);
  if (left === 0) throw new DomainError("SOLD_OUT", "Los cupos de este evento se agotaron.", 409);
  if (input.people > left) throw new DomainError("NOT_ENOUGH_SPOTS", `Solo quedan ${left} cupos.`, 409);
  const signup: EventSignup = {
    id: nextId(db, "ev"),
    eventId: e.id,
    name: input.name.trim(),
    phone: input.phone.trim(),
    people: input.people,
    createdAt: at.toISOString(),
  };
  db.eventSignups.push(signup);
  return signup;
}

export function addSuggestion(db: Db, input: { kind: SuggestionKind; name?: string; message: string }, at: Date): Suggestion {
  const message = input.message.trim();
  if (message.length < 5) throw new DomainError("BAD_INPUT", "Cuéntanos un poco más.");
  const s: Suggestion = {
    id: nextId(db, "sg"),
    kind: input.kind,
    name: input.name?.trim() || undefined,
    message,
    createdAt: at.toISOString(),
    read: false,
  };
  db.suggestions.push(s);
  return s;
}
