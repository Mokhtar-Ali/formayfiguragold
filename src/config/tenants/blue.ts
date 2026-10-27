import type { ClassTemplate, ClassType, Coach, Plan } from "@/lib/types";
import type { TenantConfig } from "./types";

/**
 * Forma y Figura Sede BLUE.
 *
 * Only the name, the Instagram handle (@formayfigurablue) and the logo colors come from
 * the gym's public profile. EVERYTHING ELSE here is SAMPLE and must be confirmed
 * with the gym before this site is shown as theirs: address, phone, WhatsApp,
 * hours, classes, schedule, coach names and prices. Nothing is copied from Gold.
 */
export const tenant = {
  id: "blue",
  timezone: "America/Bogota",
  brand: {
    name: "Forma y Figura",
    subtitle: "BLUE",
    tagline: "Muévete con calma, entrena con intención",
  },
  contact: {
    address: "Dirección por confirmar",
    phone: "300 000 0000",
    phoneHref: "tel:+573000000000",
    whatsappHref: "https://wa.me/573000000000",
    mapsQuery: "Antioquia, Colombia",
    instagram: "@formayfigurablue",
    instagramUrl: "https://www.instagram.com/formayfigurablue/",
  },
  hours: [
    { days: "Lunes a viernes", time: "6:00 AM - 8:00 PM" },
    { days: "Sábado", time: "8:00 AM - 12:00 PM" },
    { days: "Domingo", time: "Cerrado" },
  ],
  openingHours: {
    0: null,
    1: ["06:00", "20:00"],
    2: ["06:00", "20:00"],
    3: ["06:00", "20:00"],
    4: ["06:00", "20:00"],
    5: ["06:00", "20:00"],
    6: ["08:00", "12:00"],
  } as Record<number, [string, string] | null>,
  booking: { maxBookingsPerDay: 2, cancelWindowHours: 2, opensDaysAhead: 14, waitlistMax: 10, scheduleWeeksAhead: 8 },
  goals: { monthlyNewMembers: 30, monthlyRevenueCop: 12_000_000 },
  theme: {
    ink: "#070a14", surface: "#0e1324", surface2: "#151c36", line: "#242e52", paper: "#eef1fb", muted: "#98a2c4",
    accent: "#6b95ff", accentInk: "#050816", accent2: "#9b6dff",
    fontDisplay: '"Outfit", "Helvetica Neue", Arial, sans-serif', fontSans: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    headingCase: "none", headingWeight: 600, headingTracking: "-0.01em",
  },
  copy: {
    hero: {
      title1: "Tu cuerpo, tu ritmo,",
      title2: "tu mejor versión",
      sub: "Pilates, yoga y barre en grupos pequeños. Reserva tu cupo en línea y llega con la mente en calma.",
      art: "blue",
      artAlt: "Ilustración de pétalos azules y violeta en forma de mandala",
    },
    metaTitle: "Forma y Figura BLUE | Pilates, yoga y barre",
    metaDescription: "Sede BLUE de Forma y Figura. Pilates, yoga y barre en grupos pequeños. Reserva tu clase en línea y entra a la lista de espera si se llena.",
    area: "Sede BLUE",
    visitSub: "Pasa a conocer la sede y las clases.",
    sampleNote: "Datos de ejemplo. El gimnasio confirma dirección, horarios, clases y precios.",
    coachBios: {
      c_valeria: "Dirige el Pilates mat de la semana.",
      c_sara: "Dirige el Yoga flow y el Barre.",
    },
    demoCoachId: "c_valeria",
    whatsappMessage: "Hola, quiero información sobre Forma y Figura BLUE.",
  },
} as const satisfies TenantConfig;

export const classTypes: ClassType[] = [
  { id: "pilates", name: "Pilates mat", color: "#6b95ff", blurb: "Control, postura y fuerza de centro en grupos pequeños." },
  { id: "yoga", name: "Yoga flow", color: "#9b6dff", blurb: "Movimiento y respiración para soltar el día." },
  { id: "barre", name: "Barre", color: "#8fd0ff", blurb: "Tonificación de bajo impacto con música." },
];

export const coaches: Coach[] = [
  { id: "c_valeria", name: "Coach Valeria" },
  { id: "c_sara", name: "Coach Sara" },
];

export const plans: Plan[] = [
  { id: "mensual", name: "Mensual ilimitado", kind: "unlimited", credits: 0, durationDays: 30, blurb: "Reserva todas las clases que quieras durante 30 días.", priceCop: 69_900 },
  { id: "bimestral", name: "Dos meses ilimitado", kind: "unlimited", credits: 0, durationDays: 60, blurb: "Dos meses de clases sin límite al mejor valor.", priceCop: 159_900 },
  { id: "pack12", name: "Paquete de 12 clases", kind: "pack", credits: 12, durationDays: 45, blurb: "12 créditos para usar en 45 días.", priceCop: 89_000 },
  { id: "pack8", name: "Paquete de 8 clases", kind: "pack", credits: 8, durationDays: 30, blurb: "8 créditos para usar en 30 días.", priceCop: 66_000 },
  { id: "dia", name: "Pase del día", kind: "pass", credits: 1, durationDays: 1, blurb: "Una clase, un día. Ideal para conocer la sede.", priceCop: 18_000 },
];

export const templates: ClassTemplate[] = [
  { id: "t_pil_lun", classTypeId: "pilates", weekday: 1, time: "07:00", durationMin: 55, capacity: 12, coachId: "c_valeria" },
  { id: "t_pil_mie", classTypeId: "pilates", weekday: 3, time: "07:00", durationMin: 55, capacity: 12, coachId: "c_valeria" },
  { id: "t_pil_vie", classTypeId: "pilates", weekday: 5, time: "18:00", durationMin: 55, capacity: 12, coachId: "c_valeria" },
  { id: "t_yog_mar", classTypeId: "yoga", weekday: 2, time: "18:30", durationMin: 60, capacity: 16, coachId: "c_sara" },
  { id: "t_yog_jue", classTypeId: "yoga", weekday: 4, time: "18:30", durationMin: 60, capacity: 16, coachId: "c_sara" },
  { id: "t_yog_sab", classTypeId: "yoga", weekday: 6, time: "09:00", durationMin: 60, capacity: 16, coachId: "c_sara" },
  { id: "t_bar_lun", classTypeId: "barre", weekday: 1, time: "18:30", durationMin: 50, capacity: 14, coachId: "c_sara" },
  { id: "t_bar_mie", classTypeId: "barre", weekday: 3, time: "18:30", durationMin: 50, capacity: 14, coachId: "c_valeria" },
  { id: "t_bar_sab", classTypeId: "barre", weekday: 6, time: "10:15", durationMin: 50, capacity: 14, coachId: "c_valeria" },
];
