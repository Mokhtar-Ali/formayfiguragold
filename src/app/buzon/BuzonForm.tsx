"use client";
import { useState } from "react";
import { api } from "@/lib/client";

const field = "mt-1 w-full border border-line bg-surface px-3 py-2 text-paper placeholder:text-muted";
const KINDS = [
  { id: "idea", label: "Tengo una idea" },
  { id: "queja", label: "Algo debe mejorar" },
  { id: "felicitacion", label: "Quiero felicitar" },
] as const;

export function BuzonForm() {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("idea");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError(null); setBusy(true);
    try {
      await api("/api/suggestions", "POST", { kind, name: f.get("name") || undefined, message: f.get("message") });
      setSent(true);
    } catch (err) { setError((err as Error).message); }
    setBusy(false);
  }

  if (sent) {
    return (
      <div className="mt-10 border border-line bg-surface p-8" role="status">
        <h2 className="text-3xl">Gracias por escribirnos</h2>
        <p className="mt-3 text-muted">Tu mensaje llegó al equipo.</p>
        <button onClick={() => setSent(false)} className="mt-6 border border-line px-5 py-2 font-semibold hover:border-accent">Enviar otro</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-6">
      <fieldset>
        <legend className="mb-2 font-semibold">Tipo de mensaje</legend>
        <div className="flex flex-wrap gap-3">
          {KINDS.map((k) => (
            <label key={k.id} className={`cursor-pointer border px-4 py-2 ${kind === k.id ? "border-accent bg-surface-2 text-accent" : "border-line"}`}>
              <input type="radio" name="kind" value={k.id} checked={kind === k.id} onChange={() => setKind(k.id)} className="sr-only" />
              {k.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">Tu mensaje<textarea name="message" required minLength={5} maxLength={1000} rows={6} className={field} placeholder="Escribe aquí" /></label>
      <label className="block">Tu nombre (opcional)<input name="name" maxLength={80} className={field} autoComplete="name" /></label>
      {error && <p role="alert" className="border border-bad p-3 text-bad">{error}</p>}
      <button disabled={busy} className="bg-accent px-8 py-3 text-lg font-semibold text-accent-ink hover:brightness-110 disabled:opacity-60">{busy ? "Enviando..." : "Enviar"}</button>
    </form>
  );
}
