import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { classTypes, coaches, plans } from "@/config/tenant";
import { StaffApp } from "./StaffApp";

export const dynamic = "force-dynamic";

export default async function Staff() {
  const me = await getSession();
  if (!me) redirect("/entrar");
  if (me.role === "member") redirect("/portal");
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="text-5xl sm:text-6xl">Panel del equipo</h1>
      <p className="mt-2 text-muted">{me.name}, {me.role === "admin" ? "administrador" : me.role === "reception" ? "recepción" : "coach"}</p>
      <StaffApp role={me.role} classTypes={classTypes.map((c) => ({ id: c.id, name: c.name }))} coaches={coaches} plans={plans.map((p) => ({ id: p.id, name: p.name }))} />
    </div>
  );
}
