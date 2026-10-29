import Image from "next/image";
import { tenant } from "@/config/tenant";

/** Photo mosaic for the home page. Renders only when the tenant has real photos in config.media. */
export function Gallery() {
  const m = tenant.media;
  if (!m?.gallery || m.gallery.length < 3 || !m.heroLogo) return null;
  const [a, b, c] = m.gallery;
  const tile = "relative overflow-hidden border border-line";
  return (
    <section className="mt-24 px-6 lg:px-16" aria-label="El gimnasio">
      <div className="grid grid-cols-2 gap-3 md:h-[34rem] md:grid-cols-4 md:grid-rows-2">
        <div className={`${tile} col-span-1 row-span-2 min-h-72 md:min-h-0`}>
          <Image src={a.src} alt={a.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
        </div>
        <div className={`${tile} col-span-1 min-h-40 md:col-span-2 md:min-h-0`}>
          <Image src={b.src} alt={b.alt} fill sizes="(min-width:768px) 50vw, 50vw" className="object-cover" />
        </div>
        <div className={`${tile} col-span-2 row-span-2 hidden place-items-center bg-ink md:col-span-1 md:grid`} style={{ background: "radial-gradient(70% 60% at 50% 45%, var(--color-accent-2), var(--color-ink))" }}>
          <Image src={m.heroLogo.src} alt={m.heroLogo.alt} width={m.heroLogo.width} height={m.heroLogo.height} className="h-[88%] w-auto" />
        </div>
        <div className={`${tile} col-span-1 min-h-40 md:col-span-2 md:min-h-0`}>
          <Image src={c.src} alt={c.alt} fill sizes="(min-width:768px) 50vw, 50vw" className="object-cover object-top" />
        </div>
      </div>
    </section>
  );
}
