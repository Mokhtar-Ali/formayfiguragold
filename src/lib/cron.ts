import { DomainError } from "./types";

/** Cron routes accept a Bearer CRON_SECRET (what Vercel Cron sends). Open when no secret is set, for the demo. */
export function assertCron(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return;
  if (req.headers.get("authorization") !== `Bearer ${secret}`) throw new DomainError("FORBIDDEN", "No autorizado.", 401);
}
