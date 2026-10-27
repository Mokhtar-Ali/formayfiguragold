import { cookies } from "next/headers";
import { DEFAULT_LANG, DICT, LANG_COOKIE, isLang, type Lang } from "./i18n";

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(v) ? v : DEFAULT_LANG;
}

export async function getT() {
  const lang = await getLang();
  return { lang, t: DICT[lang] };
}
