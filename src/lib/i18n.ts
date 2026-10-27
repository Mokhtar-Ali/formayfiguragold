export type Lang = "es" | "en";
export const LANG_COOKIE = "bt_lang";
export const DEFAULT_LANG: Lang = "es";

/**
 * Public-site texts in both languages. Class and plan names are keyed by id,
 * so the config in tenant.ts stays the single source of what exists.
 * The member portal, staff panel, help center and server messages are still Spanish only.
 */
const es = {
  nav: { schedule: "Horarios", join: "Únete", help: "Ayuda", enter: "Entrar", account: "Mi cuenta", team: "Panel del equipo", viewAs: "Ver como", logout: "Salir", language: "Idioma" },
  roles: { demo_member: "Miembro: Camila", demo_coach: "Coach: Andrés", demo_reception: "Recepción", demo_admin: "Administrador", newMember: "Socio nuevo" },
  home: {
    title1: "Entrena donde hay", title2: "cupo para ti",
    sub: "Reserva tu clase, mira los cupos en tiempo real y entra a la lista de espera si se llena.",
    seeSchedule: "Ver horarios", join: "Únete a Bulltrain",
    next: "Próximas clases", live: "En vivo", today: "Hoy", full: "Llena", spot: "cupo", spots: "cupos",
    ways: "Tres formas de entrenar", partner: "En alianza con",
    bookTitle: "Reservar es de un toque",
    bookText: "Tu plan, tus créditos y tus clases viven en un solo lugar. Si una clase se llena, entras a la lista de espera y te avisamos en cuanto se libere un cupo.",
    bullets: ["Reserva hasta 14 días antes.", "Cancela hasta 2 horas antes y recuperas el crédito.", "Lista de espera con promoción automática.", "Avisos en tu cuenta antes de cada clase y de vencer tu plan."],
    tryTitle: "Prueba el sistema tú mismo",
    tryText: "Entra como miembro, coach, recepción o administrador y recorre todo: reservas, lista de espera, asistencia y reportes.",
    tryBtn: "Elegir un perfil de prueba",
    heroAlt: "Mascota de Bulltrain corriendo",
  },
  classTypes: {
    hibrido: { name: "Entrenamiento Híbrido", blurb: "Fuerza y cardio en una sola sesión, con cupos limitados." },
    bullrunning: { name: "BullRunning", blurb: "Salida de running en grupo, con técnica y ritmo." },
    cycling: { name: "Cycling", blurb: "Sala de cycling con música y luces." },
  } as Record<string, { name: string; blurb: string }>,
  plans: {
    mensual: { name: "Mensual ilimitado", blurb: "Reserva todas las clases que quieras durante 30 días." },
    pack12: { name: "Paquete de 12 clases", blurb: "12 créditos para usar en 45 días." },
    pack8: { name: "Paquete de 8 clases", blurb: "8 créditos para usar en 30 días." },
    dia: { name: "Pase del día", blurb: "Una clase, un día. Ideal para conocer el gimnasio." },
  } as Record<string, { name: string; blurb: string }>,
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
    metaTitle: "Bulltrain Entrenamiento | Gimnasio en Laureles, Medellín",
    metaDesc: "Gimnasio en Laureles, Medellín. Entrenamiento híbrido, BullRunning y cycling con cupos limitados. Reserva tu clase en línea y entra a la lista de espera si se llena.",
    openNow: "Abierto ahora", closedNow: "Cerrado ahora", until: "hasta las {t}", opensAt: "abre {d} a las {t}",
    today: "hoy", tomorrow: "mañana", days: ["el domingo", "el lunes", "el martes", "el miércoles", "el jueves", "el viernes", "el sábado"],
    whatsapp: "WhatsApp", call: "Llamar", reserve: "Reservar", waMsg: "Hola, quiero información sobre Bulltrain.",
    visit: { title: "Visítanos", sub: "Estamos en Laureles, cerca del Estadio. Pasa a conocer el gimnasio.", map: "Abrir en Google Maps", mapTitle: "Mapa de Bulltrain", hours: "Horarios de atención" },
    plans: {
      title: "Planes y primera visita", sub: "Elige cómo quieres entrenar. Los valores los ves al unirte.",
      trialTitle: "Tu primera visita", trialText: "Con el pase del día reservas una clase y conoces el gimnasio sin compromiso.", trialBtn: "Quiero conocerlo", all: "Ver todos los planes",
    },
    coaches: {
      title: "Tu equipo", sub: "Quién dirige cada clase.", sample: "Descripciones de ejemplo. El gimnasio entrega las reales.",
      bios: { c_andres: "Dirige el Entrenamiento Híbrido los lunes y sábados.", c_laura: "Dirige el Entrenamiento Híbrido de los miércoles y el BullRunning de los martes.", c_ciclo: "Instructor de Goodcycle. Dirige las clases de Cycling." } as Record<string, string>,
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
    demoLink: "Probar el demo",
    foot: { nav: "Navegación", home: "Inicio", place: "Ubicación", area: "Laureles · Medellín", directions: "Cómo llegar", call: "Llamar", top: "Volver arriba", wa: "WhatsApp" },
  },
  footer: {
    hours: "Horarios", rights: "Todos los derechos reservados.", createdBy: "Sistema creado por", navLabel: "Pie de página",
    days: { "Lunes a jueves": "Lunes a jueves", Viernes: "Viernes", Sábado: "Sábado", Domingo: "Domingo" } as Record<string, string>,
    tagline: "El Gimnasio de Laureles",
  },
  enter: {
    title: "Entrar a la demo", sub: "No hay contraseñas. Elige quién quieres ser y recorre el sistema con datos de ejemplo.",
    options: [
      { title: "Miembro", who: "Camila Demo", text: "Paquete de 12 clases. Reserva, cancela y prueba la lista de espera." },
      { title: "Coach", who: "Coach Andrés", text: "Ve el listado de sus clases de hoy y registra asistencia." },
      { title: "Recepción", who: "Recepción Demo", text: "Busca socios, registra pagos en caja, ajusta créditos y hace check-in." },
      { title: "Administrador", who: "Admin Demo", text: "Todo lo anterior, más reportes, clases nuevas y exportar socios." },
    ],
  },
  join: {
    title: "Únete a Bulltrain", sub: "Tus datos, tu plan, el contrato firmado y el pago, todo en un solo paso. En la demo el pago es simulado y los precios son de ejemplo.",
    data: "Tus datos", name: "Nombre completo", email: "Correo", phone: "Teléfono", emName: "Contacto de emergencia", emPhone: "Teléfono de emergencia",
    plan: "Tu plan", sample: "precio de ejemplo", contract: "Contrato",
    contractText: "Texto de ejemplo. El contrato real de Bulltrain se carga cuando el gimnasio lo entregue. Aquí el socio declara que está apto para hacer ejercicio, acepta el reglamento y las políticas de reserva y cancelación.",
    accept: "Leí y acepto el contrato.", pay: "Pago", payText: "El pago se hace con Bold. En esta demo es simulado.", decline: "Simular un pago rechazado",
    submit: "Firmar y pagar", processing: "Procesando...",
    okTitle: "Bienvenido a Bulltrain", okText: "Tu plan ya está activo. Recibo {r}.", okBtn: "Reservar mi primera clase",
    badTitle: "El pago fue rechazado", badText: "Tu cuenta quedó creada, pero el plan no se activó. Intenta pagar de nuevo desde Mi cuenta.", badBtn: "Ir a Mi cuenta",
    sigHint: "Firma con el dedo o el mouse.", sigDone: "Firma lista.", sigClear: "Borrar firma", sigLabel: "Espacio para firmar",
  },
};

