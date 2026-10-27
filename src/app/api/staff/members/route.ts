import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";
import { now } from "@/lib/time";
import { memberSummary } from "@/lib/views";

export function GET(req: Request) {
  return handle(async () => {
    requireRole(await getSession(), "reception", "admin");
    const q = (new URL(req.url).searchParams.get("q") ?? "").toLowerCase().trim();
    const db = getDb();
    const at = now();
    const rows = db.profiles
      .filter((p) => p.role === "member" && (!q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)))
      .map((p) => memberSummary(db, p.id, at))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
    return ok({ members: rows });
  });
}
