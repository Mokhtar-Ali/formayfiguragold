import { events } from "@/config/tenant";
import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";
import { eventSpotsLeft } from "@/lib/events";

export function GET() {
  return handle(async () => {
    requireRole(await getSession(), "reception", "admin");
    const db = getDb();
    return ok({
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        time: e.time,
        capacity: e.capacity,
        spotsLeft: eventSpotsLeft(db, e),
        signups: db.eventSignups.filter((s) => s.eventId === e.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      })),
    });
  });
}
