import Link from "next/link";
import { tenant } from "@/config/tenant";
import { getT } from "@/lib/lang";

export const metadata = { title: "Reserva en línea" };

const ROWS: { topic: string; today: string; now: string }[] = [
  { topic: "Horarios", today: "Imágenes en Instagram que hay que buscar y que cambian cada semana.", now: "Un calendario siempre al día, con cupos en vivo por clase." },
  { topic: "Reservas", today: "Una app aparte, que cada persona debe descargar y recordar.", now: "Reserva desde la misma página del gimnasio, sin descargar nada." },
  { topic: "Clase llena", today: "Se pierde la persona que quería ir.", now: "Lista de espera con promoción automática y aviso en su cuenta." },
  { topic: "Promos", today: "Un flyer nuevo cada vez, con precios que hay que explicar por mensaje.", now: "Un banner en la página con fecha de fin y un clic para unirse." },
  { topic: "Planes y pagos", today: "Cobros por transferencia o en caja, con control manual.", now: "Registro, contrato firmado, pago en línea y plan activo en un solo paso." },
  { topic: "Eventos", today: "Cupos limitados que se llenan por mensajes directos.", now: "Una página con cupos que bajan en vivo hasta agotarse." },
  { topic: "Voz del socio", today: "Un buzón que se anuncia en una imagen.", now: "Un formulario en la página y una bandeja para el equipo." },
];

export default async function ComoFunciona() {
  const { t } = await getT();
  return (
    <div className="px-6 pt-10 lg:px-16">
      <h1 className="text-5xl sm:text-6xl">Reserva en línea</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        {tenant.brand.name} {tenant.brand.subtitle} ya tiene comunidad. Esto es lo que cambia cuando horarios, reservas, promos y pagos viven en un solo lugar.
      </p>

      <div className="mt-10 overflow-x-auto border border-line">
        <table className="w-full min-w-[40rem] text-left">
          <thead className="bg-surface-2 text-sm uppercase tracking-[0.14em] text-muted">
            <tr><th className="p-4">Tema</th><th className="p-4">Hoy</th><th className="p-4 text-accent">Con tu portal</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.topic} className="border-t border-line align-top">
                <th scope="row" className="p-4 font-display text-xl">{r.topic}</th>
                <td className="p-4 text-muted">{r.today}</td>
                <td className="p-4">{r.now}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 bg-accent p-8 text-accent-ink sm:p-12">
        <h2 className="text-4xl sm:text-5xl">{t.home.tryTitle}</h2>
        <p className="mt-4 max-w-xl text-lg">{t.home.tryText}</p>
        <Link href="/entrar" className="mt-6 inline-block bg-accent-ink px-6 py-3 font-semibold text-accent hover:brightness-125">{t.home.tryBtn}</Link>
      </div>
    </div>
  );
}
