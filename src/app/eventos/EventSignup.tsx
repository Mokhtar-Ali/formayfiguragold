"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client";
import { formatCop } from "@/lib/time";

const field = "mt-1 w-full border border-line bg-surface px-3 py-2 text-paper placeholder:text-muted";

export function EventSignup({ eventId, title, left, max, priceCop }: { eventId: string; title: string; left: number; max: number; priceCop: number }) {
  const router = useRouter();
  const [people, setPeople] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const limit = Math.min(max, left);

  if (done !== null) {
    return (
      <div className="p-6 sm:p-8" role="status">
        <p className="text-xl font-semibold">Listo, quedaste inscrito en {title}.</p>
        <p className="mt-2 text-muted">Guardamos {done === 1 ? "1 cupo" : `${done} cupos`}. El pago se confirma con el gimnasio antes del evento.</p>
      </div>
    );
  }
  if (left === 0) return <p className="p-6 text-bad sm:p-8">Los cupos se agotaron.</p>;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError(null); setBusy(true);
    try {
      await api(`/api/events/${eventId}`, "POST", { name: f.get("name"), phone: f.get("phone"), people });
      setDone(people);
      router.refresh();
    } catch (err) { setError((err as Error).message); router.refresh(); }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
      <label>Nombre<input name="name" required minLength={2} className={field} autoComplete="name" /></label>
      <label>Teléfono<input name="phone" required minLength={7} inputMode="tel" className={field} autoComplete="tel" /></label>
      <label>Personas
        <select value={people} onChange={(e) => setPeople(Number(e.target.value))} className={field}>
          {Array.from({ length: limit }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <p className="self-end pb-2 text-muted">Total: <span className="font-semibold text-paper">{formatCop(priceCop * people)}</span> <span className="text-xs">(pago simulado en esta demostración)</span></p>
      {error && <p role="alert" className="border border-bad p-3 text-bad sm:col-span-2">{error}</p>}
      <button disabled={busy} className="bg-accent px-6 py-3 font-semibold text-accent-ink hover:brightness-110 disabled:opacity-60 sm:col-span-2 sm:justify-self-start">
        {busy ? "Guardando..." : "Reservar mi cupo"}
      </button>
    </form>
  );
}
