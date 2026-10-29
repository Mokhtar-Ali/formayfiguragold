import Image from "next/image";
import Link from "next/link";
import { tenant } from "@/config/tenant";

/**
 * Header and footer mark. When the gym sends its logo file, set brand.logo in its
 * config and the image is used. Until then this is a typographic wordmark, a
 * stand-in and not their logo.
 */
export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const { name, subtitle, logo } = tenant.brand;
  const label = `${name} ${subtitle}, inicio`;
  return (
    <Link href="/" className="inline-flex items-center" aria-label={label}>
      {logo ? (
        <Image src={logo.src} alt={`${name} ${subtitle}`} width={logo.width} height={logo.height} priority className={size === "lg" ? "h-28 w-auto" : "h-20 w-auto"} />
      ) : (
        <span className="flex flex-col leading-none">
          <span className={`font-display font-bold uppercase tracking-[0.22em] text-paper ${size === "lg" ? "text-sm" : "text-[0.7rem]"}`}>{name}</span>
          <span className={`font-display font-bold uppercase text-accent ${size === "lg" ? "mt-2 text-5xl tracking-[0.14em]" : "mt-1.5 text-3xl tracking-[0.14em]"}`}>{subtitle}</span>
        </span>
      )}
    </Link>
  );
}
