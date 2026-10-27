import * as gold from "./tenants/gold";
import * as blue from "./tenants/blue";
import * as red from "./tenants/red";
import type { TenantBundle } from "./tenants/types";
import { tenant } from "./tenant";

/**
 * The Forma y Figura group: three sedes, one system. Each sede is its own deployment
 * (same code, a different TENANT value). Set the real addresses in the NEXT_PUBLIC_URL_*
 * variables once the three Vercel projects exist; until then these are the expected names.
 */
const bundles: Record<string, { bundle: TenantBundle; url: string }> = {
  gold: { bundle: gold, url: process.env.NEXT_PUBLIC_URL_GOLD ?? "https://forma-gold.vercel.app" },
  blue: { bundle: blue, url: process.env.NEXT_PUBLIC_URL_BLUE ?? "https://forma-blue.vercel.app" },
  red: { bundle: red, url: process.env.NEXT_PUBLIC_URL_RED ?? "https://forma-red.vercel.app" },
};

export const SEDES = Object.entries(bundles).map(([id, { bundle, url }]) => ({
  id,
  url,
  name: bundle.tenant.brand.name,
  subtitle: bundle.tenant.brand.subtitle,
  tagline: bundle.tenant.brand.tagline,
  address: bundle.tenant.contact.address,
  instagram: bundle.tenant.contact.instagram,
  instagramUrl: bundle.tenant.contact.instagramUrl,
  theme: bundle.tenant.theme,
  current: id === tenant.id,
}));
