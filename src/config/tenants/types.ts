import type { ClassTemplate, ClassType, Coach, Plan } from "@/lib/types";

/** The shape every gym config follows. A new gym is a new file in this folder, not new code. */
export interface TenantConfig {
  id: string;
  timezone: string;
  brand: { name: string; subtitle: string; tagline: string; founded?: number };
  contact: {
    address: string;
    phone: string;
    phoneHref: string;
    whatsappHref: string;
    mapsQuery: string;
    instagram: string;
    instagramUrl: string;
    facebookUrl: string;
  };
  hours: readonly { days: string; time: string }[];
  /** Opening hours by weekday (0 = Sunday), "HH:MM" local time. Drives the "open now" label. */
  openingHours: Record<number, [string, string]>;
  booking: {
    maxBookingsPerDay: number;
    cancelWindowHours: number;
    opensDaysAhead: number;
    waitlistMax: number;
    scheduleWeeksAhead: number;
  };
  goals: { monthlyNewMembers: number; monthlyRevenueCop: number };
}

export interface TenantBundle {
  tenant: TenantConfig;
  classTypes: ClassType[];
  coaches: Coach[];
  plans: Plan[];
  templates: ClassTemplate[];
}
