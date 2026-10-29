import { readFileSync } from "node:fs";
import { join } from "node:path";
import { tenant } from "@/config/tenant";

/** The tenant's logo as a data URI for generated images (tab icon, share card), or null when it has none. */
export function logoDataUri(): string | null {
  const l = tenant.media?.heroLogo ?? null;
  if (!l) return null;
  try {
    const mime = l.src.endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${readFileSync(join(process.cwd(), "public", l.src)).toString("base64")}`;
  } catch {
    return null;
  }
}
