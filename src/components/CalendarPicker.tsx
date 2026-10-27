"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/client";
import { addDays, dateKey, formatLongDay, fromKey, mondayOf, now } from "@/lib/time";
import type { ClassView } from "@/lib/views";

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

/**
 * Month calendar. Pick a day, then see its classes underneath.
 * `renderDay` draws the list for the chosen day: member booking cards or the staff roster.
 */
export function CalendarPicker({ allowPast = false, renderDay }: {
  allowPast?: boolean;
  renderDay: (day: string, classes: ClassView[], reload: () => void) => React.ReactNode;
}) {
  const today = dateKey(now());
  const [ym, setYm] = useState(today.slice(0, 7));
  const [sel, setSel] = useState(today);
  const [classes, setClasses] = useState<ClassView[]>([]);
  const first = `${ym}-01`;
  const gridStart = mondayOf(first);
  const cells = useMemo(() => Array.from({ length: 42 }, (_, i) => addDays(gridStart, i)), [gridStart]);
  const minYm = allowPast ? addDays(today, -60).slice(0, 7) : today.slice(0, 7);
  const maxYm = addDays(today, 56).slice(0, 7);

  const load = useCallback(async () => {
    const d = await api<{ classes: ClassView[] }>(`/api/classes?from=${cells[0]}&to=${cells[41]}`);
    setClasses(d.classes);
  }, [cells]);
  useEffect(() => { load(); }, [load]);

  const byDay = useMemo(() => {
    const m = new Map<string, ClassView[]>();
    for (const c of classes) { const k = dateKey(new Date(c.startsAt)); m.set(k, [...(m.get(k) ?? []), c]); }
    return m;
  }, [classes]);

  const [y, mo] = ym.split("-").map(Number);
  const shift = (n: number) => { const t = new Date(Date.UTC(y, mo - 1 + n, 1)); setYm(`${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}`); };
  const dayClasses = (byDay.get(sel) ?? []).filter((c) => !c.cancelled || allowPast);
  const nav = "border border-line px-4 py-2 hover:border-accent disabled:opacity-30 disabled:hover:border-line";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
      <div>
        <div className="flex items-center justify-between">
          <button className={nav} disabled={ym <= minYm} onClick={() => shift(-1)} aria-label="Mes anterior">←</button>
          <h3 className="text-2xl">{MONTHS[mo - 1]} {y}</h3>
          <button className={nav} disabled={ym >= maxYm} onClick={() => shift(1)} aria-label="Mes siguiente">→</button>
        </div>
        <div className="mt-3 grid grid-cols-7 text-center text-sm text-muted">{WEEK.map((w) => <span key={w} className="py-1">{w}</span>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d) => {
            const list = (byDay.get(d) ?? []).filter((c) => !c.cancelled);
            const inMonth = d.slice(0, 7) === ym;
            const disabled = !allowPast && d < today;
            const isSel = d === sel;
            return (
              <button
                key={d}
                disabled={disabled}
                onClick={() => { setSel(d); if (!inMonth) setYm(d.slice(0, 7)); }}
                aria-pressed={isSel}
                aria-label={`${formatLongDay(fromKey(d))}, ${list.length} clases`}
                className={`flex aspect-square flex-col items-center justify-center gap-1 border text-base ${isSel ? "border-accent bg-accent text-accent-ink" : d === today ? "border-accent" : "border-line hover:border-accent"} ${inMonth ? "" : "opacity-40"} disabled:opacity-20 disabled:hover:border-line`}
              >
                <span className="font-semibold">{Number(d.slice(8))}</span>
                <span className="flex h-2 gap-0.5">
                  {list.slice(0, 4).map((c) => <span key={c.id} className="h-2 w-2" style={{ background: isSel ? "#0b0b0a" : c.color }} />)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div aria-live="polite">
        <h3 className="text-2xl first-letter:uppercase">{formatLongDay(fromKey(sel))}</h3>
        {dayClasses.length === 0 ? <p className="mt-3 text-muted">No hay clases este día.</p> : <div className="mt-4">{renderDay(sel, dayClasses, load)}</div>}
      </div>
    </div>
  );
}
