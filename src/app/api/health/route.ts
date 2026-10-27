import { ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { now } from "@/lib/time";

export function GET() {
  const db = getDb();
  return ok({ status: "ok", demo: true, time: now().toISOString(), members: db.profiles.filter((p) => p.role === "member").length });
}
