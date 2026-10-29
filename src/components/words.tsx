/**
 * Splits a heading into words that slide up from behind a mask when the
 * heading scrolls into view (see globals.css and reveal-observer.tsx).
 * The text stays real text for screen readers and search engines.
 */
export function Words({ text }: { text: string }) {
  const words = text.split(" ").filter(Boolean);
  return (
    <span data-reveal="words">
      {words.map((w, i) => (
        <span key={i}>
          <span className="word-mask">
            <span className="word" style={{ "--i": i } as React.CSSProperties}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
