import Image from "next/image";
import Link from "next/link";

/** Bulltrain's own round logo (transparent corners). Swap public/logo.png when they send the original file. */
export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const px = size === "lg" ? 120 : 84;
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Bulltrain Entrenamiento, inicio">
      <Image src="/logo.png" alt="Bulltrain Entrenamiento" width={px} height={px} priority />
    </Link>
  );
}
