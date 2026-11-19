// Datos de las páginas de ministerios (/ministerios/[slug]).
//
// FOTOS: ponlas en /public/images/ministerios/ y escribe la ruta en el
// campo "image" (ej. "/images/ministerios/hombres.jpg"). Mientras esté
// vacío se muestra un recuadro de relleno. Lo mismo aplica a "heroImage"
// (la foto de fondo de la cabecera de cada ministerio).
//
// ÍCONOS: son SVG de relleno. Para usar los tuyos, reemplaza el contenido
// de la entrada correspondiente en "ministryIcons" (o agrega una nueva).

export const ministryIcons = {
  user: `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>`,
  userFemale: `<circle cx="12" cy="8.5" r="3.5"/><path d="M8.5 9C8 5.5 9.8 3 12 3s4 2.5 3.5 6"/><path d="M4.5 21c0-3.8 3.2-6.5 7.5-6.5s7.5 2.7 7.5 6.5"/>`,
  rings: `<circle cx="9" cy="15" r="5"/><circle cx="15" cy="15" r="5"/><path d="M12 2.5l2 2.5-2 2.5-2-2.5z"/>`,
  heart: `<path d="M12 20s-7-4.35-9.3-8.6C1.2 8.4 2.9 5.5 6 5c2-.3 3.6.9 6 3.3C14.4 5.9 16 4.7 18 5c3.1.5 4.8 3.4 3.3 6.4C19 15.65 12 20 12 20z"/>`,
  rocket: `<path d="M12 2c3 2.5 4.5 5.5 4.5 9.5L12 16l-4.5-4.5C7.5 7.5 9 4.5 12 2z"/><circle cx="12" cy="9" r="1.5"/><path d="M7.5 13.5l-3 3 3 .5M16.5 13.5l3 3-3 .5M10.5 19l1.5 3 1.5-3"/>`,
  route: `<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>`,
  anchor: `<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V21M7.5 11h9M4 14c0 4 3.5 7 8 7s8-3 8-7"/>`,
  flame: `<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5.5 1-8.5z"/>`,
  footprints: `<path d="M8 3c-2 0-3 2-3 4.5S6.5 12 8 12s3-2 3-4.5S10 3 8 3z"/><path d="M8 14.5V16"/><path d="M16 9c-2 0-3 2-3 4.5s1.5 4.5 3 4.5 3-2 3-4.5S18 9 16 9z"/><path d="M16 20.5V22"/>`,
} as const;

export type MinistryIconName = keyof typeof ministryIcons;

export interface SubMinistry {
  slug: string;
  name: string;
  icon: MinistryIconName;
  image: string;
  description: string;
  /** Palabra de la descripción que se resalta en negrita cursiva y con el color del ministerio. */
  highlight?: string;
  enfoque: string[];
  reuniones: string[];
  queHacemos: string[];
}

export interface Ministry {
  slug: string;
  title: string;
  subtitle: string;
  /** Color de acento de la página (eyebrow, nombre grande, pestañas activas). */
  color: string;
  heroImage: string;
  subMinistries: SubMinistry[];
}

const DEFAULT_DESCRIPTION =
  "Crecemos juntos en la fe, fortaleciendo nuestra relación con Dios y con los demás.";

// Crea un sub-ministerio con contenido provisional ("Por definir").
// Pásale "extra" para sobreescribir cualquier campo con el contenido real.
function sub(
  slug: string,
  name: string,
  icon: MinistryIconName,
  extra: Partial<SubMinistry> = {}
): SubMinistry {
  return {
    slug,
    name,
    icon,
    image: "",
    description: DEFAULT_DESCRIPTION,
    highlight: "fortaleciendo",
    enfoque: ["Por definir"],
    reuniones: ["Día y horario por definir"],
    queHacemos: ["Por definir"],
    ...extra,
  };
}

export const MINISTRIES: Ministry[] = [
  {
    slug: "nuevas-generaciones",
    title: "Nuevas Generaciones",
    subtitle:
      "Un espacio pensado para niños y jóvenes, donde crecen en la Palabra de Dios y en comunidad.",
    color: "var(--color-accent)",
    heroImage: "",
    subMinistries: [
      sub("nave-3", "Nave 3", "rocket"),
      sub("ruta-1", "Ruta 1", "route"),
      sub("muelle-7", "Muelle 7", "anchor"),
      sub("magma", "Magma", "flame"),
    ],
  },
  {
    slug: "discipulado",
    title: "Discipulado",
    subtitle: DEFAULT_DESCRIPTION,
    color: "#0E62DC",
    heroImage: "",
    subMinistries: [
      sub("hombres", "Hombres", "user", {
        enfoque: [
          "Estudio de la biblia",
          "Ambiente seguro",
          "Desarrollo de pensamiento centrado en la Palabra de Dios",
        ],
        reuniones: [
          "Martes 7:00 pm virtual (vía Zoom)",
          "Sesiones privadas",
          "Reuniones grupales",
        ],
        queHacemos: [
          "Estudio de la biblia",
          "Ambiente seguro",
          "Desarrollo de pensamiento centrado en la Palabra de Dios",
        ],
      }),
      sub("mujeres", "Mujeres", "userFemale"),
      sub("matrimonios", "Matrimonios", "rings"),
      sub("prematrimonial", "Prematrimonial", "heart"),
    ],
  },
  {
    slug: "otros",
    title: "Otros",
    subtitle:
      "Diversos ministerios de servicio, oración y alcance donde cada persona puede poner sus dones al servicio de los demás.",
    color: "var(--color-accent)",
    heroImage: "",
    subMinistries: [sub("huellas", "Huellas", "footprints")],
  },
];