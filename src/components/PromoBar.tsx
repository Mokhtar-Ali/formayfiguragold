import Link from "next/link";
import { tenant } from "@/config/tenant";
import { dateKey, now } from "@/lib/time";

/** Promo strip at the top of every public page. Driven by tenant.copy.promo, hidden after its end date. */
export function PromoBar() {
  const promo = tenant.copy.promo;
  if (!promo || dateKey(now()) > promo.endsOn) return null;
  return (
    <div className="bg-accent text-accent-ink">
      <Link href={promo.href} className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-2 text-center text-sm font-semibold hover:brightness-110">
        <span>{promo.text}</span>
        <span className="text-xs font-normal opacity-80">(promo de ejemplo)</span>
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
