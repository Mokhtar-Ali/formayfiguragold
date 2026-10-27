import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { addDays, dateKey, now } from "@/lib/time";
import { classView } from "@/lib/views";

/** Classes between two local dates (defaults to the next 14 days), with live spots and my own status. */
export function GET(req: Request) {
  return handle(async () => {
    const url = new URL(req.url);
    const at = now();
    const from = url.searchParams.get("from") ?? dateKey(at);
    const to = url.searchParams.get("to") ?? addDays(from, 13);
    const me = await getSession();
    const db = getDb();
    const rows = db.slots
      .filter((s) => {
        const k = dateKey(new Date(s.startsAt));
        return k >= from && k <= to;
      })
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      .map((s) => classView(db, s, me?.id));
    return ok({ classes: rows });
  });
}