type Dict = typeof es;

const en: Dict = {
  nav: { schedule: "Schedule", join: "Join", help: "Help", enter: "Sign in", account: "My account", team: "Team panel", viewAs: "View as", logout: "Sign out", language: "Language" },
  roles: { demo_member: "Member: Camila", demo_coach: "Coach: Andrés", demo_reception: "Front desk", demo_admin: "Administrator", newMember: "New member" },
  home: {
    title1: "Train where there's", title2: "room for you",
    sub: "Book your class, see open spots in real time and join the waitlist when it fills up.",
    seeSchedule: "See schedule", join: "Join Bulltrain",
    next: "Next classes", live: "Live", today: "Today", full: "Full", spot: "spot", spots: "spots",
    ways: "Three ways to train", partner: "In partnership with",
    bookTitle: "Booking takes one tap",
    bookText: "Your plan, your credits and your classes live in one place. If a class fills up, you join the waitlist and we tell you as soon as a spot opens.",
    bullets: ["Book up to 14 days ahead.", "Cancel up to 2 hours before and get your credit back.", "Waitlist with automatic promotion.", "Notices in your account before each class and before your plan ends."],
    tryTitle: "Try the system yourself",
    tryText: "Sign in as a member, coach, front desk or administrator and explore everything: bookings, waitlist, attendance and reports.",
    tryBtn: "Pick a test profile",
    heroAlt: "Bulltrain mascot running",
  },
  classTypes: {
    hibrido: { name: "Hybrid Training", blurb: "Strength and cardio in a single session, with limited spots." },
    bullrunning: { name: "BullRunning", blurb: "Group run with technique work and pacing." },
    cycling: { name: "Cycling", blurb: "Cycling studio with music and lights." },
  },
  plans: {
    mensual: { name: "Unlimited monthly", blurb: "Book as many classes as you want for 30 days." },
    pack12: { name: "12-class pack", blurb: "12 credits to use within 45 days." },
    pack8: { name: "8-class pack", blurb: "8 credits to use within 30 days." },
    dia: { name: "Day pass", blurb: "One class, one day. Ideal for trying the gym." },
  },
  card: {
    cancelled: "Cancelled", full: "Full", fullWaiting: "Full, {n} waiting", spots: "{n} spots", spot: "1 spot",
    loginToBook: "Sign in to book", booked: "Booked. Cancel", waiting: "Waiting, #{n}. Leave",
    reserve: "Book", joinWaitlist: "Join the waitlist",
    okCancel: "Booking cancelled.", okLeft: "You left the waitlist.", okBooked: "Done, you're booked.", okWaitlist: "You're on the waitlist, #{n}.",
  },
  schedule: {
    title: "Schedule", sub: "Live spots. Bookings open 14 days ahead and can be cancelled up to 2 hours before class.",
    thisWeek: "This week", prev: "Previous week", next: "Next week", holiday: "Holiday: {name}. No classes.", none: "No classes.", with: "with",
  },
  notFound: {
    title: "This page doesn't exist", sub: "The link is broken or the page moved. Pick where you want to go.",
    cards: { home: ["Home", "Get to know the gym"], schedule: ["Schedule", "See classes and live spots"], join: ["Join", "Create your account and pick a plan"], enter: ["Sign in", "Book classes and check your plan"] },
  },
  site: {
    metaTitle: "Bulltrain Entrenamiento | Gym in Laureles, Medellín",
    metaDesc: "Gym in Laureles, Medellín. Hybrid training, BullRunning and cycling with limited spots. Book your class online and join the waitlist when it fills up.",
    openNow: "Open now", closedNow: "Closed now", until: "until {t}", opensAt: "opens {d} at {t}",
    today: "today", tomorrow: "tomorrow", days: ["on Sunday", "on Monday", "on Tuesday", "on Wednesday", "on Thursday", "on Friday", "on Saturday"],
    whatsapp: "WhatsApp", call: "Call", reserve: "Book", waMsg: "Hi, I'd like information about Bulltrain.",
    visit: { title: "Visit us", sub: "We're in Laureles, near the Estadio. Come see the gym.", map: "Open in Google Maps", mapTitle: "Bulltrain map", hours: "Opening hours" },
    plans: {
      title: "Plans and your first visit", sub: "Pick how you want to train. You see the prices when you join.",
      trialTitle: "Your first visit", trialText: "With the day pass you book one class and see the gym with no commitment.", trialBtn: "I want to see it", all: "See all plans",
    },
    coaches: {
      title: "Your team", sub: "Who leads each class.", sample: "Sample descriptions. The gym provides the real ones.",
      bios: { c_andres: "Leads Hybrid Training on Mondays and Saturdays.", c_laura: "Leads Hybrid Training on Wednesdays and BullRunning on Tuesdays.", c_ciclo: "Goodcycle instructor. Leads the Cycling classes." } as Record<string, string>,
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        ["How do I book a class?", "Create your account, activate a plan and pick your class on the calendar. You can book up to 14 days ahead."],
        ["Can I cancel a booking?", "Yes, up to 2 hours before class. You get the credit back."],
        ["What if the class is full?", "You join the waitlist. If a spot opens, you move into the class automatically and we let you know."],
        ["How many classes can I book per day?", "Up to 2 classes per day."],
        ["How do I pay?", "Online with Bold, or at the front desk in the gym."],
      ] as string[][],
    },
    demoLink: "Try the demo",
    foot: { nav: "Navigation", home: "Home", place: "Location", area: "Laureles · Medellín", directions: "Get directions", call: "Call", top: "Back to top", wa: "WhatsApp" },
  },
  footer: {
    hours: "Hours", rights: "All rights reserved.", createdBy: "System created by", navLabel: "Footer",
    days: { "Lunes a jueves": "Monday to Thursday", Viernes: "Friday", Sábado: "Saturday", Domingo: "Sunday" },
    tagline: "Laureles' gym",
  },
  enter: {
    title: "Enter the demo", sub: "No passwords. Pick who you want to be and explore the system with sample data.",
    options: [
      { title: "Member", who: "Camila Demo", text: "12-class pack. Book, cancel and try the waitlist." },
      { title: "Coach", who: "Coach Andrés", text: "See today's classes and register attendance." },
      { title: "Front desk", who: "Front Desk Demo", text: "Find members, register counter payments, adjust credits and check people in." },
      { title: "Administrator", who: "Admin Demo", text: "Everything above, plus reports, new classes and member export." },
    ],
  },
  join: {
    title: "Join Bulltrain", sub: "Your details, your plan, the signed contract and payment, all in one step. In the demo the payment is simulated and prices are samples.",
    data: "Your details", name: "Full name", email: "Email", phone: "Phone", emName: "Emergency contact", emPhone: "Emergency phone",
    plan: "Your plan", sample: "sample price", contract: "Contract",
    contractText: "Sample text. Bulltrain's real contract is loaded once the gym provides it. Here the member declares being fit to exercise and accepts the rules and the booking and cancellation policies.",
    accept: "I read and accept the contract.", pay: "Payment", payText: "Payment is made with Bold. In this demo it is simulated.", decline: "Simulate a declined payment",
    submit: "Sign and pay", processing: "Processing...",
    okTitle: "Welcome to Bulltrain", okText: "Your plan is active. Receipt {r}.", okBtn: "Book my first class",
    badTitle: "The payment was declined", badText: "Your account was created but the plan was not activated. Try paying again from My account.", badBtn: "Go to My account",
    sigHint: "Sign with your finger or mouse.", sigDone: "Signature ready.", sigClear: "Clear signature", sigLabel: "Signature area",
  },
};

export const DICT: Record<Lang, Dict> = { es, en };
export const isLang = (v: unknown): v is Lang => v === "es" || v === "en";
export const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
