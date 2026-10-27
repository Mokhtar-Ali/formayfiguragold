import { z } from "zod";
import { handle, ok, readBody } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";
import { registerPayment } from "@/lib/membership";
import { now } from "@/lib/time";

const Body = z.object({ planId: z.string(), paymentOutcome: z.enum(["approved", "declined"]).default("approved") });

/** A signed-in member buys or renews a plan (simulated Bold checkout). */
export function POST(req: Request) {
  return handle(async () => {
    const me = requireRole(await getSession(), "member");
    const b = await readBody(req, Body);
    const { payment, membership } = registerPayment(getDb(), me.id, b.planId, "bold", b.paymentOutcome, now());
    return ok({ payment: { status: payment.status, receiptNo: payment.receiptNo }, active: !!membership }, 201);
  });
}
