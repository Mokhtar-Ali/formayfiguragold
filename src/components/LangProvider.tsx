"use client";
import { createContext, useContext } from "react";
import { DICT, type Lang } from "@/lib/i18n";

const Ctx = createContext<Lang>("es");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export function useLang() {
  const lang = useContext(Ctx);
  return { lang, t: DICT[lang] };
}
