import Image from "next/image";

/**
 * Stand-in artwork for a class card until the gym provides real photos:
 * the class color, a fine pattern and the class name set large.
 */
export function ClassCover({ name, color, className = "", photo }: { name: string; color: string; className?: string; photo?: string }) {
  if (photo) {
    return (
      <div className={`relative isolate overflow-hidden ${className}`}>
        <Image src={photo} alt={name} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,.45), transparent 40%)" }} aria-hidden />
        <span className="absolute left-5 top-5 h-2.5 w-2.5 rounded-full" style={{ background: color }} aria-hidden />
      </div>
    );
  }
  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 85% 0%, ${color}55, transparent 60%), linear-gradient(160deg, var(--color-surface-2), var(--color-ink))`,
      }}
      role="img"
      aria-label={name}
    >
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{ backgroundImage: `repeating-linear-gradient(115deg, ${color}22 0 1px, transparent 1px 14px)` }}
      />
      <p
        className="absolute inset-x-5 bottom-3 select-none font-display text-[clamp(2.4rem,4.2vw,3.6rem)] font-bold uppercase leading-[0.9]"
        style={{ color: "transparent", WebkitTextStroke: `1.5px ${color}` }}
        aria-hidden
      >
        {name}
      </p>
      <span className="absolute left-5 top-5 h-2.5 w-2.5 rounded-full" style={{ background: color }} aria-hidden />
    </div>
  );
}
