"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client";
import { fill } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { formatTime } from "@/lib/time";
import type { ClassView } from "@/lib/views";

export type Viewer = "guest" | "member" | "staff";

export function ClassCard({ c, viewer, onChange }: { c: ClassView; viewer: Viewer; onChange?: () => void }) {
  const router = useRouter();
  const { t } = useLang();
  const k = t.card;
  const name = t.classTypes[c.classTypeId]?.name ?? c.name;
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const past = new Date(c.startsAt) < new Date();

  async function run(fn: () => Promise<unknown>, ok?: (r: any) => string) { // eslint-disable-line @typescript-eslint/no-explicit-any
    setBusy(true); setMsg(null);
    try {
      const r = await fn();
      if (ok) setMsg(ok(r));
      router.refresh();
      onChange?.();
    } catch (e) { setMsg((e as Error).message); }
    setBusy(false);
  }

  const full = c.spotsLeft === 0;
  const low = !full && c.spotsLeft <= 3;
  const btn = "w-full border px-3 py-2 text-sm font-semibold disabled:opacity-50";

  return (
    <article className={`border bg-surface p-3 ${c.cancelled ? "opacity-50" : ""} ${c.mine ? "border-accent" : "border-line"}`} style={{ borderLeft: `4px solid ${c.color}` }}>
      <div>
        <p className="font-display text-2xl font-bold leading-none whitespace-nowrap">{formatTime(c.startsAt)}</p>
        <p className={`mt-1 text-sm font-semibold ${c.cancelled ? "text-bad" : full ? "text-bad" : low ? "text-warn" : "text-ok"}`}>
          {c.cancelled ? k.cancelled : full ? (c.waitlistCount ? fill(k.fullWaiting, { n: c.waitlistCount }) : k.full) : c.spotsLeft === 1 ? k.spot : fill(k.spots, { n: c.spotsLeft })}
        </p>
      </div>
      <p className="mt-1 font-semibold leading-tight">{name}</p>
      <p className="text-sm text-muted">{c.coach}</p>
      <div className="mt-3">
        {c.cancelled || past ? null : viewer === "guest" ? (
          <Link href="/entrar" className={`${btn} block border-line text-center hover:border-accent`}>{k.loginToBook}</Link>
        ) : viewer === "staff" ? null : c.mine === "booked" ? (
          <button disabled={busy} className={`${btn} border-accent text-accent`} onClick={() => run(() => api(`/api/bookings/${c.bookingId}`, "DELETE"), () => k.okCancel)}>
            {k.booked}
          </button>
        ) : c.mine === "waitlisted" ? (
          <button disabled={busy} className={`${btn} border-info text-info`} onClick={() => run(() => api(`/api/waitlist/${c.id}`, "DELETE"), () => k.okLeft)}>
            {fill(k.waiting, { n: c.waitlistPosition ?? 0 })}
          </button>
        ) : (
          <button
            disabled={busy}
            className={`${btn} ${full ? "border-line hover:border-accent" : "border-accent bg-accent text-accent-ink hover:brightness-110"}`}
            onClick={() => run(() => api<{ status: string; position?: number }>("/api/bookings", "POST", { slotId: c.id }), (r) => (r.status === "booked" ? k.okBooked : fill(k.okWaitlist, { n: r.position })))}
          >
            {full ? k.joinWaitlist : k.reserve}
          </button>
        )}
        {msg && <p role="status" className="mt-2 text-sm text-muted">{msg}</p>}
      </div>
    </article>
  );
}
