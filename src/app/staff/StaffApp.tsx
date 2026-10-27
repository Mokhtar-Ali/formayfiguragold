"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client";
import { formatCop, formatDay, formatTime } from "@/lib/time";
import type { Report } from "@/lib/reports";
import { UPDATES } from "./updates";
import { HelpCenter } from "@/components/HelpCenter";
import { CalendarPicker } from "@/components/CalendarPicker";
import { dateKey, now } from "@/lib/time";

type Role = "coach" | "reception" | "admin";
interface Opt { id: string; name: string }
interface TodayClass { id: string; name: string; color: string; startsAt: string; coachName: string; capacity: number; spotsLeft: number; cancelled: boolean; roster: { bookingId: string; status: string; name: string }[]; waiting: string[] }
interface Member { id: string; name: string; email: string; phone: string; planName: string | null; planKind: string | null; endsAt: string | null; active: boolean; credits: number }
interface Pay { id: string; member: string; plan: string; amountCop: number; method: string; status: string; at: string; receiptNo: string }

const tabBtn = (on: boolean) => `border-b-2 px-4 py-3 font-semibold ${on ? "border-accent text-accent" : "border-transparent text-muted hover:text-paper"}`;
const input = "border border-line bg-surface px-3 py-2 text-paper";
const small = "border border-line px-3 py-1.5 text-sm hover:border-accent disabled:opacity-50";

export function StaffApp({ role, classTypes, coaches, plans }: { role: Role; classTypes: Opt[]; coaches: Opt[]; plans: Opt[] }) {
  const tabs = [
    { id: "hoy", label: "Hoy" },
    { id: "calendario", label: "Calendario" },
    ...(role !== "coach" ? [{ id: "socios", label: "Socios" }, { id: "pagos", label: "Pagos" }] : []),
    ...(role === "admin" ? [{ id: "clases", label: "Clases" }, { id: "reportes", label: "Reportes" }] : []),
    { id: "novedades", label: "Novedades" },
    { id: "ayuda", label: "Ayuda" },
  ];
  const [tab, setTab] = useState("hoy");
  return (
    <>
      <div role="tablist" className="mt-8 flex flex-wrap border-b border-line">
        {tabs.map((t) => <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={tabBtn(tab === t.id)}>{t.label}</button>)}
      </div>
      <div className="mt-8">
        {tab === "hoy" && <Today />}
        {tab === "calendario" && <CalendarPicker allowPast renderDay={(d) => <Today key={d} date={d} />} />}
        {tab === "socios" && <Members plans={plans} />}
        {tab === "pagos" && <Payments />}
        {tab === "clases" && <Classes classTypes={classTypes} coaches={coaches} />}
        {tab === "reportes" && <Reports />}
        {tab === "novedades" && <Updates />}
        {tab === "ayuda" && <HelpCenter audience="Equipo" />}
      </div>
    </>
  );
}

