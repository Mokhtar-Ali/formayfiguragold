import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { assertCron } from "@/lib/cron";
import { runMembershipRenewals } from "@/lib/jobs";
import { now } from "@/lib/time";

export function GET(req: Request) {
  return handle(() => {
    assertCron(req);
    return ok(runMembershipRenewals(getDb(), now()));
  });
}
