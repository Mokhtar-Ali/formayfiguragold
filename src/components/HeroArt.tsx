import { tenant } from "@/config/tenant";

/** Original line art in each gym's colors. Placeholder for real photography. */
export function HeroArt({ className = "" }: { className?: string }) {
  const art = tenant.copy.hero.art;
  return (
    <svg viewBox="0 0 520 520" role="img" aria-label={tenant.copy.hero.artAlt} className={className}>
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-accent-2)" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="260" cy="260" r="258" fill="url(#glow)" />
      {art === "gold" && <GoldArt />}
      {art === "blue" && <BlueArt />}
      {art === "red" && <RedArt />}
    </svg>
  );
}

/** A wireframe globe with a tilted orbit. */
function GoldArt() {
  const meridians = [30, 60, 90, 120, 150];
  const parallels = [-120, -60, 0, 60, 120];
  return (
    <g fill="none" stroke="url(#hg)" strokeWidth="1.6">
      <circle cx="260" cy="260" r="170" strokeWidth="3" />
      {meridians.map((deg) => (
        <ellipse key={deg} cx="260" cy="260" rx={170 * Math.abs(Math.cos((deg * Math.PI) / 180))} ry="170" opacity="0.7" />
      ))}
      {parallels.map((y) => {
        const half = Math.sqrt(170 * 170 - y * y);
        return <line key={y} x1={260 - half} x2={260 + half} y1={260 + y} y2={260 + y} opacity="0.7" />;
      })}
      <ellipse cx="260" cy="260" rx="236" ry="64" transform="rotate(-22 260 260)" strokeWidth="2.4" />
      <circle cx="441" cy="187" r="9" fill="var(--color-accent)" stroke="none" />
      <circle cx="260" cy="260" r="246" strokeDasharray="2 10" opacity="0.5" />
    </g>
  );
}

/** Twelve petals and two rings, drawn as a soft mandala. */
function BlueArt() {
  return (
    <g fill="none" stroke="url(#hg)" strokeWidth="1.6">
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="260" cy="160" rx="34" ry="100" transform={`rotate(${i * 30} 260 260)`} opacity={i % 2 ? 0.55 : 0.9} />
      ))}
      <circle cx="260" cy="260" r="60" strokeWidth="3" />
      <circle cx="260" cy="260" r="228" opacity="0.6" />
      <circle cx="260" cy="260" r="250" strokeDasharray="1 9" opacity="0.5" />
    </g>
  );
}

/** Heavy diagonal slashes inside a ring. */
function RedArt() {
  return (
    <g>
      <circle cx="260" cy="260" r="200" fill="none" stroke="url(#hg)" strokeWidth="3" />
      <g transform="skewX(-18) translate(95 0)">
        <rect x="150" y="120" width="52" height="280" fill="var(--color-accent)" />
        <rect x="224" y="120" width="52" height="280" fill="var(--color-accent)" opacity="0.65" />
        <rect x="298" y="120" width="52" height="280" fill="var(--color-accent)" opacity="0.35" />
      </g>
      <circle cx="260" cy="260" r="246" fill="none" stroke="url(#hg)" strokeDasharray="2 10" opacity="0.5" />
    </g>
  );
}
