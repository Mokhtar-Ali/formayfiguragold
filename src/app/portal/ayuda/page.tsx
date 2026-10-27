import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { HelpCenter } from "@/components/HelpCenter";

export default async function PortalHelp() {
  const me = await getSession();
  if (!me) redirect("/entrar");
  if (me.role !== "member") redirect("/staff");
  return (
    <div className="mx-auto max-w-5xl px-4 pt-10">
      <Link href="/portal" className="text-sm text-muted underline-offset-4 hover:text-paper hover:underline">Volver a Mi cuenta</Link>
      <h1 className="mt-3 text-5xl sm:text-6xl">Centro de ayuda</h1>
      <p className="mb-8 mt-3 text-muted">Respuestas cortas sobre reservas, créditos, lista de espera y pagos.</p>
      <HelpCenter audience="Socios" />
    </div>
  );
}
