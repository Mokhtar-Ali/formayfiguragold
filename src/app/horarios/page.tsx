import Link from "next/link";
import { Words } from "@/components/words";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { addDays, dateKey, formatLongDay, fromKey, mondayOf, now } from "@/lib/time";
import { holidayName } from "@/lib/holidays";
import { classView } from "@/lib/views";
import { ClassCard, type Viewer } from "@/components/ClassCard";
import { classTypes } from "@/config/tenant";
import { getT } from "@/lib/lang";
import { fill } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Horarios({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const sp = await searchParams;
  const { t } = await getT();
  const today = dateKey(now());
  const monday = mondayOf(sp.w && /^\d{4}-\d{2}-\d{2}$/.test(sp.w) ? sp.w : today);
  const me = await getSession();
  const viewer: Viewer = !me ? "guest" : me.role === "member" ? "member" : "staff";
  const db = getDb();
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const thisMonday = mondayOf(today);
  const maxMonday = addDays(thisMonday, 7 * 7);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl sm:text-6xl"><Words text={t.schedule.title} /></h1>
          <p className="mt-3 max-w-xl text-muted">{t.schedule.sub}</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {monday > thisMonday ? <Link className="border border-line px-3 py-2 hover:border-accent" href={`/horarios?w=${addDays(monday, -7)}`}>{t.schedule.prev}</Link> : <span className="px-3 py-2 text-muted">{t.schedule.thisWeek}</span>}
          {monday < maxMonday && <Link className="border border-line px-3 py-2 hover:border-accent" href={`/horarios?w=${addDays(monday, 7)}`}>{t.schedule.next}</Link>}
        </div>
      </div>
      <ul className="mt-5 flex flex-wrap gap-4 text-sm text-muted">
        {classTypes.map((ct) => (
          <li key={ct.id} className="flex items-center gap-2"><span className="h-3 w-3" style={{ background: ct.color }} />{t.classTypes[ct.id].name}{ct.partner ? ` ${t.schedule.with} ${ct.partner}` : ""}</li>
        ))}
      </ul>

      <div className="mt-8 grid gap-4 md:grid-cols-7">
        {days.map((d) => {
          const holiday = holidayName(d);
          const slots = db.slots.filter((s) => dateKey(new Date(s.startsAt)) === d).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
          const isToday = d === today;
          return (
            <section key={d} aria-label={formatLongDay(fromKey(d))} className={`${slots.length === 0 && !holiday ? "hidden md:block" : ""}`}>
              <h2 className={`border-b-2 pb-2 text-xl ${isToday ? "border-accent text-accent" : "border-line"}`}>{formatLongDay(fromKey(d))}</h2>
              <div className="mt-3 space-y-3">
                {holiday && <p className="text-sm text-muted">{fill(t.schedule.holiday, { name: holiday })}</p>}
                {slots.map((s) => <ClassCard key={s.id} c={classView(db, s, me?.id)} viewer={viewer} />)}
                {!holiday && slots.length === 0 && <p className="text-sm text-muted">{t.schedule.none}</p>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
