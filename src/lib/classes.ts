import type { Db, Profile, Slot } from "./types";
import { DomainError } from "./types";
import { nextId } from "./store";
import { fromKey } from "./time";
import { getClassType, getCoach } from "@/config/tenant";

export interface NewClassInput {
  classTypeId: string;
  /** Local date key, YYYY-MM-DD */
  date: string;
  /** Local time, HH:mm */
  time: string;
  durationMin: number;
  capacity: number;
  coachId: string;
}

/** One-off class added by an admin, outside the weekly templates. */
export function createClass(db: Db, actor: Profile, input: NewClassInput, nowDate: Date): Slot {
  if (actor.role !== "admin") throw new DomainError("FORBIDDEN", "Solo el administrador crea clases.", 403);
  if (!getClassType(input.classTypeId)) throw new DomainError("BAD_INPUT", "Tipo de clase inválido.");
  if (!getCoach(input.coachId)) throw new DomainError("BAD_INPUT", "Coach inválido.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !/^\d{2}:\d{2}$/.test(input.time))
    throw new DomainError("BAD_INPUT", "Fecha u hora inválida.");
  if (!(input.capacity >= 1 && input.capacity <= 60)) throw new DomainError("BAD_INPUT", "Cupo inválido.");
  if (!(input.durationMin >= 15 && input.durationMin <= 180)) throw new DomainError("BAD_INPUT", "Duración inválida.");
  const start = fromKey(input.date, input.time);
  if (start <= nowDate) throw new DomainError("BAD_INPUT", "La clase debe ser en el futuro.");
  const slot: Slot = {
    id: nextId(db, "s"),
    classTypeId: input.classTypeId,
    startsAt: start.toISOString(),
    endsAt: new Date(start.getTime() + input.durationMin * 60_000).toISOString(),
    capacity: input.capacity,
    coachId: input.coachId,
    status: "scheduled",
  };
  db.slots.push(slot);
  return slot;
}
