import Link from "next/link";
import { getT } from "@/lib/lang";

export const metadata = { title: "Demo" };

export default async function Demo() {
  const { t } = await getT();
  return (
    <div className="px-6 pt-10 lg:px-16">
      <div className="bg-bull p-8 text-bull-ink sm:p-12">
        <h1 className="text-4xl sm:text-6xl">{t.home.tryTitle}</h1>
        <p className="mt-4 max-w-xl text-lg">{t.home.tryText}</p>
        <Link href="/entrar" className="mt-6 inline-block bg-bull-ink px-6 py-3 font-semibold text-bull hover:brightness-125">{t.home.tryBtn}</Link>
      </div>
    </div>
  );
}
