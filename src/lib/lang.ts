import { DEFAULT_LANG, DICT, type Lang } from "./i18n";

/** The sites are Spanish only, so there is no language cookie to read. */
export async function getLang(): Promise<Lang> {
  return DEFAULT_LANG;
}

export async function getT() {
  return { lang: DEFAULT_LANG, t: DICT[DEFAULT_LANG] };
}
