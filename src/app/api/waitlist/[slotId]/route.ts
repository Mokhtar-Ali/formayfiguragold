import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireUser } from "@/lib/access";
import { leaveWaitlist } from "@/lib/booking";

export function DELETE(_req: Request, ctx: { params: Promise<{ slotId: string }> }) {
  return handle(async () => {
    const me = requireUser(await getSession());
    const { slotId } = await ctx.params;
    leaveWaitlist(getDb(), me.id, slotId);
    return ok({ ok: true });
  });
}
