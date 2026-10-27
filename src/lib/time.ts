/**
 * Every date question goes through this file. Colombia has no daylight saving,
 * so the tenant timezone is a fixed UTC-5 and local math stays simple.
 */
import { tenant } from "@/config/tenant";

const OFFSET_HOURS = 5;
let clockOverride: Date | null = null;

/** Tests pin the clock. The app always uses the real time. */
export function setClock(d: Date | null) {
  clockOverride = d;
}
export const now = () => (clockOverride ? new Date(clockOverride) : new Date());

const pad = (n: number) => String(n).padStart(2, "0");

export function localParts(d: Date) {
  const s = new Date(d.getTime() - OFFSET_HOURS * 3600_000);
  return {
    y: s.getUTCFullYear(),
    m: s.getUTCMonth() + 1,
    d: s.getUTCDate(),
    hh: s.getUTCHours(),
    mm: s.getUTCMinutes(),
    weekday: s.getUTCDay(),
  };
}

export function dateKey(d: Date): string {
  const p = localParts(d);
  return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}

export function fromKey(key: string, time = "00:00"): Date {
  const [y, m, d] = key.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh + OFFSET_HOURS, mm));
}

export function addDays(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

export function weekdayOfKey(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Weeks start on Monday. */
export function mondayOf(key: string): string {
  const wd = weekdayOfKey(key);
  return addDays(key, wd === 0 ? -6 : 1 - wd);
}

const timeFmt = new Intl.DateTimeFormat("es-CO", { timeZone: tenant.timezone, hour: "numeric", minute: "2-digit", hour12: true });
const dayFmt = new Intl.DateTimeFormat("es-CO", { timeZone: tenant.timezone, weekday: "short", day: "numeric", month: "short" });
const dayFmtEn = new Intl.DateTimeFormat("en-US", { timeZone: tenant.timezone, weekday: "short", month: "short", day: "numeric" });
const longDayFmtEn = new Intl.DateTimeFormat("en-US", { timeZone: tenant.timezone, weekday: "long", month: "long", day: "numeric" });
const longDayFmt = new Intl.DateTimeFormat("es-CO", { timeZone: tenant.timezone, weekday: "long", day: "numeric", month: "long" });

export const formatTime = (d: Date | string) => timeFmt.format(new Date(d)).replace(/\./g, "").replace(/\s?([ap])\s?m/i, (_, x) => ` ${x.toUpperCase()}M`);
export const formatDay = (d: Date | string, lang: "es" | "en" = "es") => (lang === "en" ? dayFmtEn : dayFmt).format(new Date(d)).replace(/\./g, "");
export const formatLongDay = (d: Date | string, lang: "es" | "en" = "es") => (lang === "en" ? longDayFmtEn : longDayFmt).format(new Date(d));
export const formatCop = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
