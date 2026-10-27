import { handle } from "@/lib/api";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requireRole } from "@/lib/access";
import { membersCsv } from "@/lib/reports";
import { now } from "@/lib/time";

export function GET() {
  return handle(async () => {
    requireRole(await getSession(), "admin");
    return new Response("﻿" + membersCsv(getDb(), now()), {
      headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="socios-bulltrain.csv"' },
    });
  });
}
