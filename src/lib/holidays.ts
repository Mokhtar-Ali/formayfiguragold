import { addDays, weekdayOfKey } from "./time";

/** Gregorian Easter (anonymous algorithm). Returns a YYYY-MM-DD key. */
function easter(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Colombian law (Ley Emiliani): some holidays move to the following Monday. */
function toMonday(key: string): string {
  const wd = weekdayOfKey(key);
  if (wd === 1) return key;
  return addDays(key, wd === 0 ? 1 : 8 - wd);
}

const cache = new Map<number, Map<string, string>>();

/** Public holidays of Colombia for one year, as dateKey to name. */
export function colombianHolidays(year: number): Map<string, string> {
  const hit = cache.get(year);
  if (hit) return hit;
  const y = String(year);
  const e = easter(year);
  const map = new Map<string, string>();
  const put = (k: string, name: string) => map.set(k, name);

  // Fixed dates
  put(`${y}-01-01`, "Año Nuevo");
  put(`${y}-05-01`, "Día del Trabajo");
  put(`${y}-07-20`, "Día de la Independencia");
  put(`${y}-08-07`, "Batalla de Boyacá");
  put(`${y}-12-08`, "Inmaculada Concepción");
  put(`${y}-12-25`, "Navidad");
  // Moved to Monday
  put(toMonday(`${y}-01-06`), "Reyes Magos");
  put(toMonday(`${y}-03-19`), "San José");
  put(toMonday(`${y}-06-29`), "San Pedro y San Pablo");
  put(toMonday(`${y}-08-15`), "Asunción de la Virgen");
  put(toMonday(`${y}-10-12`), "Día de la Raza");
  put(toMonday(`${y}-11-01`), "Todos los Santos");
  put(toMonday(`${y}-11-11`), "Independencia de Cartagena");
  // Relative to Easter
  put(addDays(e, -3), "Jueves Santo");
  put(addDays(e, -2), "Viernes Santo");
  put(addDays(e, 43), "Ascensión del Señor");
  put(addDays(e, 64), "Corpus Christi");
  put(addDays(e, 71), "Sagrado Corazón");

  cache.set(year, map);
  return map;
}

export function holidayName(key: string): string | undefined {
  return colombianHolidays(Number(key.slice(0, 4))).get(key);
}
