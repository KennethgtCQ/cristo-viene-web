// Contenido de la página /esencia (equipo).
//
// FOTOS: guarda cada imagen en /public/images/equipo/ y escribe la ruta en
// "image", por ejemplo: "/images/equipo/esteban-obando.jpg".
// Mientras esté vacío se muestra un recuadro con una silueta.
// Recomendado: retratos verticales (4:5) para los pastores y cuadrados (1:1)
// para los coordinadores.

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Coordinator {
  /** Nombre del ministerio (aparece en acento). */
  ministry: string;
  /** A quién sirve: edad o tipo de grupo. */
  audience: string;
  /** Página del ministerio a la que enlaza (opcional). */
  href?: string;
  /** Una o más personas (cada una con su foto). */
  people: { name: string; image: string }[];
}

export const PASTORAL_INTRO =
  "Es un grupo de líderes calificados para proveer supervisión espiritual, dirección y liderazgo para la iglesia. Miramos hacia el futuro con confianza, gracias al liderazgo de servicio que este equipo de experimentados seguidores de Cristo provee.";

// El primero se muestra como tarjeta destacada (pastor general).
export const PASTORAL: TeamMember[] = [
  {
    name: "Esteban Obando",
    role: "Pastor general",
    bio: "Como pastor general de Cristo Viene, Esteban brinda enseñanza, liderazgo y orientación para la iglesia en general, desde el año 2005. Estudió en el Seminario Teológico Centroamericano de Guatemala, tiene una maestría en liderazgo pastoral. Escritor de varios libros, en temas de consejería y liderazgo, y es el director de e625 en Costa Rica. Él y su esposa Fanny tienen dos hijos, Daniela y Diego.",
    image: "",
  },
  {
    name: "Hernán Rivera",
    role: "Anciano",
    bio: "Hernán ha sido parte de nuestra iglesia desde hace más de 50 años. En su juventud, Hernán sirvió en el Ministerio Musical, y ahora, además de sus labores de Anciano, participa activamente de este ministerio en el área de sonido. Hernán y su esposa Damaris viven en Cartago.",
    image: "",
  },
  {
    name: "Eduardo Gutiérrez",
    role: "Anciano",
    bio: "Eduardo tiene una pasión por el discipulado. Sirvió como Coordinador del ministerio Vínculo de matrimonios por 3 años. Eduardo enseña frecuentemente en las reuniones generales y en los distintos ministerios. Su esposa Catherine le apoya en su servicio, junto a sus hijos Matías y Verónica.",
    image: "",
  },
  {
    name: "Luis Peraza",
    role: "Anciano",
    bio: "Luis es administrador de profesión y músico por pasión. Sirve como anciano y es el coordinador del ministerio Paso4, encargado de los grupos de discipulado de la iglesia. Él y su esposa Fanny tienen dos hijas, Celeste y Belén.",
    image: "",
  },
];

export const ADMINISTRACION: TeamMember = {
  name: "Eraida Benavides Calvo",
  role: "Administradora",
  bio: "Es miembro de la iglesia desde hace más de 25 años y ha trabajado en diferentes ministerios de la iglesia. De profesión es Trabajadora Social y Gestora de proyectos, atiende la parte Administrativa y gestiona junto con los Coordinadores de Ministerio lo relativo al funcionamiento de la Iglesia.",
  image: "",
};

// Los "href" apuntan a las páginas de ministerios (con la pestaña correspondiente).
export const COORDINADORES: Coordinator[] = [
  {
    ministry: "Nave3",
    audience: "Niños de 0 a 9 años",
    href: "/ministerios/nuevas-generaciones#nave-3",
    people: [{ name: "Karen Vindas", image: "" }],
  },
  {
    ministry: "Ruta1",
    audience: "Pre-adolescentes de 10 a 12 años",
    href: "/ministerios/nuevas-generaciones#ruta-1",
    people: [{ name: "Ariel Garro", image: "" }],
  },
  {
    ministry: "Muelle7",
    audience: "Adolescentes de 13 a 17 años",
    href: "/ministerios/nuevas-generaciones#muelle-7",
    people: [{ name: "Adrián Rojas", image: "" }],
  },
  {
    ministry: "Magma",
    audience: "Jóvenes de 18 a 25 años",
    href: "/ministerios/nuevas-generaciones#magma",
    people: [{ name: "Allan Chacón", image: "" }],
  },
  {
    ministry: "Huellas de Oro",
    audience: "Adultos mayores",
    href: "/ministerios/otros#huellas",
    people: [{ name: "Keren Mora", image: "" }],
  },
  {
    ministry: "Paso4",
    audience: "Grupos de discipulado temáticos",
    href: "/ministerios/discipulado",
    people: [{ name: "Oscar Umaña", image: "" }],
  },
  {
    ministry: "Paso4",
    audience: "Grupos de discipulado pequeños",
    href: "/ministerios/discipulado",
    people: [
      { name: "Eduardo Gutiérrez", image: "" },
      { name: "Katherine Aragón", image: "" },
    ],
  },
  {
    ministry: "Paso4",
    audience: "Grupos de discipulado prematrimonial",
    href: "/ministerios/discipulado#prematrimonial",
    people: [{ name: "Joseph Montano", image: "" }],
  },
];