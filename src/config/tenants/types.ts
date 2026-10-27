import type { ClassTemplate, ClassType, Coach, EventDef, Plan } from "@/lib/types";

/** Colors and type for one gym. Applied as CSS variables by the root layout. */
export interface TenantTheme {
  ink: string;
  surface: string;
  surface2: string;
  line: string;
  paper: string;
  muted: string;
  accent: string;
  accentInk: string;
  /** Second brand color, used for gradients and small highlights. */
  accent2: string;
  fontDisplay: string;
  fontSans: string;
  headingCase: "uppercase" | "none";
  headingWeight: number;
  headingTracking: string;
}

/** Texts that change from one gym to the next. Everything else is shared. */
export interface TenantCopy {
  hero: { title1: string; title2: string; sub: string; art: "gold" | "blue" | "red"; artAlt: string };
  metaTitle: string;
  metaDescription: string;
  /** Short place line used in the footer, for example "Itagüí · Antioquia". */
  area: string;
  visitSub: string;
  /** Shown next to hours and prices that still need the gym's confirmation. */
  sampleNote: string;
  coachBios: Record<string, string>;
  /** The coach featured on the home page. */
  spotlight: { coachId: string; title: string; text: string };
  /** Banner at the top of every public page until endsOn (local date). Sample until the gym confirms. */
  promo?: { text: string; endsOn: string; href: string };
  /** The coach account the "Entrar" page signs in as. */
  demoCoachId: string;
  whatsappMessage: string;
}

/** The shape every gym config follows. A new gym is a new file in this folder, not new code. */
export interface TenantConfig {
  id: string;
  timezone: string;
  brand: { name: string; subtitle: string; tagline: string; logo?: { src: string; width: number; height: number } };
  contact: {
    address: string;
    phone: string;
    phoneHref: string;
    whatsappHref: string;
    mapsQuery: string;
    instagram: string;
    instagramUrl: string;
    facebookUrl?: string;
  };
  hours: readonly { days: string; time: string }[];
  /** Opening hours by weekday (0 = Sunday), "HH:MM" local time. Drives the "open now" label. */
  openingHours: Record<number, [string, string] | null>;
  booking: {
    maxBookingsPerDay: number;
    cancelWindowHours: number;
    opensDaysAhead: number;
    waitlistMax: number;
    scheduleWeeksAhead: number;
  };
  goals: { monthlyNewMembers: number; monthlyRevenueCop: number };
  theme: TenantTheme;
  copy: TenantCopy;
}

export interface TenantBundle {
  tenant: TenantConfig;
  classTypes: ClassType[];
  coaches: Coach[];
  plans: Plan[];
  templates: ClassTemplate[];
  events?: EventDef[];
}
