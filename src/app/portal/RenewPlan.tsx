"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client";
import { formatCop } from "@/lib/time";
import type { Plan } from "@/lib/types";

export function RenewPlan({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function pay(planId: string, outcome: "approved" | "declined") {
    setBusy(planId); setMsg(null);
    try {
      const r = await api<{ payment: { status: string; receiptNo: string } }>("/api/payments", "POST", { planId, paymentOutcome: outcome });
      setMsg(r.payment.status === "approved" ? `Pago aprobado. Recibo ${r.payment.receiptNo}.` : "El pago fue rechazado. Intenta de nuevo.");
      router.refresh();
    } catch (e) { setMsg((e as Error).message); }
    setBusy(null);
  }

  return (
    <div className="mt-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <div key={p.id} className="flex flex-col border border-line bg-surface p-4">
            <p className="font-display text-2xl font-bold uppercase leading-none">{p.name}</p>
            <p className="mt-2 flex-1 text-sm text-muted">{p.blurb}</p>
            <p className="mt-3 font-semibold text-bull">{formatCop(p.priceCop)}</p>
            <button disabled={!!busy} onClick={() => pay(p.id, "approved")} className="mt-3 bg-bull px-3 py-2 font-semibold text-bull-ink disabled:opacity-60">
              {busy === p.id ? "Procesando..." : "Pagar con Bold"}
            </button>
            <button disabled={!!busy} onClick={() => pay(p.id, "declined")} className="mt-2 text-xs text-muted underline underline-offset-4 hover:text-paper">Simular pago rechazado</button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">Precios y pago de ejemplo. Si renuevas antes de vencer, el nuevo plan empieza cuando termina el actual y no pierdes días.</p>
      {msg && <p role="status" className="mt-3 border border-line p-3">{msg}</p>}
    </div>
  );
}
