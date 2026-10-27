import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireUser } from "@/lib/access";
import { now } from "@/lib/time";

export function POST() {
  return handle(async () => {
    const me = requireUser(await getSession());
    const at = now().toISOString();
    for (const n of getDb().notifications) if (n.memberId === me.id && !n.readAt) n.readAt = at;
    return ok({ ok: true });
  });
}
