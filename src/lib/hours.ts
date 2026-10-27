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

/** Is the gym open at `at`, and when does that change next. A weekday set to null is a closed day. */
export function openStatus(at: Date): OpenStatus {
  const today = dateKey(at);
  const hoursOf = (key: string) => tenant.openingHours[weekdayOfKey(key)] ?? null;
  const todays = hoursOf(today);
  if (todays) {
    const opens = fromKey(today, todays[0]);
    const closes = fromKey(today, todays[1]);
    if (at >= opens && at < closes) return { open: true, at: closes, dayOffset: 0, weekday: localParts(at).weekday };
    if (at < opens) return { open: false, at: opens, dayOffset: 0, weekday: weekdayOfKey(today) };
  }
  for (let i = 1; i <= 7; i++) {
    const key = addDays(today, i);
    const h = hoursOf(key);
    if (h) return { open: false, at: fromKey(key, h[0]), dayOffset: i, weekday: weekdayOfKey(key) };
  }
  return { open: false, at: fromKey(today, "00:00"), dayOffset: 0, weekday: weekdayOfKey(today) };
}
