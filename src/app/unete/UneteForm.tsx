"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client";
import { formatCop } from "@/lib/time";
import { Signature } from "@/components/Signature";
import { useLang } from "@/components/LangProvider";
import { fill } from "@/lib/i18n";
import type { Plan } from "@/lib/types";

const field = "mt-1 w-full border border-line bg-surface px-3 py-2 text-paper placeholder:text-muted";

export function UneteForm({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const { t } = useLang();
  const j = t.join;
  const [planId, setPlanId] = useState(plans[1]?.id ?? plans[0].id);
  const [signature, setSignature] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [decline, setDecline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ ok: boolean; receipt: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError(null); setBusy(true);
    try {
      const r = await api<{ payment: { status: string; receiptNo: string }; active: boolean }>("/api/register", "POST", {
        name: f.get("name"), email: f.get("email"), phone: f.get("phone"),
        emergencyName: f.get("emergencyName"), emergencyPhone: f.get("emergencyPhone"),
        planId, signature, accepted, paymentOutcome: decline ? "declined" : "approved",
      });
      setResult({ ok: r.active, receipt: r.payment.receiptNo });
      router.refresh();
    } catch (err) { setError((err as Error).message); }
    setBusy(false);
  }

  if (result) {
    return (
      <div className="mt-10 border border-line bg-surface p-8" role="status">
        <h2 className="text-4xl">{result.ok ? j.okTitle : j.badTitle}</h2>
        <p className="mt-3 text-muted">
          {result.ok ? fill(j.okText, { r: result.receipt }) : j.badText}
        </p>
        <button onClick={() => router.push(result.ok ? "/horarios" : "/portal")} className="mt-6 bg-bull px-6 py-3 font-semibold text-bull-ink">
          {result.ok ? j.okBtn : j.badBtn}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-10">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-display text-3xl font-bold uppercase">{j.data}</legend>
        <label className="sm:col-span-2">{j.name}<input name="name" required className={field} autoComplete="name" /></label>
        <label>{j.email}<input name="email" type="email" required className={field} autoComplete="email" /></label>
        <label>{j.phone}<input name="phone" required className={field} autoComplete="tel" /></label>
        <label>{j.emName}<input name="emergencyName" required className={field} /></label>
        <label>{j.emPhone}<input name="emergencyPhone" required className={field} /></label>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-display text-3xl font-bold uppercase">{j.plan}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {plans.map((p) => (
            <label key={p.id} className={`cursor-pointer border p-4 ${planId === p.id ? "border-bull bg-surface-2" : "border-line bg-surface"}`}>
              <input type="radio" name="plan" className="sr-only" checked={planId === p.id} onChange={() => setPlanId(p.id)} />
              <span className="block font-display text-2xl font-bold uppercase">{t.plans[p.id]?.name ?? p.name}</span>
              <span className="block text-sm text-muted">{t.plans[p.id]?.blurb ?? p.blurb}</span>
              <span className="mt-2 block font-semibold text-bull">{formatCop(p.priceCop)} <span className="text-xs font-normal text-muted">{j.sample}</span></span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-display text-3xl font-bold uppercase">{j.contract}</legend>
        <div className="h-32 overflow-auto border border-line bg-surface p-4 text-sm text-muted">
          {j.contractText}
        </div>
        <div className="mt-4"><Signature onChange={setSignature} /></div>
        <label className="mt-4 flex items-start gap-3">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 h-5 w-5 accent-[#ffc20e]" />
          <span>{j.accept}</span>
        </label>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-display text-3xl font-bold uppercase">{j.pay}</legend>
        <p className="text-muted">{j.payText}</p>
        <label className="mt-3 flex items-center gap-3">
          <input type="checkbox" checked={decline} onChange={(e) => setDecline(e.target.checked)} className="h-5 w-5 accent-[#ffc20e]" />
          <span>{j.decline}</span>
        </label>
      </fieldset>

      {error && <p role="alert" className="border border-bad p-3 text-bad">{error}</p>}
      <button disabled={busy} className="bg-bull px-8 py-3 text-lg font-semibold text-bull-ink hover:brightness-110 disabled:opacity-60">
        {busy ? j.processing : j.submit}
      </button>
    </form>
  );
}
