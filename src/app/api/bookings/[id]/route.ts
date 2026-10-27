import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireUser } from "@/lib/access";
import { cancelBooking } from "@/lib/booking";
import { now } from "@/lib/time";

export function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const me = requireUser(await getSession());
    const { id } = await ctx.params;
    return ok(cancelBooking(getDb(), id, { actor: me }, now()));
  });
}
