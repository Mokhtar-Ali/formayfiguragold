import { z } from "zod";
import { handle, ok, readBody } from "@/lib/api";
import { getDb } from "@/lib/db";
import { addSuggestion } from "@/lib/events";
import { now } from "@/lib/time";

const body = z.object({
  kind: z.enum(["idea", "queja", "felicitacion"]),
  name: z.string().trim().max(80).optional(),
  message: z.string().trim().min(5, "Cuéntanos un poco más.").max(1000),
});

export function POST(req: Request) {
  return handle(async () => {
    const input = await readBody(req, body);
    addSuggestion(getDb(), input, now());
    return ok({ ok: true }, 201);
  });
}
