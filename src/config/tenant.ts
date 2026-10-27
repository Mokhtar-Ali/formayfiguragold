import { active } from "./tenants";

/**
 * The rest of the app imports from here. Which gym this is comes from the
 * TENANT environment variable, see tenants/index.ts.
 */
export const tenant = active.tenant;
export const classTypes = active.classTypes;
export const coaches = active.coaches;
export const plans = active.plans;
export const templates = active.templates;
export const events = active.events ?? [];

export const getClassType = (id: string) => classTypes.find((c) => c.id === id);
export const getCoach = (id: string) => coaches.find((c) => c.id === id);
export const getPlan = (id: string) => plans.find((p) => p.id === id);
