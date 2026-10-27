"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./LangProvider";

/** Handwritten signature on a canvas. Reports a PNG data URL, or "" when empty. */
export function Signature({ onChange }: { onChange: (png: string) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#111";
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * ref.current!.width) / r.width, y: ((e.clientY - r.top) * ref.current!.height) / r.height };
  };
  const down = (e: React.PointerEvent) => {
    drawing.current = true; ref.current!.setPointerCapture(e.pointerId);
    const ctx = ref.current!.getContext("2d")!; const p = pos(e);
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = ref.current!.getContext("2d")!; const p = pos(e);
    ctx.lineTo(p.x, p.y); ctx.stroke();
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false; setEmpty(false); onChange(ref.current!.toDataURL("image/png"));
  };
  const clear = () => {
    const c = ref.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setEmpty(true); onChange("");
  };

  return (
    <div>
      <canvas
        ref={ref} width={600} height={180} aria-label={t.join.sigLabel}
        className="w-full touch-none bg-paper"
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
      />
      <div className="mt-2 flex justify-between text-sm text-muted">
        <span>{empty ? t.join.sigHint : t.join.sigDone}</span>
        <button type="button" onClick={clear} className="underline underline-offset-4 hover:text-paper">{t.join.sigClear}</button>
      </div>
    </div>
  );
}
