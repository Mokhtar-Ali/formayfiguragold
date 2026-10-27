import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";
import { buildReport } from "@/lib/reports";
import { now } from "@/lib/time";
import { tenant } from "@/config/tenant";

export function GET() {
  return handle(async () => {
    requireRole(await getSession(), "admin");
    return ok({ report: buildReport(getDb(), now()), goals: tenant.goals });
  });
}
