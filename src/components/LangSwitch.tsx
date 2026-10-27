"use client";
import { useRouter } from "next/navigation";
import { useLang } from "./LangProvider";
import { api } from "@/lib/client";
import type { Lang } from "@/lib/i18n";

function FlagCO() {
  return (
    <svg viewBox="0 0 30 20" className="h-5 w-[30px]" aria-hidden>
      <rect width="30" height="10" fill="#FCD116" /><rect y="10" width="30" height="5" fill="#003893" /><rect y="15" width="30" height="5" fill="#CE1126" />
    </svg>
  );
}
function FlagUS() {
  return (
    <svg viewBox="0 0 30 20" className="h-5 w-[30px]" aria-hidden>
      <rect width="30" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => <rect key={i} y={i * (20 / 13)} width="30" height={20 / 13} fill="#B22234" />)}
      <rect width="13" height={(20 / 13) * 7} fill="#3C3B6E" />
    </svg>
  );
}

export function LangSwitch() {
  const { lang, t } = useLang();
  const router = useRouter();
  const set = async (l: Lang) => {
    await api("/api/lang", "POST", { lang: l });
    router.refresh();
  };
  const btn = (l: Lang, label: string, flag: React.ReactNode) => (
    <button
      type="button"
      onClick={() => set(l)}
      aria-label={label}
      aria-pressed={lang === l}
      title={label}
      className={`border p-1.5 ${lang === l ? "border-bull" : "border-transparent opacity-60 hover:opacity-100"}`}
    >
      {flag}
    </button>
  );
  return (
    <div role="group" aria-label={t.nav.language} className="flex items-center gap-1">
      {btn("es", "Español", <FlagCO />)}
      {btn("en", "English", <FlagUS />)}
    </div>
  );
}
