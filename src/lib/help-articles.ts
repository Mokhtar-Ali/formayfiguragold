export interface Article { id: string; audience: "Socios" | "Equipo"; title: string; body: string }

export const ARTICLES: Article[] = [
  { id: "reservar", audience: "Socios", title: "Cómo reservar una clase", body: "Entra a Horarios, elige la clase y toca Reservar. Las reservas abren 14 días antes. Con un paquete se descuenta un crédito; con el plan ilimitado no se descuenta nada." },
  { id: "cancelar", audience: "Socios", title: "Cómo cancelar y recuperar el crédito", body: "Cancela desde Mi cuenta o desde Horarios hasta 2 horas antes de la clase. El crédito vuelve a tu saldo al instante. Después de ese límite solo recepción puede cancelar." },
  { id: "espera", audience: "Socios", title: "Qué es la lista de espera", body: "Si la clase está llena puedes entrar a la lista. Cuando alguien cancela, el primero de la lista queda reservado solo y te llega un aviso. Si no tienes créditos en ese momento, te avisamos y pasa el siguiente." },
  { id: "limite", audience: "Socios", title: "Cuántas clases puedo reservar por día", body: "Hasta 2 clases por día. Esto deja cupo para todos." },
  { id: "renovar", audience: "Socios", title: "Cómo renovar mi plan", body: "En Mi cuenta elige un plan y paga con Bold. Si aún te quedan días, el plan nuevo empieza cuando termina el actual y no pierdes nada." },
  { id: "avisos", audience: "Socios", title: "Qué avisos recibo", body: "Confirmación de reserva, recordatorio antes de la clase, cupo liberado en la lista de espera, pago aprobado y plan por vencer. Los ves en la campana de arriba." },
  { id: "checkin", audience: "Equipo", title: "Registrar asistencia", body: "En Hoy, cada clase muestra su listado. Toca Registrar asistencia en cada socio. Los coaches solo ven sus propias clases. Quien reservó y no llegó queda como no asistió al terminar la clase." },
  { id: "pago-caja", audience: "Equipo", title: "Registrar un pago en caja", body: "En Socios, busca a la persona, elige el plan y el método (efectivo o transferencia) y toca Registrar. El plan se activa y se suman los créditos." },
  { id: "creditos", audience: "Equipo", title: "Ajustar créditos a mano", body: "En Socios puedes sumar o restar créditos con un motivo. Cada ajuste queda en el historial, nunca se edita el saldo directamente." },
  { id: "cancelar-clase", audience: "Equipo", title: "Cancelar una clase", body: "Solo el administrador. Al cancelar, se devuelven los créditos de todos los reservados y se les avisa. La lista de espera se cierra." },
  { id: "reportes", audience: "Equipo", title: "Leer los reportes", body: "Socios activos, nuevos del mes, ingresos, ocupación, asistencia por semana y socios en riesgo (sin asistir hace 14 días o con 1 crédito). Puedes descargar la lista de socios en CSV." },
  { id: "festivos", audience: "Equipo", title: "Festivos", body: "El sistema conoce los festivos de Colombia y no crea clases esos días. Si quieres abrir una clase en un festivo, créala a mano." },
];
