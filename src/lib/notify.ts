import type { Db, Notification } from "./types";
import { nextId } from "./store";

export function notify(
  db: Db,
  memberId: string,
  kind: Notification["kind"],
  title: string,
  body: string,
  at: Date,
  refId?: string,
): Notification | null {
  if (refId && db.notifications.some((n) => n.memberId === memberId && n.refId === refId)) return null;
  const n: Notification = { id: nextId(db, "n"), memberId, kind, title, body, createdAt: at.toISOString(), refId };
  db.notifications.push(n);
  return n;
}

export const unreadCount = (db: Db, memberId: string) =>
  db.notifications.filter((n) => n.memberId === memberId && !n.readAt).length;
