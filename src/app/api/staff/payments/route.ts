import { getPlan } from "@/config/tenant";
import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";

export function GET() {
  return handle(async () => {
    requireRole(await getSession(), "reception", "admin");
    const db = getDb();
    const rows = [...db.payments]
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 100)
      .map((p) => ({ ...p, member: db.profiles.find((x) => x.id === p.memberId)?.name ?? "", plan: getPlan(p.planId)?.name ?? "" }));
    return ok({ payments: rows });
  });
}
