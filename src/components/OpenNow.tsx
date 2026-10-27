import { openStatus } from "@/lib/hours";
import { formatTime, now } from "@/lib/time";
import { fill } from "@/lib/i18n";
import { getT } from "@/lib/lang";

/** "Open now, until 9:00 PM" or "Closed now, opens tomorrow at 5:00 AM". Computed on the server from the tenant hours. */
export async function OpenNow({ className = "" }: { className?: string }) {
  const { t } = await getT();
  const s = openStatus(now());
  const time = formatTime(s.at);
  const when = s.dayOffset === 0 ? t.site.today : s.dayOffset === 1 ? t.site.tomorrow : t.site.days[s.weekday];
  return (
    <p className={`flex items-center gap-2 text-base ${className}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${s.open ? "bg-ok" : "bg-bad"}`} aria-hidden />
      <span className="font-semibold text-paper">{s.open ? t.site.openNow : t.site.closedNow}</span>
      <span className="text-muted">{s.open ? fill(t.site.until, { t: time }) : fill(t.site.opensAt, { d: when, t: time })}</span>
    </p>
  );
}
