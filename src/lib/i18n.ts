import { classTypes, coaches, plans, tenant } from "@/config/tenant";

export type Lang = "es";
export const DEFAULT_LANG: Lang = "es";

/**
 * Site texts. The sites are Spanish only. Class and plan names are keyed by id,
 * so the config in tenant.ts stays the single source of what exists.
 * The member portal, staff panel, help center and server messages are still Spanish only.
 */
const BRAND = `${tenant.brand.name} ${tenant.brand.subtitle}`;
const copy = tenant.copy;
const demoCoach = coaches.find((c) => c.id === copy.demoCoachId) ?? coaches[0];
const pick = <T extends { id: string }>(list: T[], fields: (x: T) => { name: string; blurb: string }) =>
  Object.fromEntries(list.map((x) => [x.id, fields(x)])) as Record<string, { name: string; blurb: string }>;

const es = {
  nav: { schedule: "Horarios", join: "Únete", help: "Ayuda", enter: "Entrar", account: "Mi cuenta", team: "Panel del equipo", viewAs: "Ver como", logout: "Salir" },
  roles: { demo_member: "Miembro: Camila", demo_coach: `Coach: ${demoCoach.name.replace(/^Coach\s+/, "")}`, demo_reception: "Recepción", demo_admin: "Administrador", newMember: "Socio nuevo" },
  home: {
    title1: copy.hero.title1, title2: copy.hero.title2,
    sub: copy.hero.sub,
    seeSchedule: "Ver horarios", join: `Únete a ${BRAND}`,
    next: "Próximas clases", live: "En vivo", today: "Hoy", full: "Llena", spot: "cupo", spots: "cupos",
    ways: "Tres formas de entrenar", partner: "En alianza con",
    bookTitle: "Reservar es de un toque",
    bookText: "Tu plan, tus créditos y tus clases viven en un solo lugar. Si una clase se llena, entras a la lista de espera y te avisamos en cuanto se libere un cupo.",
    bullets: ["Reserva hasta 14 días antes.", "Cancela hasta 2 horas antes y recuperas el crédito.", "Lista de espera con promoción automática.", "Avisos en tu cuenta antes de cada clase y de vencer tu plan."],
    tryTitle: "Prueba el sistema tú mismo",
    tryText: "Entra como miembro, coach, recepción o administrador y recorre todo: reservas, lista de espera, asistencia y reportes.",
    tryBtn: "Elegir un perfil de prueba",
    heroAlt: copy.hero.artAlt,
  },
  classTypes: pick(classTypes, (c) => ({ name: c.name, blurb: c.blurb })),
  plans: pick(plans, (p) => ({ name: p.name, blurb: p.blurb })),
  card: {
    cancelled: "Cancelada", full: "Llena", fullWaiting: "Llena, {n} en espera", spots: "{n} cupos", spot: "1 cupo",
    loginToBook: "Entra para reservar", booked: "Reservada. Cancelar", waiting: "En espera, puesto {n}. Salir",
    reserve: "Reservar", joinWaitlist: "Entrar a la lista de espera",
    okCancel: "Reserva cancelada.", okLeft: "Saliste de la lista.", okBooked: "Listo, quedaste reservado.", okWaitlist: "Estás en la lista de espera, puesto {n}.",
  },
  schedule: {
    title: "Horarios", sub: "Cupos en vivo. Las reservas abren 14 días antes y se cancelan hasta 2 horas antes de la clase.",
    thisWeek: "Esta semana", prev: "Semana anterior", next: "Semana siguiente", holiday: "Festivo: {name}. Sin clases.", none: "Sin clases.", with: "con",
  },
  notFound: {
    title: "Esta página no existe", sub: "El enlace está roto o la página se movió. Elige a dónde quieres ir.",
    cards: { home: ["Inicio", "Conoce el gimnasio"], schedule: ["Horarios", "Mira las clases y los cupos en vivo"], join: ["Únete", "Crea tu cuenta y activa un plan"], enter: ["Entrar", "Reserva y revisa tu plan"] },
  },
  site: {
    metaTitle: copy.metaTitle,
    metaDesc: copy.metaDescription,
    openNow: "Abierto ahora", closedNow: "Cerrado ahora", until: "hasta las {t}", opensAt: "abre {d} a las {t}",
    today: "hoy", tomorrow: "mañana", days: ["el domingo", "el lunes", "el martes", "el miércoles", "el jueves", "el viernes", "el sábado"],
    whatsapp: "WhatsApp", call: "Llamar", reserve: "Reservar", waMsg: copy.whatsappMessage,
    visit: { title: "Visítanos", sub: copy.visitSub, map: "Abrir en Google Maps", mapTitle: `Mapa de ${BRAND}`, hours: "Horarios de atención", sample: copy.sampleNote },
    plans: {
      title: "Planes y primera visita", sub: "Elige cómo quieres entrenar. Los valores los ves al unirte.",
      trialTitle: "Tu primera visita", trialText: "Con el pase del día reservas una clase y conoces el gimnasio sin compromiso.", trialBtn: "Quiero conocerlo", all: "Ver todos los planes",
    },
    coaches: {
      title: "Tu equipo", sub: "Quién dirige cada clase.", sample: "Descripciones de ejemplo. El gimnasio entrega las reales.",
      bios: copy.coachBios as Record<string, string>,
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        ["¿Cómo reservo una clase?", "Crea tu cuenta, activa un plan y elige tu clase en el calendario. Puedes reservar hasta 14 días antes."],
        ["¿Puedo cancelar una reserva?", "Sí, hasta 2 horas antes de la clase. Recuperas el crédito."],
        ["¿Qué pasa si la clase está llena?", "Entras a la lista de espera. Si se libera un cupo, pasas automáticamente a la clase y te avisamos."],
        ["¿Cuántas clases puedo reservar al día?", "Hasta 2 clases por día."],
        ["¿Cómo pago?", "En línea con Bold, o en caja en el gimnasio."],
      ] as string[][],
    },
    demoLink: "Cómo funciona",
    foot: { nav: "Navegación", home: "Inicio", place: "Ubicación", area: copy.area, directions: "Cómo llegar", call: "Llamar", top: "Volver arriba", wa: "WhatsApp" },
  },
  footer: {
    hours: "Horarios", rights: "Todos los derechos reservados.", createdBy: "Sistema creado por", navLabel: "Pie de página",
    days: { "Lunes a jueves": "Lunes a jueves", Viernes: "Viernes", Sábado: "Sábado", Domingo: "Domingo" } as Record<string, string>,
    tagline: tenant.brand.tagline,
  },
  enter: {
    title: "Entrar al ejemplo", sub: "No hay contraseñas. Elige quién quieres ser y recorre el sistema con datos de ejemplo.",
    options: [
      { title: "Miembro", who: "Camila Demo", text: "Paquete de 12 clases. Reserva, cancela y prueba la lista de espera." },
      { title: "Coach", who: demoCoach.name, text: "Ve el listado de sus clases de hoy y registra asistencia." },
      { title: "Recepción", who: "Recepción Demo", text: "Busca socios, registra pagos en caja, ajusta créditos y hace check-in." },
      { title: "Administrador", who: "Admin Demo", text: "Todo lo anterior, más reportes, clases nuevas y exportar socios." },
    ],
  },
  join: {
    title: `Únete a ${BRAND}`, sub: "Tus datos, tu plan, el contrato firmado y el pago, todo en un solo paso. En la demo el pago es simulado y los precios son de ejemplo.",
    data: "Tus datos", name: "Nombre completo", email: "Correo", phone: "Teléfono", emName: "Contacto de emergencia", emPhone: "Teléfono de emergencia",
    plan: "Tu plan", sample: "precio de ejemplo", contract: "Contrato",
    contractText: `Texto de ejemplo. El contrato real de ${BRAND} se carga cuando el gimnasio lo entregue. Aquí el socio declara que está apto para hacer ejercicio, acepta el reglamento y las políticas de reserva y cancelación.`,
    accept: "Leí y acepto el contrato.", pay: "Pago", payText: "El pago se hace con Bold. En esta demo es simulado.", decline: "Simular un pago rechazado",
    submit: "Firmar y pagar", processing: "Procesando...",
    okTitle: `Bienvenido a ${BRAND}`, okText: "Tu plan ya está activo. Recibo {r}.", okBtn: "Reservar mi primera clase",
    badTitle: "El pago fue rechazado", badText: "Tu cuenta quedó creada, pero el plan no se activó. Intenta pagar de nuevo desde Mi cuenta.", badBtn: "Ir a Mi cuenta",
    sigHint: "Firma con el dedo o el mouse.", sigDone: "Firma lista.", sigClear: "Borrar firma", sigLabel: "Espacio para firmar",
  },
};

type Dict = typeof es;

export const DICT: Record<Lang, Dict> = { es };
export const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
