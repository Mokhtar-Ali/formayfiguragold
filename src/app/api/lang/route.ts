import { cookies } from "next/headers";
import { z } from "zod";
import { handle, ok, readBody } from "@/lib/api";
import { LANG_COOKIE } from "@/lib/i18n";

export function POST(req: Request) {
  return handle(async () => {
    const { lang } = await readBody(req, z.object({ lang: z.enum(["es", "en"]) }));
    (await cookies()).set(LANG_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return ok({ lang });
  });
}
