import Image from "next/image";
import Link from "next/link";
import { tenant } from "@/config/tenant";
import { getT } from "@/lib/lang";

const icon = "h-6 w-6 fill-current";
const arrow = <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth="1.8" aria-hidden><path d="M7 17 17 7M8 7h9v9" /></svg>;
const row = "group flex items-center gap-2 py-1.5 font-semibold text-paper/80 hover:text-accent";
const head = "text-xs font-bold uppercase tracking-[0.18em] text-paper";
const circle = "grid h-12 w-12 place-items-center rounded-full border border-line text-paper hover:border-accent hover:text-accent";

export async function Footer() {
  const { t } = await getT();
  const f = t.site.foot;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tenant.contact.mapsQuery)}`;
  const wapp = `${tenant.contact.whatsappHref}?text=${encodeURIComponent(t.site.waMsg)}`;
  const NAV = [
    { href: "/", label: f.home },
    { href: "/unete", label: t.nav.join },
    { href: "/entrar", label: t.nav.enter },
    { href: "/demo", label: t.site.demoLink },
  ];
  return (
    <footer className="mt-24 border-t border-line pb-20 md:pb-0">
      <div className="grid gap-12 px-6 py-14 text-base text-muted sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-16">
        <div>
          <Image src="/logo.png" alt="Bulltrain Entrenamiento" width={96} height={96} />
          <p className="mt-4 text-lg text-paper">{t.footer.tagline}</p>
          <a href={wapp} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-between gap-10 rounded-full border border-line px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-paper hover:border-accent hover:text-accent">
            {f.wa}{arrow}
          </a>
          <div className="mt-5 flex gap-3">
            <a href={tenant.contact.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Bulltrain" className={circle}>
              <svg viewBox="0 0 24 24" className={icon} aria-hidden><path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zM17.1 6a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 2.2c-2.7 0-3 0-4.1.1-1.1 0-1.8.2-2.5.5-.7.3-1.2.6-1.8 1.2-.6.6-.9 1.1-1.2 1.800-.3.7-.4 1.400-.5 2.500C2.200 9 2.200 9.300 2.200 12s0 3 .1 4.100c.1 1.100.2 1.800.5 2.500.3.7.6 1.200 1.200 1.800.6.6 1.100.9 1.800 1.200.7.3 1.400.4 2.500.5 1.100.1 1.400.1 4.100.1s3 0 4.100-.1c1.100-.1 1.800-.2 2.500-.5.7-.3 1.200-.6 1.800-1.200.6-.6.9-1.100 1.200-1.800.3-.7.4-1.400.5-2.500.1-1.100.1-1.400.1-4.100s0-3-.1-4.100c-.1-1.100-.2-1.800-.5-2.500-.3-.7-.6-1.200-1.200-1.800-.6-.6-1.100-.9-1.800-1.200-.7-.3-1.400-.4-2.500-.5C15 2.200 14.700 2.200 12 2.200zm0 1.800c2.700 0 3 0 4 .1.900 0 1.400.2 1.800.3.500.2.800.4 1.100.7.300.3.500.6.700 1.100.1.400.3.900.3 1.800.1 1 .1 1.300.1 4s0 3-.1 4c0 .9-.2 1.400-.3 1.800-.2.500-.4.800-.7 1.100-.3.300-.6.500-1.100.7-.4.100-.9.300-1.800.3-1 .1-1.300.1-4 .1s-3 0-4-.1c-.9 0-1.400-.2-1.800-.3-.5-.2-.8-.4-1.100-.7-.3-.3-.5-.6-.7-1.100-.1-.4-.3-.9-.3-1.800C4 15 4 14.700 4 12s0-3 .1-4c0-.9.2-1.400.3-1.800.2-.5.4-.8.7-1.100.3-.3.6-.5 1.100-.7.4-.1.9-.3 1.800-.3 1-.1 1.300-.1 4-.1z" /></svg>
            </a>
            <a href={tenant.contact.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook de Bulltrain" className={circle}>
              <svg viewBox="0 0 24 24" className={icon} aria-hidden><path d="M13.500 21v-7.700h2.600l.4-3h-3V8.400c0-.9.2-1.500 1.500-1.500h1.600V4.200c-.3 0-1.200-.1-2.300-.1-2.300 0-3.900 1.400-3.900 4v2.200H8v3h2.400V21h3.100z" /></svg>
            </a>
          </div>
        </div>

        <nav aria-label={t.footer.navLabel}>
          <p className={head}>{f.nav}</p>
          <ul className="mt-4">
            {NAV.map((n) => <li key={n.href}><Link href={n.href} className={row}>{n.label}{arrow}</Link></li>)}
          </ul>
        </nav>

        <div>
          <p className={head}>{f.place}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em]">{f.area}</p>
          <p className="mt-2 text-paper/80">{tenant.contact.address}</p>
          <a href={maps} target="_blank" rel="noopener noreferrer" className={`${row} mt-3`}>{f.directions}{arrow}</a>
          <a href={tenant.contact.phoneHref} className={row}>{f.call} {tenant.contact.phone}{arrow}</a>
        </div>

        <div>
          <p className={head}>{t.footer.hours}</p>
          <ul className="mt-4 space-y-1.5">
            {tenant.hours.map((h) => (
              <li key={h.days}><span className="text-paper/80">{t.footer.days[h.days] ?? h.days}</span><br />{h.time}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-6 flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-muted lg:mx-16">
        <p>
          © {new Date().getFullYear()} Bulltrain Entrenamiento. {t.footer.rights}{" "}
          <span className="whitespace-nowrap">{t.footer.createdBy}{" "}
            <a href="https://cleopatrasolutions.com/" target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">Cleopatra Solutions</a>
          </span>
        </p>
        <a href="#" className="flex items-center gap-4 md:mr-20 rounded-full border border-line px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-paper hover:border-accent hover:text-accent">
          {f.top}
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" aria-hidden><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </a>
      </div>
    </footer>
  );
}
