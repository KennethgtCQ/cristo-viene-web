import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

function getFirebaseApp() {
  if (!hasFirebaseConfig) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export interface ChurchEvent {
  id: string;
  title: string;
  date: Date;
}

const MONTHS = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

const WEEKDAYS = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO",
];

// Datos de respaldo, se muestran si Firebase no está configurado
// o si la colección "events" está vacía / falla la conexión.
const FALLBACK_EVENTS: ChurchEvent[] = [
  {
    id: "fallback-1",
    title: "Celebración Anexión Nicoya - Magma",
    date: new Date(new Date().getFullYear(), 6, 25),
  },
  {
    id: "fallback-2",
    title: "Celebración Día de las Madres",
    date: new Date(new Date().getFullYear(), 7, 15),
  },
  {
    id: "fallback-3",
    title: "Reunión General - Inicio Nueva Serie",
    date: new Date(new Date().getFullYear(), 7, 30),
  },
];

/**
 * Trae los próximos eventos desde la colección "events" de Firestore.
 * Se espera que cada documento tenga:
 *   - title: string
 *   - date: Timestamp | string (fecha del evento)
 * Si Firebase no está configurado, o la consulta falla, retorna eventos de respaldo.
 */
export async function getUpcomingEvents(
  max = 3
): Promise<{ events: ChurchEvent[]; isFallback: boolean }> {
  const app = getFirebaseApp();

  if (!app) {
    return { events: FALLBACK_EVENTS.slice(0, max), isFallback: true };
  }

  try {
    const db = getFirestore(app);
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, orderBy("date", "asc"), limit(max));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { events: FALLBACK_EVENTS.slice(0, max), isFallback: true };
    }

    const events: ChurchEvent[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const rawDate = data.date;
      const date =
        rawDate instanceof Timestamp ? rawDate.toDate() : new Date(rawDate);

      return {
        id: doc.id,
        title: data.title ?? "Evento sin título",
        date,
      };
    });

    return { events, isFallback: false };
  } catch (error) {
    console.error("Error al obtener eventos desde Firebase:", error);
    return { events: FALLBACK_EVENTS.slice(0, max), isFallback: true };
  }
}

export function formatEventParts(event: ChurchEvent) {
  return {
    day: String(event.date.getDate()).padStart(2, "0"),
    month: MONTHS[event.date.getMonth()],
    weekday: WEEKDAYS[event.date.getDay()],
    title: event.title,
  };
}

export interface ContactMessage {
  name: string;
  phone?: string;
  email: string;
  message: string;
}

/** Guarda un mensaje del formulario de contacto en la colección "contactMessages". */
export async function sendContactMessage(data: ContactMessage): Promise<void> {
  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase no está configurado.");

  const { phone, ...rest } = data;
  const db = getFirestore(app);

  await addDoc(collection(db, "contactMessages"), {
    ...rest,
    // Firestore no acepta "undefined", por eso el teléfono solo se guarda si existe.
    ...(phone ? { phone } : {}),
    createdAt: serverTimestamp(),
  });
}