function Today({ date }: { date?: string }) {
  const [rows, setRows] = useState<TodayClass[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const load = useCallback(async () => { setRows((await api<{ classes: TodayClass[] }>(`/api/staff/today${date ? `?date=${date}` : ""}`)).classes); }, [date]);
  useEffect(() => { load(); }, [load]);
  if (!rows) return <p className="text-muted">Cargando...</p>;
  if (rows.length === 0) return <p className="text-muted">{date ? "No hay clases este día." : "Hoy no hay clases."}</p>;
  return (
    <div className="space-y-6">
      {err && <p role="alert" className="border border-bad p-3 text-bad">{err}</p>}
      {rows.map((c) => (
        <section key={c.id} className="border border-line bg-surface" style={{ borderLeft: `4px solid ${c.color}` }}>
          <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-3">
            <h2 className="text-2xl">{formatTime(c.startsAt)} {c.name}</h2>
            <p className="text-sm text-muted">{c.coachName}. {c.capacity - c.spotsLeft} de {c.capacity}{c.waiting.length ? `, ${c.waiting.length} en espera` : ""}</p>
          </header>
          <ul className="divide-y divide-line">
            {c.roster.length === 0 && <li className="px-4 py-3 text-muted">Sin reservas.</li>}
            {c.roster.map((r) => (
              <li key={r.bookingId} className="flex items-center justify-between gap-4 px-4 py-2">
                <span>{r.name}</span>
                {r.status === "attended" ? <span className="text-sm text-ok">Asistió</span> : r.status === "no_show" ? <span className="text-sm text-bad">No asistió</span> : date && date > dateKey(now()) ? <span className="text-sm text-muted">Reservada</span> : (
                  <button className={small} onClick={async () => { setErr(null); try { await api("/api/staff/checkin", "POST", { bookingId: r.bookingId }); await load(); } catch (e) { setErr((e as Error).message); } }}>Registrar asistencia</button>
                )}
              </li>
            ))}
          </ul>
          {c.waiting.length > 0 && <p className="border-t border-line px-4 py-2 text-sm text-info">Lista de espera: {c.waiting.join(", ")}</p>}
        </section>
      ))}
    </div>
  );
}

function Members({ plans }: { plans: Opt[] }) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Member[]>([]);
  const [sel, setSel] = useState<Member | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const load = useCallback(async () => { setRows((await api<{ members: Member[] }>(`/api/staff/members?q=${encodeURIComponent(q)}`)).members); }, [q]);
  useEffect(() => { const t = setTimeout(load, 200); return () => clearTimeout(t); }, [load]);

  async function act(fn: () => Promise<unknown>, ok: string) {
    setMsg(null);
    try { await fn(); setMsg(ok); await load(); } catch (e) { setMsg((e as Error).message); }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <input className={`${input} w-full`} placeholder="Buscar por nombre o correo" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar socio" />
        <ul className="mt-4 max-h-[34rem] divide-y divide-line overflow-auto border border-line">
          {rows.map((m) => (
            <li key={m.id}>
              <button onClick={() => { setSel(m); setMsg(null); }} className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-2 ${sel?.id === m.id ? "bg-surface-2" : ""}`}>
                <span><span className="block font-semibold">{m.name}</span><span className="text-sm text-muted">{m.active ? m.planName : "Sin plan activo"}</span></span>
                <span className="text-right text-sm">{m.planKind === "unlimited" ? "Ilimitado" : `${m.credits} créditos`}</span>
              </button>
            </li>
          ))}
          {rows.length === 0 && <li className="px-4 py-3 text-muted">Sin resultados.</li>}
        </ul>
      </div>
      <aside className="border border-line bg-surface p-5" aria-live="polite">
        {!sel ? <p className="text-muted">Elige un socio para ver sus datos y registrar un pago o ajustar créditos.</p> : (
          <MemberPanel key={sel.id} m={sel} plans={plans} act={act} msg={msg} />
        )}
      </aside>
    </div>
  );
}

function MemberPanel({ m, plans, act, msg }: { m: Member; plans: Opt[]; act: (fn: () => Promise<unknown>, ok: string) => Promise<void>; msg: string | null }) {
  const [planId, setPlanId] = useState(plans[0].id);
  const [method, setMethod] = useState("cash");
  const [delta, setDelta] = useState("1");
  const [note, setNote] = useState("");
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-3xl">{m.name}</h3>
        <p className="text-sm text-muted">{m.email}. {m.phone}</p>
        <p className="mt-1">{m.active ? `${m.planName}, vence ${m.endsAt ? formatDay(m.endsAt) : ""}` : "Sin plan activo"}. {m.planKind === "unlimited" ? "Sin límite de clases." : `${m.credits} créditos.`}</p>
      </div>
      <div>
        <p className="font-semibold">Registrar pago en caja</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <select className={input} value={planId} onChange={(e) => setPlanId(e.target.value)} aria-label="Plan">{plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select className={input} value={method} onChange={(e) => setMethod(e.target.value)} aria-label="Método"><option value="cash">Efectivo</option><option value="transfer">Transferencia</option></select>
          <button className="bg-accent px-4 py-2 font-semibold text-accent-ink" onClick={() => act(() => api(`/api/staff/members/${m.id}/membership`, "POST", { planId, method }), "Pago registrado y plan activado.")}>Registrar</button>
        </div>
      </div>
      <div>
        <p className="font-semibold">Ajustar créditos</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input className={`${input} w-20`} type="number" value={delta} onChange={(e) => setDelta(e.target.value)} aria-label="Cantidad" />
          <input className={`${input} min-w-0 flex-1`} placeholder="Motivo" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className={small} onClick={() => act(() => api(`/api/staff/members/${m.id}/credits`, "POST", { delta: Number(delta), note }), "Ajuste guardado.")}>Guardar</button>
        </div>
      </div>
      {msg && <p role="status" className="border border-line p-3 text-sm">{msg}. Vuelve a elegir al socio para ver el saldo nuevo.</p>}
    </div>
  );
}

function Payments() {
  const [rows, setRows] = useState<Pay[]>([]);
  useEffect(() => { api<{ payments: Pay[] }>("/api/staff/payments").then((d) => setRows(d.payments)); }, []);
  const METHOD: Record<string, string> = { bold: "Bold", cash: "Efectivo", transfer: "Transferencia" };
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-surface text-muted"><tr><th className="p-3">Fecha</th><th>Socio</th><th>Plan</th><th>Método</th><th className="text-right">Valor</th><th className="p-3">Estado</th></tr></thead>
        <tbody className="divide-y divide-line">
          {rows.map((p) => (
            <tr key={p.id}><td className="p-3">{formatDay(p.at)}</td><td>{p.member}</td><td>{p.plan}</td><td>{METHOD[p.method]}</td><td className="text-right">{formatCop(p.amountCop)}</td><td className={`p-3 ${p.status === "approved" ? "text-ok" : "text-bad"}`}>{p.status === "approved" ? "Aprobado" : "Rechazado"}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Classes({ classTypes, coaches }: { classTypes: Opt[]; coaches: Opt[] }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [upcoming, setUpcoming] = useState<{ id: string; name: string; startsAt: string; spotsLeft: number; capacity: number; cancelled: boolean }[]>([]);
  const load = useCallback(async () => { setUpcoming((await api<{ classes: typeof upcoming }>("/api/classes")).classes); }, []);
  useEffect(() => { load(); }, [load]);
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="space-y-3 border border-line bg-surface p-5" onSubmit={async (e) => {
        e.preventDefault(); const f = new FormData(e.currentTarget); setMsg(null);
        try {
          await api("/api/staff/classes", "POST", { classTypeId: f.get("t"), coachId: f.get("c"), date: f.get("d"), time: f.get("h"), durationMin: Number(f.get("m")), capacity: Number(f.get("k")) });
          setMsg("Clase creada."); load();
        } catch (er) { setMsg((er as Error).message); }
      }}>
        <h3 className="text-2xl">Nueva clase</h3>
        <label className="block text-sm">Tipo<select name="t" className={`${input} mt-1 w-full`}>{classTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
        <label className="block text-sm">Coach<select name="c" className={`${input} mt-1 w-full`}>{coaches.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">Fecha<input name="d" type="date" required className={`${input} mt-1 w-full`} /></label>
          <label className="text-sm">Hora<input name="h" type="time" required defaultValue="18:00" className={`${input} mt-1 w-full`} /></label>
          <label className="text-sm">Duración (min)<input name="m" type="number" defaultValue={60} className={`${input} mt-1 w-full`} /></label>
          <label className="text-sm">Cupo<input name="k" type="number" defaultValue={16} className={`${input} mt-1 w-full`} /></label>
        </div>
        <button className="bg-accent px-5 py-2 font-semibold text-accent-ink">Crear clase</button>
        {msg && <p role="status" className="text-sm">{msg}</p>}
      </form>
      <div>
        <h3 className="text-2xl">Próximas clases</h3>
        <ul className="mt-3 max-h-[28rem] divide-y divide-line overflow-auto border border-line">
          {upcoming.filter((c) => new Date(c.startsAt) > new Date()).slice(0, 30).map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
              <span className={c.cancelled ? "line-through opacity-50" : ""}>{formatDay(c.startsAt)} {formatTime(c.startsAt)}, {c.name} ({c.capacity - c.spotsLeft}/{c.capacity})</span>
              {!c.cancelled && <button className={small} onClick={async () => { if (confirm("Se cancela la clase, se devuelven los créditos y se avisa a los socios. ¿Continuar?")) { await api(`/api/staff/classes/${c.id}`, "DELETE"); load(); } }}>Cancelar</button>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Reports() {
  const [d, setD] = useState<{ report: Report; goals: { monthlyNewMembers: number; monthlyRevenueCop: number } } | null>(null);
  useEffect(() => { api<{ report: Report; goals: { monthlyNewMembers: number; monthlyRevenueCop: number } }>("/api/staff/reports").then(setD); }, []);
  if (!d) return <p className="text-muted">Cargando...</p>;
  const r = d.report;
  const max = Math.max(1, ...r.weekly.map((w) => w.attended));
  const stat = (label: string, value: string, sub?: string) => (
    <div className="border border-line bg-surface p-4"><p className="text-sm text-muted">{label}</p><p className="font-display text-4xl font-bold">{value}</p>{sub && <p className="text-sm text-muted">{sub}</p>}</div>
  );
  return (
    <div className="space-y-10">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stat("Socios activos", String(r.activeMembers))}
        {stat("Nuevos, 30 días", String(r.newMembers30d), `Meta ${d.goals.monthlyNewMembers}`)}
        {stat("Ingresos, 30 días", formatCop(r.revenue30d), `Meta ${formatCop(d.goals.monthlyRevenueCop)}`)}
        {stat("Ocupación", `${Math.round(r.occupancy30d * 100)}%`, `${Math.round(r.noShowRate * 100)}% no asiste`)}
      </div>
      <section>
        <h3 className="text-2xl">Asistencia por semana</h3>
        <svg viewBox="0 0 640 200" role="img" aria-label="Asistencia por semana" className="mt-3 w-full max-w-3xl">
          {r.weekly.map((w, i) => {
            const h = (w.attended / max) * 150;
            return (
              <g key={w.weekStart}>
                <rect x={i * 80 + 12} y={170 - h} width={56} height={h} fill="#ffc20e" />
                <text x={i * 80 + 40} y={164 - h} textAnchor="middle" fill="#f3f1ea" fontSize="13">{w.attended}</text>
                <text x={i * 80 + 40} y={190} textAnchor="middle" fill="#a3a094" fontSize="12">{formatDay(w.weekStart + "T12:00:00-05:00")}</text>
              </g>
            );
          })}
        </svg>
      </section>
      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h3 className="text-2xl">Ingresos por plan</h3>
          <ul className="mt-3 divide-y divide-line border border-line">
            {r.revenueByPlan.map((p) => <li key={p.planId} className="flex justify-between px-4 py-2"><span>{p.name} <span className="text-muted">({p.count})</span></span><span>{formatCop(p.total)}</span></li>)}
          </ul>
          <h3 className="mt-8 text-2xl">Por tipo de clase</h3>
          <ul className="mt-3 divide-y divide-line border border-line">
            {r.byClassType.map((t) => <li key={t.id} className="px-4 py-2"><div className="flex justify-between"><span>{t.name}</span><span>{Math.round(t.occupancy * 100)}% ocupación</span></div><div className="mt-1 h-2 bg-line"><div className="h-2" style={{ width: `${Math.min(100, t.occupancy * 100)}%`, background: t.color }} /></div></li>)}
          </ul>
        </section>
        <section>
          <h3 className="text-2xl">Socios en riesgo</h3>
          <ul className="mt-3 divide-y divide-line border border-line">
            {r.atRisk.length === 0 && <li className="px-4 py-2 text-muted">Nadie en riesgo.</li>}
            {r.atRisk.map((a) => <li key={a.memberId} className="px-4 py-2"><span className="font-semibold">{a.name}</span><span className="block text-sm text-muted">{a.reason}</span></li>)}
          </ul>
          <a href="/api/staff/export" className="mt-6 inline-block border border-line px-4 py-2 hover:border-accent">Descargar socios (CSV)</a>
        </section>
      </div>
    </div>
  );
}

function Updates() {
  return (
    <ol className="max-w-2xl space-y-6">
      {UPDATES.map((u) => (
        <li key={u.title} className="border-l-4 border-accent pl-4">
          <p className="text-sm text-muted">{u.date}</p>
          <p className="text-xl font-semibold">{u.title}</p>
          <p className="text-muted">{u.body}</p>
        </li>
      ))}
    </ol>
  );
}
