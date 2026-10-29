import { events, tenant } from "@/config/tenant";
import { Words } from "@/components/words";
import { getDb } from "@/lib/db";
import { eventSpotsLeft, eventStart } from "@/lib/events";
import { formatCop, formatLongDay, formatTime, fromKey, now } from "@/lib/time";
import { EventSignup } from "./EventSignup";

export const metadata = { title: "Eventos" };
export const dynamic = "force-dynamic";

export default async function Eventos() {
  const db = getDb();
  const at = now();
  const upcoming = events.filter((e) => eventStart(e) > at);
  return (
    <div className="px-6 pt-10 lg:px-16">
      <h1 className="text-5xl sm:text-6xl"><Words text="Eventos" /></h1>
      <p className="mt-3 max-w-xl text-muted">Planes fuera de la rutina con cupos limitados. Inscríbete en un minuto y tu lugar queda guardado.</p>
      <p className="mt-2 text-sm text-muted">{tenant.copy.sampleNote}</p>
      {upcoming.length === 0 && <p className="mt-10 text-muted">No hay eventos próximos. Vuelve pronto.</p>}
      <ul className="mt-10 grid gap-6 lg:grid-cols-2">
        {upcoming.map((e) => {
          const left = eventSpotsLeft(db, e);
          const taken = e.capacity - left;
          return (
            <li key={e.id} className="border border-line bg-surface">
              <div className="border-b border-line p-6 sm:p-8" style={{ background: "linear-gradient(160deg, var(--color-surface-2), var(--color-surface))" }}>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{formatLongDay(fromKey(e.date))} · {formatTime(eventStart(e))}</p>
                <h2 className="mt-3 text-4xl sm:text-5xl"><Words text={e.title} /></h2>
                <p className="mt-3 max-w-md text-muted">{e.blurb}</p>
                <p className="mt-4 text-paper">{e.place}</p>
                <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                  <p className="font-display text-4xl font-bold text-accent">{formatCop(e.priceCop)} <span className="text-sm font-normal text-muted">por persona</span></p>
                  <p className={`text-sm font-semibold ${left === 0 ? "text-bad" : left <= 8 ? "text-warn" : "text-ok"}`}>
                    {left === 0 ? "Agotado" : left === 1 ? "Queda 1 cupo" : `Quedan ${left} cupos`}
                  </p>
                </div>
                <div className="mt-3 h-1.5 w-full bg-line" role="presentation">
                  <div className="h-full bg-accent" style={{ width: `${Math.round((taken / e.capacity) * 100)}%` }} />
                </div>
              </div>
              <EventSignup eventId={e.id} title={e.title} left={left} max={e.maxPerSignup} priceCop={e.priceCop} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
