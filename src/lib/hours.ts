import { tenant } from "@/config/tenant";
import { addDays, dateKey, fromKey, localParts, weekdayOfKey } from "./time";

export interface OpenStatus {
  open: boolean;
  /** When it closes (if open) or opens next (if closed). */
  at: Date;
  /** 0 = today, 1 = tomorrow, 2+ = later in the week. Only meaningful when closed. */
  dayOffset: number;
  weekday: number;
}

/** Is the gym open at `at`, and when does that change next. */
export function openStatus(at: Date): OpenStatus {
  const today = dateKey(at);
  const hoursOf = (key: string) => tenant.openingHours[weekdayOfKey(key)];
  const [open0, close0] = hoursOf(today);
  const opens = fromKey(today, open0);
  const closes = fromKey(today, close0);
  if (at >= opens && at < closes) return { open: true, at: closes, dayOffset: 0, weekday: localParts(at).weekday };
  if (at < opens) return { open: false, at: opens, dayOffset: 0, weekday: weekdayOfKey(today) };
  const next = addDays(today, 1);
  return { open: false, at: fromKey(next, hoursOf(next)[0]), dayOffset: 1, weekday: weekdayOfKey(next) };
}
