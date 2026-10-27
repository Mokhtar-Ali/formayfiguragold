import type { ClassTemplate, ClassType, Coach, Plan } from "@/lib/types";
import type { TenantConfig } from "./types";

/**
 * Forma y Figura GOLD, Itagüí.
 *
 * What comes from the gym's own Instagram (@formayfiguragold): the name, the
 * address, the WhatsApp number, the tagline, the black and gold identity, and
 * the fact that they run Rumba and Cycling classes and sell a monthly plan.
 * Everything else is SAMPLE and must be confirmed with the gym: opening hours,
 * the weekly schedule, capacities, coach names, plan names and prices beyond
 * the promo range seen on the flyers.
 */
export const tenant = {
  id: "gold",
  timezone: "America/Bogota",
  brand: {
    name: "Forma y Figura",
    subtitle: "GOLD",
    tagline: "Aquí no competimos, evolucionamos",
  },
  contact: {
    address: "Carrera 58 # 83-60, Itagüí",
    // Same number as the WhatsApp link on their Instagram. Confirm it is also the landline for calls.
    phone: "304 466 1833",
    phoneHref: "tel:+573044661833",
    whatsappHref: "https://wa.me/573044661833",
    mapsQuery: "Carrera 58 # 83-60, Itagüí, Antioquia",
    instagram: "@formayfiguragold",
    instagramUrl: "https://www.instagram.com/formayfiguragold/",
  },
  // SAMPLE hours. Confirm with the gym.
  hours: [
    { days: "Lunes a viernes", time: "5:00 AM - 9:00 PM" },
    { days: "Sábado", time: "7:00 AM - 1:00 PM" },
    { days: "Domingo", time: "8:00 AM - 12:00 PM" },
  ],
  openingHours: {
    0: ["08:00", "12:00"],
    1: ["05:00", "21:00"],
    2: ["05:00", "21:00"],
    3: ["05:00", "21:00"],
    4: ["05:00", "21:00"],
    5: ["05:00", "21:00"],
    6: ["07:00", "13:00"],
  } as Record<number, [string, string] | null>,
  booking: {
    maxBookingsPerDay: 2,
    cancelWindowHours: 2,
    opensDaysAhead: 14,
    waitlistMax: 10,
    scheduleWeeksAhead: 8,
  },
  goals: {
    monthlyNewMembers: 40,
    monthlyRevenueCop: 14_000_000,
  },
  theme: {
    ink: "#0a0907",
    surface: "#14110c",
    surface2: "#1c1810",
    line: "#2f2819",
    paper: "#f7f2e6",
    muted: "#aaa089",
    accent: "#e2b04a",
    accentInk: "#140e02",
    accent2: "#8a6a1f",
    fontDisplay: '"Cinzel", "Times New Roman", serif',
    fontSans: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
    headingCase: "uppercase",
    headingWeight: 700,
    headingTracking: "0.04em",
  },
  copy: {
    hero: {
      title1: "Aquí no competimos,",
      title2: "evolucionamos",
      sub: "Maquinaria importada, clases grupales y coaches expertos en Itagüí. Reserva tu cupo en línea.",
      art: "gold",
      artAlt: "Ilustración dorada de un globo con líneas de meridiano",
    },
    metaTitle: "Forma y Figura GOLD | Gimnasio en Itagüí",
    metaDescription:
      "Gimnasio en Itagüí con maquinaria importada, rumba, cycling y coaches expertos. Reserva tu clase en línea y entra a la lista de espera si se llena.",
    area: "Itagüí · Antioquia",
    visitSub: "Estamos en Itagüí. Pasa a conocer la sala, la maquinaria y las clases.",
    sampleNote: "Horarios y precios de ejemplo. El gimnasio confirma los reales.",
    coachBios: {
      c_camilo: "Dirige la Rumba de lunes, miércoles y viernes.",
      c_daniela: "Dirige el Funcional guiado y la Rumba del sábado.",
      c_ciclo: "Instructor de Cycling. Dirige las clases de bicicleta.",
    },
    demoCoachId: "c_camilo",
    whatsappMessage: "Hola, quiero información sobre Forma y Figura GOLD.",
  },
} as const satisfies TenantConfig;

