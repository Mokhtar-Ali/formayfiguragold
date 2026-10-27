import { handle, ok } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireUser } from "@/lib/access";
import { unreadCount } from "@/lib/notify";

export function GET() {
  return handle(async () => {
    const me = requireUser(await getSession());
    const db = getDb();
    const items = db.notifications
      .filter((n) => n.memberId === me.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 50);
    return ok({ notifications: items, unread: unreadCount(db, me.id) });
  });
}
