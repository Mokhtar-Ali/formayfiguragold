"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client";
import { useLang } from "./LangProvider";

interface N { id: string; title: string; body: string; createdAt: string; readAt?: string }

export function Bell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<N[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const d = await api<{ notifications: N[]; unread: number }>("/api/notifications");
      setItems(d.notifications); setUnread(d.unread);
    } catch { /* signed out */ }
  };
  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={async () => { setOpen(!open); if (!open && unread) { await api("/api/notifications/read", "POST"); setTimeout(load, 1500); } }}
        className="relative grid h-10 w-10 place-items-center border border-line hover:border-bull"
        aria-label={`Notificaciones${unread ? `, ${unread} sin leer` : ""}`}
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
        {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center bg-bull px-1 text-xs font-semibold text-bull-ink">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 max-h-96 w-80 overflow-auto border border-line bg-surface shadow-2xl">
          {items.length === 0 && <p className="p-4 text-sm text-muted">Sin notificaciones.</p>}
          {items.map((n) => (
            <div key={n.id} className={`border-b border-line p-3 text-sm ${n.readAt ? "" : "bg-surface-2"}`}>
              <p className="font-semibold">{n.title}</p>
              <p className="text-muted">{n.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ACCOUNT_IDS = ["demo_member", "demo_coach", "demo_reception", "demo_admin"] as const;
const HOME: Record<string, string> = { demo_member: "/portal", demo_coach: "/staff", demo_reception: "/staff", demo_admin: "/staff" };

export function RoleSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const { t } = useLang();
  return (
    <label className="flex items-center gap-2 text-base text-muted">
      <span className="hidden sm:inline">{t.nav.viewAs}</span>
      <select
        className="border border-line bg-surface px-2 py-2 text-paper"
        value={(ACCOUNT_IDS as readonly string[]).includes(current) ? current : ""}
        onChange={async (e) => {
          await api("/api/session", "POST", { accountId: e.target.value });
          router.push(HOME[e.target.value]); router.refresh();
        }}
      >
        {!(ACCOUNT_IDS as readonly string[]).includes(current) && <option value="">{t.roles.newMember}</option>}
        {ACCOUNT_IDS.map((id) => <option key={id} value={id}>{t.roles[id]}</option>)}
      </select>
    </label>
  );
}

export function LogoutButton() {
  const router = useRouter();
  const { t } = useLang();
  return (
    <button className="text-base text-muted underline-offset-4 hover:text-paper hover:underline" onClick={async () => { await api("/api/session", "DELETE"); router.push("/"); router.refresh(); }}>
      {t.nav.logout}
    </button>
  );
}
