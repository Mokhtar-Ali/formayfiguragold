import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";
import { cancelSlot } from "@/lib/booking";
import { now } from "@/lib/time";

/** Cancel a class: every booking is refunded and every member is notified. */
export function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireRole(await getSession(), "admin");
    const { id } = await ctx.params;
    cancelSlot(getDb(), id, now());
    return ok({ ok: true });
  });
}
