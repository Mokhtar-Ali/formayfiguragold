"use client";
import { useState } from "react";
import { ARTICLES, type Article } from "@/lib/help-articles";

export function HelpCenter({ audience }: { audience: Article["audience"] }) {
  const [q, setQ] = useState("");
  const term = q.toLowerCase().trim();
  const list = ARTICLES.filter((a) => a.audience === audience && (!term || (a.title + " " + a.body).toLowerCase().includes(term)));
  return (
    <div className="max-w-3xl">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar, por ejemplo: cancelar" aria-label="Buscar en la ayuda" className="w-full border border-line bg-surface px-4 py-3 text-lg placeholder:text-muted" />
      <div className="mt-6 divide-y divide-line border border-line">
        {list.map((a) => (
          <details key={a.id} className="group px-4 py-3" open={!!term}>
            <summary className="cursor-pointer font-semibold marker:text-accent">{a.title}</summary>
            <p className="mt-2 text-muted">{a.body}</p>
          </details>
        ))}
        {list.length === 0 && <p className="px-4 py-3 text-muted">No encontramos nada con esa búsqueda. Prueba con otra palabra.</p>}
      </div>
    </div>
  );
}
