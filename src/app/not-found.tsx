import Image from "next/image";
import Link from "next/link";
import { getT } from "@/lib/lang";

export default async function NotFound() {
  const { t } = await getT();
  const c = t.notFound.cards;
  const cards = [
    { href: "/horarios", label: c.schedule, img: "/classes/cycling.jpg", pos: "50% 35%" },
    { href: "/unete", label: c.join, img: "/classes/hibrido.jpg", pos: "50% 12%" },
    { href: "/entrar", label: c.enter, img: "/bull.png" },
    { href: "/", label: c.home, img: "/logo.png" },
  ];
  return (
    <div className="px-6 pt-10 lg:px-16">
      <p className="font-display text-[8rem] font-bold leading-none text-bull sm:text-[12rem]">404</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">{t.notFound.title}</h1>
      <p className="mt-3 max-w-xl text-lg text-muted">{t.notFound.sub}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((k) => (
          <Link key={k.href} href={k.href} className="group border border-line bg-surface hover:border-bull">
            <div className="relative aspect-[4/3] overflow-hidden bg-black">
              <Image src={k.img} alt="" style={{ objectPosition: k.pos }} fill sizes="(min-width:1024px) 25vw, 50vw" className={`${k.img.endsWith("png") ? "object-contain p-4" : "object-cover"} transition-transform duration-300 group-hover:scale-105`} />
            </div>
            <div className="p-4">
              <p className="font-display text-2xl font-bold uppercase group-hover:text-bull">{k.label[0]}</p>
              <p className="text-muted">{k.label[1]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
