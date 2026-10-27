import Image from "next/image";
import Link from "next/link";
import { classTypes, coaches, plans, tenant } from "@/config/tenant";
import { getSession } from "@/lib/auth";
import { ClassCard, type Viewer } from "@/components/ClassCard";
import { OpenNow } from "@/components/OpenNow";
import { getDb } from "@/lib/db";
import { dateKey, formatDay, now } from "@/lib/time";
import { classView } from "@/lib/views";
import { getT } from "@/lib/lang";

export const dynamic = "force-dynamic";

/** Photos come from Bulltrain's own social media. Confirm usage with the gym before launch. */
const PHOTO: Record<string, { src: string; alt: string; pos?: string; fit?: "contain" }> = {
  hibrido: { src: "/classes/hibrido.jpg", alt: "Socia haciendo zancada con mancuerna", pos: "50% 12%" },
  bullrunning: { src: "/bull.png", alt: "Mascota de Bulltrain corriendo", pos: "50% 40%", fit: "contain" },
  cycling: { src: "/classes/cycling.jpg", alt: "Dos socias en la sala de cycling", pos: "50% 35%" },
};

const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tenant.contact.mapsQuery)}`;

export default async function Home() {
  const { t } = await getT();
  const db = getDb();
  const me = await getSession();
  const viewer: Viewer = !me ? "guest" : me.role === "member" ? "member" : "staff";
  const at = now();
  const next = db.slots
    .filter((s) => s.status === "scheduled" && new Date(s.startsAt) > at)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 4)
    .map((s) => classView(db, s, me?.id));
  const today = dateKey(at);

  return (
    <>
      <section className="flex flex-col gap-10 px-6 pb-4 pt-6 lg:px-16 lg:pt-8">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <h1 className="text-[clamp(2.5rem,5.6vw,5.25rem)]">
              {t.home.title1}<br />{t.home.title2}
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted">
              {t.footer.tagline}. {t.home.sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/horarios" className="bg-accent px-6 py-3 font-semibold text-accent-ink hover:brightness-110">{t.home.seeSchedule}</Link>
              <Link href="/unete" className="border border-line px-6 py-3 font-semibold hover:border-accent">{t.home.join}</Link>
            </div>
            <OpenNow className="mt-6" />
          </div>
          <Image src="/bull.png" alt={t.home.heroAlt} width={597} height={759} priority className="mx-auto h-auto max-h-[56svh] w-auto max-w-full lg:mr-0 lg:justify-self-end [mask-image:radial-gradient(ellipse_at_center,#000_62%,transparent_98%)]" />
        </div>

        <div aria-label="Próximas clases">
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-2xl">{t.home.next}</h2>
            <span className="flex items-center gap-2 text-sm text-ok"><span className="h-2 w-2 animate-pulse rounded-full bg-ok" />{t.home.live}</span>
          </div>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {next.map((c) => (
              <li key={c.id}>
                <p className="mb-1 text-sm text-muted">{dateKey(new Date(c.startsAt)) === today ? t.home.today : formatDay(c.startsAt)}</p>
                <ClassCard c={c} viewer={viewer} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-24 px-6 lg:px-16">
        <h2 className="text-4xl sm:text-5xl">{t.home.ways}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {classTypes.map((ct) => (
            <article key={ct.id} className="overflow-hidden border border-line bg-surface" style={{ borderTop: `4px solid ${ct.color}` }}>
              <div className={`relative h-72 ${PHOTO[ct.id].fit === "contain" ? "bg-ink" : ""}`}>
                <Image src={PHOTO[ct.id].src} alt={t.classTypes[ct.id].name} fill sizes="(min-width: 768px) 33vw, 100vw" className={PHOTO[ct.id].fit === "contain" ? "object-contain" : "object-cover"} style={{ objectPosition: PHOTO[ct.id].pos }} />
              </div>
              <div className="p-6">
                <h3 className="text-3xl">{t.classTypes[ct.id].name}</h3>
                <p className="mt-3 text-muted">{t.classTypes[ct.id].blurb}</p>
                {ct.partner && <p className="mt-4 text-sm">{t.home.partner} {ct.partner}.</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-24 grid gap-10 px-6 md:grid-cols-2 lg:px-16">
        <div>
          <h2 className="text-4xl sm:text-5xl">{t.home.bookTitle}</h2>
          <p className="mt-4 max-w-md text-muted">{t.home.bookText}</p>
        </div>
        <ul className="space-y-4 text-lg">
          {t.home.bullets.map((b) => <li key={b} className="border-l-4 border-accent pl-4">{b}</li>)}
        </ul>
      </section>

      <section className="mt-24 px-6 lg:px-16">
        <h2 className="text-4xl sm:text-5xl">{t.site.plans.title}</h2>
        <p className="mt-3 max-w-xl text-muted">{t.site.plans.sub}</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col justify-between bg-accent p-8 text-accent-ink">
            <div>
              <h3 className="text-4xl">{t.site.plans.trialTitle}</h3>
              <p className="mt-3 max-w-sm text-lg">{t.site.plans.trialText}</p>
            </div>
            <Link href="/unete" className="mt-6 inline-block self-start bg-accent-ink px-6 py-3 font-semibold text-accent hover:brightness-125">{t.site.plans.trialBtn}</Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {plans.map((p) => (
              <li key={p.id} className="border border-line bg-surface p-5">
                <p className="font-display text-2xl font-bold uppercase">{t.plans[p.id]?.name ?? p.name}</p>
                <p className="mt-2 text-muted">{t.plans[p.id]?.blurb ?? p.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-24 px-6 lg:px-16">
        <h2 className="text-4xl sm:text-5xl">{t.site.coaches.title}</h2>
        <p className="mt-3 text-muted">{t.site.coaches.sub}</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {coaches.map((c) => (
            <li key={c.id} className="flex gap-4 border border-line bg-surface p-5">
              <span className="grid h-16 w-16 shrink-0 place-items-center bg-accent font-display text-3xl font-bold text-accent-ink" aria-hidden>{c.name.replace(/^(Coach|Instructor)\s+/, "").slice(0, 1)}</span>
              <div>
                <p className="text-xl font-semibold">{c.name}</p>
                <p className="mt-1 text-muted">{t.site.coaches.bios[c.id]}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">{t.site.coaches.sample}</p>
      </section>

      <section className="mt-24 grid gap-10 px-6 lg:grid-cols-[1fr_1.6fr] lg:px-16">
        <h2 className="text-4xl sm:text-5xl">{t.site.faq.title}</h2>
        <div className="divide-y divide-line border-y border-line">
          {t.site.faq.items.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {q}<span className="text-accent transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-24 grid gap-8 px-6 lg:grid-cols-2 lg:px-16" aria-labelledby="visit">
        <div>
          <h2 id="visit" className="text-4xl sm:text-5xl">{t.site.visit.title}</h2>
          <p className="mt-3 max-w-md text-muted">{t.site.visit.sub}</p>
          <p className="mt-6 text-lg">{tenant.contact.address}</p>
          <a href={tenant.contact.phoneHref} className="mt-1 inline-block text-lg hover:text-accent">{tenant.contact.phone}</a>
          <OpenNow className="mt-4" />
          <p className="mb-2 mt-6 font-display text-2xl font-bold uppercase">{t.site.visit.hours}</p>
          {tenant.hours.map((h) => (
            <p key={h.days} className="text-muted"><span className="text-paper">{t.footer.days[h.days] ?? h.days}</span> {h.time}</p>
          ))}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="bg-accent px-6 py-3 font-semibold text-accent-ink hover:brightness-110">{t.site.visit.map}</a>
            <a href={tenant.contact.phoneHref} className="border border-line px-6 py-3 font-semibold hover:border-accent">{t.site.call}</a>
          </div>
        </div>
        <iframe title={t.site.visit.mapTitle} src={`https://maps.google.com/maps?q=${encodeURIComponent(tenant.contact.mapsQuery)}&z=16&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="min-h-80 w-full border border-line grayscale invert-[.92] contrast-[.9] lg:min-h-full" />
      </section>
    </>
  );
}
