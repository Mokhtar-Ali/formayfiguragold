import { z } from "zod";
import { handle, ok, readBody } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";
import { registerPayment } from "@/lib/membership";
import { now } from "@/lib/time";
import { DomainError } from "@/lib/types";

const Body = z.object({ planId: z.string(), method: z.enum(["cash", "transfer", "bold"]) });

/** Front desk registers a plan paid at the counter. */
export function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireRole(await getSession(), "reception", "admin");
    const { id } = await ctx.params;
    const b = await readBody(req, Body);
    const db = getDb();
    if (!db.profiles.some((p) => p.id === id && p.role === "member")) throw new DomainError("NOT_FOUND", "Socio no encontrado.", 404);
    const { payment, membership } = registerPayment(db, id, b.planId, b.method, "approved", now());
    return ok({ receiptNo: payment.receiptNo, endsAt: membership?.endsAt }, 201);
  });
}