export const classTypes: ClassType[] = [
  {
    id: "rumba",
    name: "Rumba",
    color: "#e2b04a",
    blurb: "Baile fitness con música latina. Cardio que no se siente como cardio.",
  },
  {
    id: "cycling",
    name: "Cycling",
    color: "#f3dc9c",
    blurb: "Sala de cycling con música y luces. Agenda tu bicicleta en menos de un minuto.",
  },
  {
    id: "funcional",
    name: "Funcional guiado",
    color: "#b98b2e",
    blurb: "Circuitos guiados por un coach en la zona de maquinaria importada.",
  },
];

// SAMPLE names. The gym provides the real team.
export const coaches: Coach[] = [
  { id: "c_camilo", name: "Coach Camilo" },
  { id: "c_daniela", name: "Coach Daniela" },
  { id: "c_ciclo", name: "Instructor de Cycling" },
];

// SAMPLE plans. The one-month and two-month prices follow the promo range seen on their flyers.
export const plans: Plan[] = [
  {
    id: "mensual",
    name: "Mensual ilimitado",
    kind: "unlimited",
    credits: 0,
    durationDays: 30,
    blurb: "Reserva todas las clases que quieras durante 30 días.",
    priceCop: 64_900,
  },
  {
    id: "bimestral",
    name: "Dos meses ilimitado",
    kind: "unlimited",
    credits: 0,
    durationDays: 60,
    blurb: "Dos meses de clases sin límite al mejor valor.",
    priceCop: 149_900,
  },
  {
    id: "pack12",
    name: "Paquete de 12 clases",
    kind: "pack",
    credits: 12,
    durationDays: 45,
    blurb: "12 créditos para usar en 45 días.",
    priceCop: 79_900,
  },
  {
    id: "pack8",
    name: "Paquete de 8 clases",
    kind: "pack",
    credits: 8,
    durationDays: 30,
    blurb: "8 créditos para usar en 30 días.",
    priceCop: 59_900,
  },
  {
    id: "dia",
    name: "Pase del día",
    kind: "pass",
    credits: 1,
    durationDays: 1,
    blurb: "Una clase, un día. Ideal para conocer el gimnasio.",
    priceCop: 15_000,
  },
];

/** SAMPLE weekly pattern. Slots are generated from these, eight weeks ahead. */
export const templates: ClassTemplate[] = [
  { id: "t_rum_lun", classTypeId: "rumba", weekday: 1, time: "18:30", durationMin: 60, capacity: 24, coachId: "c_camilo" },
  { id: "t_rum_mie", classTypeId: "rumba", weekday: 3, time: "18:30", durationMin: 60, capacity: 24, coachId: "c_camilo" },
  { id: "t_rum_vie", classTypeId: "rumba", weekday: 5, time: "18:30", durationMin: 60, capacity: 24, coachId: "c_camilo" },
  { id: "t_rum_sab", classTypeId: "rumba", weekday: 6, time: "09:00", durationMin: 60, capacity: 24, coachId: "c_daniela" },
  { id: "t_cyc_mar_am", classTypeId: "cycling", weekday: 2, time: "06:00", durationMin: 45, capacity: 20, coachId: "c_ciclo" },
  { id: "t_cyc_mar_pm", classTypeId: "cycling", weekday: 2, time: "19:00", durationMin: 45, capacity: 20, coachId: "c_ciclo" },
  { id: "t_cyc_jue_pm", classTypeId: "cycling", weekday: 4, time: "19:00", durationMin: 45, capacity: 20, coachId: "c_ciclo" },
  { id: "t_cyc_sab", classTypeId: "cycling", weekday: 6, time: "10:15", durationMin: 45, capacity: 20, coachId: "c_ciclo" },
  { id: "t_fun_lun", classTypeId: "funcional", weekday: 1, time: "06:00", durationMin: 50, capacity: 14, coachId: "c_daniela" },
  { id: "t_fun_mie", classTypeId: "funcional", weekday: 3, time: "06:00", durationMin: 50, capacity: 14, coachId: "c_daniela" },
  { id: "t_fun_jue", classTypeId: "funcional", weekday: 4, time: "18:00", durationMin: 50, capacity: 14, coachId: "c_daniela" },
];
