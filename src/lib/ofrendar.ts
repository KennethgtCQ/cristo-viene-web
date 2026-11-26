// Contenido de la página /ofrendar.
//
// FOTOS: guárdalas en /public/images/ofrendar/ y escribe la ruta, por ejemplo
// "/images/ofrendar/hero.jpg". Mientras estén vacías se muestra un recuadro.

export const PAYPAL_URL =
  "https://www.paypal.com/donate?token=Kf2rR2Ks9pMEnaCuYBlj9J98yXfno8v3-WI9n8SnlHNk0904_ybVLL7b8oBRpyk7QGuPDnfPhFJwMzTy&locale.x=es_ES";

export const VERSE = {
  text: "Pero, ¿quién soy yo, y quién es mi pueblo, para que podamos darte estas ofrendas voluntarias? En verdad, tú eres el dueño de todo, y lo que te hemos dado, de ti lo hemos recibido.",
  reference: "1 Crónicas 29:14",
};

export const IMAGES = {
  /** Foto de fondo de la cabecera (recomendado: horizontal, mínimo 1600px de ancho). */
  hero: "",
  /** Foto de la banda "Nuestra invitación" (horizontal o cuadrada). */
  intro: "",
};

export interface BankAccount {
  currency: string;
  account: string;
  client: string;
  iban: string;
}

export const BANK = {
  name: "Banco Nacional de Costa Rica",
  holder: "Asociación Cristiana Cristo viene de Cartago",
  concept: "OFRENDA",
  accounts: [
    {
      currency: "Colones",
      account: "100-01-181-000570-9",
      client: "15118110010005707",
      iban: "CR17015118110010005707",
    },
    {
      currency: "Dólares",
      account: "200-02-097-001865-0",
      client: "15109720020018651",
      iban: "CR31015109720020018651",
    },
  ] satisfies BankAccount[],
};

export interface Initiative {
  name: string;
  /** TODO: reemplaza "Por definir." con la descripción real. */
  description: string;
  image: string;
  /** Opcional: si lo llenas, la tarjeta muestra un enlace "Conocer más". */
  href?: string;
}

export const INITIATIVES: Initiative[] = [
  { name: "Casa Nueva", description: "Por definir.", image: "" },
  { name: "Buen Samaritano", description: "Por definir.", image: "" },
  { name: "El Guardarropa", description: "Por definir.", image: "" },
];