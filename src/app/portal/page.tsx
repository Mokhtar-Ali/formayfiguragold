import { redirect } from "next/navigation";
import { plans } from "@/config/tenant";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { now, formatDay, formatTime } from "@/lib/time";
import { classView, memberSummary } from "@/lib/views";
import { ClassCard } from "@/components/ClassCard";
import { RenewPlan } from "./RenewPlan";
import { MemberCalendar } from "@/components/MemberCalendar";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = { attended: "Asististe", no_show: "No asististe", cancelled: "Cancelada", booked: "Reservada" };

export default async function Portal() {
  const me = await getSession();
  if (!me) redirect("/entrar");
  if (me.role !== "member") redirect("/staff");
  const db = getDb();
  const at = now();
  const s = memberSummary(db, me.id, at);

  const rows = db.bookings
    .filter((b) => b.memberId === me.id)
    .map((b) => ({ b, slot: db.slots.find((x) => x.id === b.slotId)! }))
    .filter((x) => x.slot);
  const upcoming = rows.filter((x) => x.b.status === "booked" && new Date(x.slot.startsAt) > at).sort((a, b) => a.slot.startsAt.localeCompare(b.slot.startsAt));
  const history = rows.filter((x) => !(x.b.status === "booked" && new Date(x.slot.startsAt) > at)).sort((a, b) => b.slot.startsAt.localeCompare(a.slot.startsAt)).slice(0, 10);
  const waiting = db.waitlist.filter((w) => w.memberId === me.id).map((w) => db.slots.find((x) => x.id === w.slotId)).filter((x) => !!x);
  const unlimited = s.planKind === "unlimited";
  const daysLeft = s.endsAt ? Math.max(0, Math.ceil((new Date(s.endsAt).getTime() - at.getTime()) / 86_400_000)) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-5xl sm:text-6xl">Hola, {me.name.split(" ")[0]}</h1>
        <a href="/portal/ayuda" className="border border-line px-4 py-2 hover:border-accent">Centro de ayuda</a>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Mi plan">
        <div className="border border-line bg-surface p-5">
          <p className="text-sm text-muted">Plan</p>
          <p className="font-display text-3xl font-bold uppercase">{s.active ? s.planName : "Sin plan activo"}</p>
        </div>
        <div className="border border-line bg-surface p-5">
          <p className="text-sm text-muted">{unlimited ? "Clases" : "Créditos"}</p>
          <p className="font-display text-5xl font-bold text-accent">{unlimited ? "Sin límite" : s.credits}</p>
        </div>
        <div className="border border-line bg-surface p-5">
          <p className="text-sm text-muted">Vence</p>
          <p className="font-display text-3xl font-bold uppercase">{s.endsAt ? formatDay(s.endsAt) : "-"}</p>
          {s.active && <p className="text-sm text-muted">{daysLeft} días</p>}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">Mis próximas clases</h2>
        {upcoming.length === 0 && waiting.length === 0 ? (
          <p className="mt-3 text-muted">No tienes clases reservadas. <a href="#reservar" className="text-accent underline underline-offset-4">Elegir en el calendario</a></p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((x) => (
              <div key={x.b.id}>
                <p className="mb-1 text-sm text-muted">{formatDay(x.slot.startsAt)}</p>
                <ClassCard c={classView(db, x.slot, me.id)} viewer="member" />
              </div>
            ))}
            {waiting.map((slot) => (
              <div key={slot!.id}>
                <p className="mb-1 text-sm text-muted">{formatDay(slot!.startsAt)}</p>
                <ClassCard c={classView(db, slot!, me.id)} viewer="member" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12" id="reservar">
        <h2 className="text-3xl">Reservar una clase</h2>
        <p className="mt-2 text-muted">Elige un día en el calendario y reserva tu cupo.</p>
        <div className="mt-5"><MemberCalendar /></div>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">{s.active ? "Renovar o cambiar de plan" : "Activar un plan"}</h2>
        <RenewPlan plans={plans} />
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">Historial</h2>
        <ul className="mt-4 divide-y divide-line border border-line">
          {history.map((x) => (
            <li key={x.b.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <span>{classView(db, x.slot).name}, {formatDay(x.slot.startsAt)} {formatTime(x.slot.startsAt)}</span>
              <span className={`text-sm ${x.b.status === "attended" ? "text-ok" : x.b.status === "no_show" ? "text-bad" : "text-muted"}`}>{STATUS[x.b.status]}</span>
            </li>
          ))}
          {history.length === 0 && <li className="px-4 py-3 text-muted">Aún no tienes historial.</li>}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">Mis datos</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          <div><dt className="text-sm text-muted">Correo</dt><dd>{me.email}</dd></div>
          <div><dt className="text-sm text-muted">Teléfono</dt><dd>{me.phone}</dd></div>
          <div><dt className="text-sm text-muted">Contacto de emergencia</dt><dd>{me.emergencyName}, {me.emergencyPhone}</dd></div>
        </dl>
      </section>
    </div>
  );
}
