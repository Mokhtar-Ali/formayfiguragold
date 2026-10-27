import { cookies } from "next/headers";
import { z } from "zod";
import { handle, ok, readBody } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession, isDemoAccountId, SESSION_COOKIE } from "@/lib/auth";
import { DomainError } from "@/lib/types";

const Login = z.object({ accountId: z.string() });

export function GET() {
  return handle(async () => {
    const p = await getSession();
    return ok({ user: p ? { id: p.id, name: p.name, role: p.role } : null });
  });
}

/** Demo sign-in. Only the four demo accounts and members created through /unete can sign in. */
export function POST(req: Request) {
  return handle(async () => {
    const { accountId } = await readBody(req, Login);
    const p = getDb().profiles.find((x) => x.id === accountId);
    if (!p || !(isDemoAccountId(p.id) || p.role === "member"))
      throw new DomainError("NOT_FOUND", "Cuenta no encontrada.", 404);
    (await cookies()).set(SESSION_COOKIE, p.id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return ok({ user: { id: p.id, name: p.name, role: p.role } });
  });
}

export function DELETE() {
  return handle(async () => {
    (await cookies()).delete(SESSION_COOKIE);
    return ok({ ok: true });
  });
}
