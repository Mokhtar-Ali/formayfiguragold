"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll motion for the public pages: headings rise in word by word, and
 * paragraphs, cards and photos fade up as they enter the screen.
 * Skipped for people who prefer reduced motion and on the staff and member
 * screens, where content updates live. Content stays visible without JS.
 */
const BLOCKS = "main p, main article, main details, main iframe, main li, main .fx-block";
const SKIP_PATHS = ["/staff", "/portal"];

function splitWords(h: HTMLElement) {
  if (h.dataset.fxSplit) return;
  const onlyText = Array.from(h.childNodes).every((n) => n.nodeType === 3 || (n instanceof HTMLElement && n.tagName === "BR"));
  if (!onlyText) return;
  let i = 0;
  const nodes = Array.from(h.childNodes);
  h.dataset.fxSplit = "1";
  for (const n of nodes) {
    if (n.nodeType !== 3) continue;
    const frag = document.createDocumentFragment();
    (n.textContent ?? "").split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
      const w = document.createElement("span");
      w.className = "fx-w";
      w.style.setProperty("--i", String(i++));
      w.textContent = part;
      frag.appendChild(w);
    });
    n.replaceWith(frag);
  }
}

export function ScrollFX() {
  const path = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || SKIP_PATHS.some((p) => path.startsWith(p))) {
      document.querySelectorAll<HTMLElement>("main h1").forEach((h) => h.classList.add("fx-ready"));
      return;
    }
    root.classList.add("fx");

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.classList.contains("fx-item")) el.style.transitionDelay = `${Math.min(n++, 6) * 80}ms`;
          el.classList.add("fx-in");
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );

    const raf = requestAnimationFrame(() => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>("main h1, main h2").forEach((h) => {
        splitWords(h);
        h.classList.add("fx-ready");
        const below = h.getBoundingClientRect().top > vh * 0.95;
        if (below) io.observe(h);
        else requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add("fx-in")));
      });

      const all = Array.from(document.querySelectorAll<HTMLElement>(BLOCKS));
      const targets = all.filter((el) => !el.parentElement?.closest(BLOCKS) && !el.closest("h1, h2, button, [role=tablist]"));
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= vh * 0.95) continue;
        el.classList.add("fx-item");
        io.observe(el);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [path]);

  return null;
}
