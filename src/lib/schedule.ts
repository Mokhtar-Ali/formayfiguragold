import { templates as defaultTemplates } from "@/config/tenant";
import type { ClassTemplate, Slot } from "./types";
import { addDays, fromKey, weekdayOfKey } from "./time";
import { holidayName } from "./holidays";

/**
 * Expand weekly templates into dated slots between two local dates (inclusive).
 * Holidays produce no slot. Slot ids are deterministic, so running this twice
 * never creates duplicates.
 */
export function generateSlots(
  fromKeyStr: string,
  toKeyStr: string,
  templates: ClassTemplate[] = defaultTemplates,
): Slot[] {
  const out: Slot[] = [];
  for (let key = fromKeyStr; key <= toKeyStr; key = addDays(key, 1)) {
    if (holidayName(key)) continue;
    const wd = weekdayOfKey(key);
    for (const t of templates) {
      if (t.weekday !== wd) continue;
      const start = fromKey(key, t.time);
      out.push({
        id: `s_${t.id}_${key}`,
        templateId: t.id,
        classTypeId: t.classTypeId,
        startsAt: start.toISOString(),
        endsAt: new Date(start.getTime() + t.durationMin * 60_000).toISOString(),
        capacity: t.capacity,
        coachId: t.coachId,
        status: "scheduled",
      });
    }
  }
  return out;
}
