import { cookies } from "next/headers";
import { z } from "zod";
import { handle, ok, readBody } from "@/lib/api";
import { getDb } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";
import { registerPayment } from "@/lib/membership";
import { notify } from "@/lib/notify";
import { nextId } from "@/lib/store";
import { now } from "@/lib/time";
import { DomainError } from "@/lib/types";
import { getPlan, tenant } from "@/config/tenant";

const Body = z.object({
  name: z.string().trim().min(3, "Escribe tu nombre completo."),
  email: z.email("Correo inválido."),
  phone: z.string().trim().min(7, "Teléfono inválido."),
  emergencyName: z.string().trim().min(2, "Falta el contacto de emergencia."),
  emergencyPhone: z.string().trim().min(7, "Falta el teléfono de emergencia."),
  planId: z.string(),
  signature: z.string().startsWith("data:image/png;base64,", "Falta la firma.").max(400_000),
  accepted: z.literal(true, { error: "Debes aceptar el contrato." }),
  /** Simulated Bold checkout. The demo lets you pick the result. */
  paymentOutcome: z.enum(["approved", "declined"]).default("approved"),
});

/** Join online: profile, signed contract and a simulated Bold payment in one step. */
export function POST(req: Request) {
  return handle(async () => {
    const b = await readBody(req, Body);
    if (!getPlan(b.planId)) throw new DomainError("PLAN_NOT_FOUND", "El plan no existe.", 404);
    const db = getDb();
    const at = now();
    if (db.profiles.some((p) => p.email.toLowerCase() === b.email.toLowerCase()))
      throw new DomainError("EMAIL_TAKEN", "Ya existe una cuenta con este correo.", 409);

    const id = nextId(db, "m");
    db.profiles.push({
      id,
      name: b.name,
      email: b.email,
      phone: b.phone,
      emergencyName: b.emergencyName,
      emergencyPhone: b.emergencyPhone,
      role: "member",
      createdAt: at.toISOString(),
    });
    db.contracts.push({ memberId: id, signedAt: at.toISOString(), signature: b.signature });
    notify(db, id, "system", `Bienvenido a ${tenant.brand.name} ${tenant.brand.subtitle}`, "Tu contrato quedó firmado. Esta es una demostración con datos de ejemplo.", at);
    const { payment, membership } = registerPayment(db, id, b.planId, "bold", b.paymentOutcome, at);
    (await cookies()).set(SESSION_COOKIE, id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return ok({ memberId: id, payment: { status: payment.status, receiptNo: payment.receiptNo }, active: !!membership }, 201);
  });
}
