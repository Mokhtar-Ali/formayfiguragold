import Image from "next/image";
import Link from "next/link";
import { coaches, tenant } from "@/config/tenant";

/** One coach featured on the home page, from tenant.copy.spotlight. The portrait is a placeholder until real photos arrive. */
export function Spotlight() {
  const sp = tenant.copy.spotlight;
  const coach = coaches.find((c) => c.id === sp.coachId);
  if (!coach) return null;
  const first = coach.name.replace(/^(Coach|Instructor)\s+/, "");
  return (
    <section className="mt-24 px-6 lg:px-16" aria-labelledby="spot">
      <div className="grid overflow-hidden border border-line bg-surface md:grid-cols-[minmax(0,0.8fr)_1.2fr]">
        {coach.photo ? (
          <div className="relative min-h-80 overflow-hidden">
            <Image src={coach.photo} alt={coach.name} fill sizes="(min-width:768px) 32vw, 100vw" className="object-cover object-top" />
          </div>
        ) : (
          <div className="relative grid min-h-64 place-items-center overflow-hidden" style={{ background: "radial-gradient(90% 90% at 30% 20%, var(--color-accent-2), var(--color-ink))" }}>
            <span className="select-none font-display text-[12rem] font-bold leading-none text-accent/90" aria-hidden>{first.slice(0, 1)}</span>
            <span className="absolute bottom-3 left-4 text-xs uppercase tracking-[0.18em] text-paper/70">Foto por agregar</span>
          </div>
        )}
        <div className="p-8 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{sp.title}</p>
          <h2 id="spot" className="mt-3 text-4xl sm:text-5xl">{coach.name}</h2>
          <p className="mt-5 max-w-lg text-lg text-muted">{sp.text}</p>
          <Link href="/horarios" className="mt-8 inline-block bg-accent px-6 py-3 font-semibold text-accent-ink hover:brightness-110">Ver sus clases</Link>
        </div>
      </div>
    </section>
  );
}
