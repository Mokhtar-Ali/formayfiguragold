"use client";
import { CalendarPicker } from "./CalendarPicker";
import { ClassCard } from "./ClassCard";

export function MemberCalendar() {
  return (
    <CalendarPicker renderDay={(_d, list, reload) => (
      <div className="grid gap-3 sm:grid-cols-2">{list.map((c) => <ClassCard key={c.id} c={c} viewer="member" onChange={reload} />)}</div>
    )} />
  );
}
