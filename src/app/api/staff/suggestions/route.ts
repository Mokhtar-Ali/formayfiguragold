import { z } from "zod";
import { handle, ok, readBody } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";

export function GET() {
  return handle(async () => {
    requireRole(await getSession(), "reception", "admin");
    const list = [...getDb().suggestions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return ok({ suggestions: list });
  });
}

/** Mark one suggestion as read. */
export function PATCH(req: Request) {
  return handle(async () => {
    requireRole(await getSession(), "reception", "admin");
    const { id } = await readBody(req, z.object({ id: z.string() }));
    const s = getDb().suggestions.find((x) => x.id === id);
    if (s) s.read = true;
    return ok({ ok: true });
  });
}
