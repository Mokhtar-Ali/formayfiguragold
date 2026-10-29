import { SEDES } from "@/config/group";
import { Words } from "@/components/words";

export const metadata = { title: "Nuestras sedes" };

export default function Sedes() {
  return (
    <div className="px-6 pt-10 lg:px-16">
      <h1 className="text-5xl sm:text-6xl"><Words text="Nuestras sedes" /></h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">Tres sedes, cada una con su identidad, su horario y su comunidad. Una sola cuenta de reservas por sede, con la misma forma de entrenar.</p>
      <ul className="mt-10 grid gap-6 lg:grid-cols-3">
        {SEDES.map((s) => (
          <li key={s.id} className="flex flex-col justify-between overflow-hidden border p-8" style={{ background: s.theme.ink, borderColor: s.theme.line, color: s.theme.paper }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: s.theme.muted }}>{s.name}</p>
              <p className="mt-2 text-6xl font-bold leading-none" style={{ color: s.theme.accent, fontFamily: s.theme.fontDisplay, textTransform: s.theme.headingCase, letterSpacing: s.theme.headingTracking }}>{s.subtitle}</p>
              <p className="mt-5 text-lg" style={{ fontFamily: s.theme.fontSans }}>{s.tagline}</p>
              <p className="mt-4 text-sm" style={{ color: s.theme.muted }}>{s.address}</p>
              <p className="mt-1 text-sm" style={{ color: s.theme.muted }}>{s.instagram}</p>
            </div>
            {s.current ? (
              <p className="mt-8 text-sm font-semibold" style={{ color: s.theme.accent }}>Estás en esta sede</p>
            ) : (
              <a href={s.url} className="mt-8 inline-block px-6 py-3 text-center font-semibold hover:brightness-110" style={{ background: s.theme.accent, color: s.theme.accentInk }}>
                Visitar la sede {s.subtitle}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
