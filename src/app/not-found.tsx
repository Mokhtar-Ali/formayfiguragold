import Link from "next/link";
import { getT } from "@/lib/lang";

export default async function NotFound() {
  const { t } = await getT();
  const c = t.notFound.cards;
  const cards = [
    { href: "/horarios", label: c.schedule },
    { href: "/unete", label: c.join },
    { href: "/entrar", label: c.enter },
    { href: "/", label: c.home },
  ];
  return (
    <div className="px-6 pt-10 lg:px-16">
      <p className="font-display text-[8rem] font-bold leading-none text-accent sm:text-[12rem]">404</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">{t.notFound.title}</h1>
      <p className="mt-3 max-w-xl text-lg text-muted">{t.notFound.sub}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((k) => (
          <Link key={k.href} href={k.href} className="group border border-line bg-surface hover:border-accent">
            <div className="aspect-[4/3] bg-gradient-to-br from-surface-2 to-ink" aria-hidden>
              <div className="h-full w-full opacity-60" style={{ backgroundImage: "repeating-linear-gradient(115deg, var(--color-accent) 0 1px, transparent 1px 16px)", opacity: 0.18 }} />
            </div>
            <div className="p-4">
              <p className="font-display text-2xl font-bold uppercase group-hover:text-accent">{k.label[0]}</p>
              <p className="text-muted">{k.label[1]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
