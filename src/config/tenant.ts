import type { ClassTemplate, ClassType, Coach, Plan } from "@/lib/types";

/**
 * One tenant config describes the whole gym: brand, classes, plans, rules.
 * The same shape drives the Focus Box Gym portal, so a second location or a
 * second gym is a new config file, not new code.
 *
 * Everything here is sample data for the demo. Real values arrive from the gym.
 */
export const tenant = {
  id: "bulltrain",
  timezone: "America/Bogota",
  brand: {
    name: "Bulltrain",
    subtitle: "Entrenamiento",
    tagline: "El Gimnasio de Laureles",
    founded: 2013,
  },
  contact: {
    address: "Cra 79 #37-55, Laureles - Estadio, Medellín",
    phone: "301 268 7229",
    phoneHref: "tel:+573012687229",
    // Sample WhatsApp number, same as the phone. Confirm with the gym.
    whatsappHref: "https://wa.me/573012687229",
    mapsQuery: "Cra 79 #37-55, Laureles, Medellín",
    instagram: "@bulltrain",
    // Sample links. Confirm the real profile URLs with the gym.
    instagramUrl: "https://www.instagram.com/bulltrain/",
    facebookUrl: "https://www.facebook.com/bulltrain",
  },
  hours: [
    { days: "Lunes a jueves", time: "5:00 AM - 9:00 PM" },
    { days: "Viernes", time: "5:00 AM - 8:00 PM" },
    { days: "Sábado", time: "8:00 AM - 1:00 PM" },
    { days: "Domingo", time: "9:00 AM - 12:00 PM" },
  ],
  /** Opening hours by weekday (0 = Sunday), "HH:MM" local time. Drives the "open now" label. */
  openingHours: {
    0: ["09:00", "12:00"],
    1: ["05:00", "21:00"],
    2: ["05:00", "21:00"],
    3: ["05:00", "21:00"],
    4: ["05:00", "21:00"],
    5: ["05:00", "20:00"],
    6: ["08:00", "13:00"],
  } as Record<number, [string, string]>,
  booking: {
    maxBookingsPerDay: 2,
    cancelWindowHours: 2,
    opensDaysAhead: 14,
    waitlistMax: 10,
    scheduleWeeksAhead: 8,
  },
  goals: {
    monthlyNewMembers: 20,
    monthlyRevenueCop: 18_000_000,
  },
} as const;

export const classTypes: ClassType[] = [
  {
    id: "hibrido",
    name: "Entrenamiento Híbrido",
    color: "#ffc20e",
    blurb: "Fuerza y cardio en una sola sesión, con cupos limitados.",
  },
  {
    id: "bullrunning",
    name: "BullRunning",
    color: "#ff8a4c",
    blurb: "Salida de running en grupo, con técnica y ritmo.",
  },
  {
    id: "cycling",
    name: "Cycling",
    color: "#8fb4ff",
    blurb: "Sala de cycling con música y luces.",
    partner: "Goodcycle",
  },
];

export const coaches: Coach[] = [
  { id: "c_andres", name: "Coach Andrés" },
  { id: "c_laura", name: "Coach Laura" },
  { id: "c_ciclo", name: "Instructor Goodcycle" },
];

export const plans: Plan[] = [
  {
    id: "mensual",
    name: "Mensual ilimitado",
    kind: "unlimited",
    credits: 0,
    durationDays: 30,
    blurb: "Reserva todas las clases que quieras durante 30 días.",
    priceCop: 150_000,
  },
  {
    id: "pack12",
    name: "Paquete de 12 clases",
    kind: "pack",
    credits: 12,
    durationDays: 45,
    blurb: "12 créditos para usar en 45 días.",
    priceCop: 140_000,
  },
  {
    id: "pack8",
    name: "Paquete de 8 clases",
    kind: "pack",
    credits: 8,
    durationDays: 30,
    blurb: "8 créditos para usar en 30 días.",
    priceCop: 100_000,
  },
  {
    id: "dia",
    name: "Pase del día",
    kind: "pass",
    credits: 1,
    durationDays: 1,
    blurb: "Una clase, un día. Ideal para conocer el gimnasio.",
    priceCop: 20_000,
  },
];

/** Weekly pattern. Slots are generated from these, eight weeks ahead. */
export const templates: ClassTemplate[] = [
  { id: "t_hib_lun", classTypeId: "hibrido", weekday: 1, time: "18:30", durationMin: 60, capacity: 16, coachId: "c_andres" },
  { id: "t_hib_mie", classTypeId: "hibrido", weekday: 3, time: "18:30", durationMin: 60, capacity: 16, coachId: "c_laura" },
  { id: "t_hib_sab", classTypeId: "hibrido", weekday: 6, time: "09:00", durationMin: 60, capacity: 16, coachId: "c_andres" },
  { id: "t_run_mar", classTypeId: "bullrunning", weekday: 2, time: "20:00", durationMin: 60, capacity: 25, coachId: "c_laura" },
  { id: "t_cyc_lun", classTypeId: "cycling", weekday: 1, time: "06:00", durationMin: 45, capacity: 18, coachId: "c_ciclo" },
  { id: "t_cyc_jue", classTypeId: "cycling", weekday: 4, time: "18:00", durationMin: 45, capacity: 18, coachId: "c_ciclo" },
];

export const getClassType = (id: string) => classTypes.find((c) => c.id === id);
export const getCoach = (id: string) => coaches.find((c) => c.id === id);
export const getPlan = (id: string) => plans.find((p) => p.id === id);
