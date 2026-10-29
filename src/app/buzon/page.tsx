import { tenant } from "@/config/tenant";
import { Words } from "@/components/words";
import { BuzonForm } from "./BuzonForm";

export const metadata = { title: "Buzón de sugerencias" };

export default function Buzon() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-10">
      <h1 className="text-5xl sm:text-6xl"><Words text="Buzón" /></h1>
      <p className="mt-3 text-xl">Queremos escucharte.</p>
      <p className="mt-3 max-w-xl text-muted">
        Cuéntanos qué mejorar, qué te gustó o qué clase quieres ver en {tenant.brand.name} {tenant.brand.subtitle}. Lo lee el equipo, no un robot.
      </p>
      <BuzonForm />
    </div>
  );
}
