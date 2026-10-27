import { z } from "zod";
import { handle, ok, readBody } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";
import { checkIn } from "@/lib/booking";
import { now } from "@/lib/time";

export function POST(req: Request) {
  return handle(async () => {
    const me = requireRole(await getSession(), "coach", "reception", "admin");
    const { bookingId } = await readBody(req, z.object({ bookingId: z.string() }));
    const b = checkIn(getDb(), bookingId, me, now());
    return ok({ status: b.status, checkedInAt: b.checkedInAt });
  });
}
