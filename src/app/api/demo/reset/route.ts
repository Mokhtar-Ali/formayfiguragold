import { handle, ok } from "@/lib/api";
import { resetDb } from "@/lib/db";

/** Puts the demo back to its starting data. Handy between meetings. */
export function POST() {
  return handle(() => {
    resetDb();
    return ok({ ok: true });
  });
}
