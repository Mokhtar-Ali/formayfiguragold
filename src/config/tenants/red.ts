import type { ClassTemplate, ClassType, Coach, EventDef, Plan } from "@/lib/types";
import type { TenantConfig } from "./types";

/**
 * Forma y Figura Sede RED.
 *
 * Only the name, the Instagram handle (@formayfigurared) and the logo colors come from
 * the gym's public profile. EVERYTHING ELSE here is SAMPLE and must be confirmed
 * with the gym before this site is shown as theirs: address, phone, WhatsApp,
 * hours, classes, schedule, coach names and prices. Nothing is copied from Gold.
 */
export const tenant = {
  id: "red",
  timezone: "America/Bogota",
  brand: {
    name: "Forma y Figura",
    subtitle: "RED",
    tagline: "Fuerza que se nota",
  },
  contact: {
    address: "Dirección por confirmar",
    phone: "300 000 0000",
    phoneHref: "tel:+573000000000",
    whatsappHref: "https://wa.me/573000000000",
    mapsQuery: "Antioquia, Colombia",
    instagram: "@formayfigurared",
    instagramUrl: "https://www.instagram.com/formayfigurared/",
  },
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
  booking: { maxBookingsPerDay: 2, cancelWindowHours: 2, opensDaysAhead: 14, waitlistMax: 10, scheduleWeeksAhead: 8 },
  goals: { monthlyNewMembers: 30, monthlyRevenueCop: 12_000_000 },
  theme: {
    ink: "#0b0707", surface: "#151010", surface2: "#1e1414", line: "#35201f", paper: "#f7efee", muted: "#b39d9a",
    accent: "#ea3a33", accentInk: "#ffffff", accent2: "#7a1212",
    fontDisplay: '"Anton", "Arial Narrow", Impact, sans-serif', fontSans: '"Barlow", "Helvetica Neue", Arial, sans-serif',
    headingCase: "uppercase", headingWeight: 400, headingTracking: "0.03em",
  },
  copy: {
    hero: {
      title1: "Sube la intensidad,",
      title2: "sube el nivel",
      sub: "Fuerza, HIIT y boxeo fit con coaches que te empujan. Reserva tu cupo y entra a la lista de espera si se llena.",
      art: "red",
      artAlt: "Ilustración de franjas rojas diagonales dentro de un anillo",
    },
    metaTitle: "Forma y Figura RED | Fuerza, HIIT y boxeo fit",
    metaDescription: "Sede RED de Forma y Figura. Fuerza, HIIT y boxeo fit con coaches expertos. Reserva tu clase en línea y entra a la lista de espera si se llena.",
    area: "Sede RED",
    visitSub: "Pasa a conocer la sede y las clases.",
    sampleNote: "Datos de ejemplo. El gimnasio confirma dirección, horarios, clases y precios.",
    coachBios: {
      c_mateo: "Dirige Fuerza total y el HIIT de los viernes.",
      c_juliana: "Dirige el Boxeo fit y el HIIT de la semana.",
    },
    spotlight: {
      coachId: "c_mateo",
      title: "Coach destacado",
      text: "Mateo dirige Fuerza total: técnica primero, peso después. Si quieres resultados que se vean, empieza aquí.",
    },
    promo: { text: "Mes de fuerza: dos meses ilimitado a precio especial", endsOn: "2026-11-30", href: "/unete" },
    demoCoachId: "c_mateo",
    whatsappMessage: "Hola, quiero información sobre Forma y Figura RED.",
  },
} as const satisfies TenantConfig;

export const classTypes: ClassType[] = [
  { id: "fuerza", name: "Fuerza total", color: "#ea3a33", blurb: "Barras, mancuernas y técnica para ganar fuerza de verdad." },
  { id: "hiit", name: "HIIT", color: "#ff7a45", blurb: "Intervalos de alta intensidad. Cuarenta minutos que cuentan." },
  { id: "boxeo", name: "Boxeo fit", color: "#ffb4a8", blurb: "Golpeo, cardio y coordinación sin contacto." },
];

export const coaches: Coach[] = [
  { id: "c_mateo", name: "Coach Mateo" },
  { id: "c_juliana", name: "Coach Juliana" },
];

export const plans: Plan[] = [
  { id: "mensual", name: "Mensual ilimitado", kind: "unlimited", credits: 0, durationDays: 30, blurb: "Reserva todas las clases que quieras durante 30 días.", priceCop: 69_900 },
  { id: "bimestral", name: "Dos meses ilimitado", kind: "unlimited", credits: 0, durationDays: 60, blurb: "Dos meses de clases sin límite al mejor valor.", priceCop: 155_000 },
  { id: "pack12", name: "Paquete de 12 clases", kind: "pack", credits: 12, durationDays: 45, blurb: "12 créditos para usar en 45 días.", priceCop: 85_000 },
  { id: "pack8", name: "Paquete de 8 clases", kind: "pack", credits: 8, durationDays: 30, blurb: "8 créditos para usar en 30 días.", priceCop: 62_000 },
  { id: "dia", name: "Pase del día", kind: "pass", credits: 1, durationDays: 1, blurb: "Una clase, un día. Ideal para conocer la sede.", priceCop: 16_000 },
];

export const templates: ClassTemplate[] = [
  { id: "t_fue_lun", classTypeId: "fuerza", weekday: 1, time: "06:00", durationMin: 60, capacity: 14, coachId: "c_mateo" },
  { id: "t_fue_mie", classTypeId: "fuerza", weekday: 3, time: "18:30", durationMin: 60, capacity: 14, coachId: "c_mateo" },
  { id: "t_fue_sab", classTypeId: "fuerza", weekday: 6, time: "08:30", durationMin: 60, capacity: 14, coachId: "c_mateo" },
  { id: "t_hii_mar", classTypeId: "hiit", weekday: 2, time: "06:00", durationMin: 40, capacity: 18, coachId: "c_juliana" },
  { id: "t_hii_jue", classTypeId: "hiit", weekday: 4, time: "19:00", durationMin: 40, capacity: 18, coachId: "c_juliana" },
  { id: "t_hii_vie", classTypeId: "hiit", weekday: 5, time: "18:30", durationMin: 40, capacity: 18, coachId: "c_mateo" },
  { id: "t_box_lun", classTypeId: "boxeo", weekday: 1, time: "19:30", durationMin: 55, capacity: 16, coachId: "c_juliana" },
  { id: "t_box_mie", classTypeId: "boxeo", weekday: 3, time: "06:00", durationMin: 55, capacity: 16, coachId: "c_juliana" },
  { id: "t_box_sab", classTypeId: "boxeo", weekday: 6, time: "10:00", durationMin: 55, capacity: 16, coachId: "c_juliana" },
];

/** SAMPLE event. Confirm with the gym. */
export const events: EventDef[] = [
  {
    id: "reto-red",
    title: "Reto RED",
    blurb: "Seis rondas, cero excusas. Un reto por parejas para toda la comunidad.",
    date: "2026-11-14",
    time: "09:00",
    place: "Sede RED",
    priceCop: 20_000,
    capacity: 50,
    maxPerSignup: 2,
  },
];
