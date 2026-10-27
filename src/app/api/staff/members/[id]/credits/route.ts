import { z } from "zod";
import { handle, ok, readBody } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";
import { addLedger, balance } from "@/lib/ledger";
import { notify } from "@/lib/notify";
import { now } from "@/lib/time";
import { DomainError } from "@/lib/types";

const Body = z.object({ delta: z.number().int().min(-50).max(50).refine((n) => n !== 0, "El ajuste no puede ser 0."), note: z.string().trim().min(3, "Escribe el motivo.") });

/** Manual credit adjustment by front desk. It is a ledger entry, so it is always traceable. */
export function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireRole(await getSession(), "reception", "admin");
    const { id } = await ctx.params;
    const b = await readBody(req, Body);
    const db = getDb();
    if (!db.profiles.some((p) => p.id === id && p.role === "member")) throw new DomainError("NOT_FOUND", "Socio no encontrado.", 404);
    if (balance(db, id) + b.delta < 0) throw new DomainError("NEGATIVE_BALANCE", "El saldo no puede quedar negativo.");
    const at = now();
    addLedger(db, id, b.delta, "manual", at, { note: b.note });
    notify(db, id, "credits", "Ajuste de créditos", `${b.delta > 0 ? "+" : ""}${b.delta} créditos. ${b.note}`, at);
    return ok({ credits: balance(db, id) });
  });
}
