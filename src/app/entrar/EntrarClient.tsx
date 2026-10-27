"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client";
import { useLang } from "@/components/LangProvider";

const OPTIONS = [
  { id: "demo_member", to: "/portal" },
  { id: "demo_coach", to: "/staff" },
  { id: "demo_reception", to: "/staff" },
  { id: "demo_admin", to: "/staff" },
];

export function EntrarClient() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const { t } = useLang();
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {OPTIONS.map((o, i) => {
      const txt = t.enter.options[i];
      return (
        <button
          key={o.id}
          disabled={!!busy}
          onClick={async () => { setBusy(o.id); await api("/api/session", "POST", { accountId: o.id }); router.push(o.to); router.refresh(); }}
          className="border border-line bg-surface p-6 text-left hover:border-accent disabled:opacity-60"
        >
          <p className="font-display text-3xl font-bold uppercase">{txt.title}</p>
          <p className="text-sm text-accent">{txt.who}</p>
          <p className="mt-3 text-muted">{txt.text}</p>
        </button>
      );
      })}
    </div>
  );
}
