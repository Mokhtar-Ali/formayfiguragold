import { z } from "zod";
import { events } from "@/config/tenant";
import { handle, ok, readBody } from "@/lib/api";
import { getDb } from "@/lib/db";
import { eventSpotsLeft, signUpForEvent } from "@/lib/events";
import { now } from "@/lib/time";
import { DomainError } from "@/lib/types";

const body = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre.").max(80),
  phone: z.string().trim().min(7, "Escribe un teléfono válido.").max(30),
  people: z.number().int().min(1).max(10),
});

export function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await ctx.params;
    const event = events.find((e) => e.id === id);
    if (!event) throw new DomainError("NOT_FOUND", "Evento no encontrado.", 404);
    const input = await readBody(req, body);
    const db = getDb();
    const signup = signUpForEvent(db, event, input, now());
    return ok({ signupId: signup.id, spotsLeft: eventSpotsLeft(db, event) }, 201);
  });
}
