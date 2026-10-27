import { z } from "zod";
import { handle, ok, readBody } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";
import { createClass } from "@/lib/classes";
import { now } from "@/lib/time";
import { classView } from "@/lib/views";

const Body = z.object({
  classTypeId: z.string(),
  date: z.string(),
  time: z.string(),
  durationMin: z.number().int(),
  capacity: z.number().int(),
  coachId: z.string(),
});

export function POST(req: Request) {
  return handle(async () => {
    const me = requireRole(await getSession(), "admin");
    const b = await readBody(req, Body);
    const db = getDb();
    const slot = createClass(db, me, b, now());
    return ok({ class: classView(db, slot) }, 201);
  });
}
