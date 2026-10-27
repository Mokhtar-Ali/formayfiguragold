import { getClassType, getCoach } from "@/config/tenant";
import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";
import { activeBookings, waitlistFor } from "@/lib/booking";
import { dateKey, now } from "@/lib/time";
import { classView } from "@/lib/views";

/** Classes of one day (default today, or ?date=YYYY-MM-DD) with the roster. Coaches only see their own classes. */
export function GET(req: Request) {
  return handle(async () => {
    const me = requireRole(await getSession(), "coach", "reception", "admin");
    const db = getDb();
    const q = new URL(req.url).searchParams.get("date");
    const today = q && /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : dateKey(now());
    const classes = db.slots
      .filter((s) => dateKey(new Date(s.startsAt)) === today && (me.role !== "coach" || s.coachId === me.coachId))
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      .map((s) => ({
        ...classView(db, s),
        className: getClassType(s.classTypeId)?.name,
        coachName: getCoach(s.coachId)?.name,
        roster: activeBookings(db, s.id).concat(db.bookings.filter((b) => b.slotId === s.id && b.status === "no_show")).map((b) => ({
          bookingId: b.id,
          status: b.status,
          memberId: b.memberId,
          name: db.profiles.find((p) => p.id === b.memberId)?.name ?? "",
        })),
        waiting: waitlistFor(db, s.id).map((w) => db.profiles.find((p) => p.id === w.memberId)?.name ?? ""),
      }));
    return ok({ classes });
  });
}
