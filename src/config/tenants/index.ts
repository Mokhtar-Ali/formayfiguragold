import * as gold from "./gold";
import type { TenantBundle } from "./types";

const all: Record<string, TenantBundle> = { gold };

/** The gym this deployment serves. Set TENANT in the environment (one Vercel project per gym). */
export const tenantId = process.env.TENANT ?? "gold";

export const active: TenantBundle = all[tenantId] ?? gold;
