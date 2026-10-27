import type { Profile, Role } from "./types";
import { DomainError } from "./types";

export const isStaff = (p?: Profile | null) => !!p && (p.role === "reception" || p.role === "admin" || p.role === "coach");
export const isFrontDesk = (p?: Profile | null) => !!p && (p.role === "reception" || p.role === "admin");

export function requireUser(p: Profile | null | undefined): Profile {
  if (!p) throw new DomainError("UNAUTHENTICATED", "Inicia sesión para continuar.", 401);
  return p;
}

export function requireRole(p: Profile | null | undefined, ...roles: Role[]): Profile {
  const user = requireUser(p);
  if (!roles.includes(user.role)) throw new DomainError("FORBIDDEN", "No tienes permiso para esto.", 403);
  return user;
}
