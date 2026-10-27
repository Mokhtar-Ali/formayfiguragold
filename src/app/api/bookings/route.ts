import { z } from "zod";
import { handle, ok, readBody } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole, requireUser } from "@/lib/access";
import { bookSlot } from "@/lib/booking";
import { now } from "@/lib/time";
import { classView } from "@/lib/views";

export function GET() {
  return handle(async () => {
    const me = requireUser(await getSession());
    const db = getDb();
    const at = now();
    const mine = db.bookings
      .filter((b) => b.memberId === me.id)
      .map((b) => ({ b, s: db.slots.find((s) => s.id === b.slotId)! }))
      .filter((x) => x.s)
      .sort((a, b) => b.s.startsAt.localeCompare(a.s.startsAt))
      .map(({ b, s }) => ({ id: b.id, status: b.status, upcoming: new Date(s.startsAt) > at, class: classView(db, s, me.id) }));
    const waiting = db.waitlist
      .filter((w) => w.memberId === me.id)
      .map((w) => db.slots.find((s) => s.id === w.slotId))
      .filter((s) => !!s)
      .map((s) => classView(db, s!, me.id));
    return ok({ bookings: mine, waitlist: waiting });
  });
}

const Book = z.object({ slotId: z.string() });

export function POST(req: Request) {
  return handle(async () => {
    const me = requireRole(await getSession(), "member");
    const { slotId } = await readBody(req, Book);
    const db = getDb();
    const result = bookSlot(db, me.id, slotId, now());
    const slot = db.slots.find((s) => s.id === slotId)!;
    return ok({ ...result, class: classView(db, slot, me.id) }, 201);
  });
}
