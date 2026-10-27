import { cookies } from "next/headers";
import type { Profile } from "./types";
import { getDb } from "./db";
import { DEMO_ACCOUNTS } from "./seed";

export const SESSION_COOKIE = "bt_session";

/**
 * Demo sign-in: the cookie holds a profile id, nothing more.
 * Production replaces this file with Supabase Auth; every caller keeps
 * using getSession() and the role checks in access.ts.
 */
export async function getSession(): Promise<Profile | null> {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return getDb().profiles.find((p) => p.id === id) ?? null;
}

export function isDemoAccountId(id: string): boolean {
  return (Object.values(DEMO_ACCOUNTS) as string[]).includes(id);
}
