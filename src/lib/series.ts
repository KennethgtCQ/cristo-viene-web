// Series de mensajes, basadas en playlists de SoundCloud.
//
// LECCIÓN APRENDIDA (por eso este archivo cambió de enfoque): la página
// "https://soundcloud.com/cristovienecr/sets" solo trae en su HTML inicial
// el playlist MÁS RECIENTE (probablemente porque SoundCloud solo pre-renderiza
// ese dato para el preview de redes sociales/SEO). El resto de la lista se
// carga con JavaScript cuando el usuario hace scroll — algo que un fetch()
// de servidor nunca ejecuta. Por eso la auto-detección completa desde la
// cuenta no es confiable.
//
// Enfoque actual (2 partes):
//   1) SERIES_SOURCES: lista manual con la URL de cada playlist — es lo
//      único que tienes que tocar para agregar una serie nueva (pegar la
//      URL, 10 segundos).
//   2) Todo lo demás se automatiza: título, portada (oEmbed, endpoint
//      público sin API key) y cantidad de tracks/año/lista de tracks
//      (scrapeando la página individual de cada playlist, que SÍ trae todo
//      su contenido en el HTML inicial).
//
// Bonus: además, se intenta auto-descubrir playlists desde la página de la
// cuenta; si algún día SoundCloud trae más de uno ahí, se agregan solos
// (sin duplicar los que ya están en SERIES_SOURCES).

export const ACCOUNT_SETS_URL = "https://soundcloud.com/cristovienecr/sets";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

export interface Track {
  title: string;
  permalinkUrl: string;
  artwork?: string;
  createdAt?: string;
}

export interface ResolvedSeries {
  slug: string;
  title: string;
  soundcloudUrl: string;
  thumbnail?: string;
  trackCount?: number;
  year?: number;
}

// ---------------------------------------------------------------------------
// EDITA AQUÍ para agregar una serie nueva: solo necesitas la URL del
// playlist ("set") de SoundCloud. Título, portada, cantidad de tracks y
// año se completan solos en el siguiente build.
// ---------------------------------------------------------------------------
export const SERIES_SOURCES: string[] = [
  "https://soundcloud.com/cristovienecr/sets/la-bendicion-misionera",
  "https://soundcloud.com/cristovienecr/sets/emociones-sujetas-a-dios",
  "https://soundcloud.com/cristovienecr/sets/vinculos-de-matrimonios-2026",
  "https://soundcloud.com/cristovienecr/sets/conociendo-mi-biblia-hechos",
  "https://soundcloud.com/cristovienecr/sets/semana-santa-2026",
  "https://soundcloud.com/cristovienecr/sets/masculidad-biblica",
  "https://soundcloud.com/cristovienecr/sets/pecados-respetables",
  "https://soundcloud.com/cristovienecr/sets/como-ser-un-buen-fariseo",
  "https://soundcloud.com/cristovienecr/sets/el-poder-de-mi-boca",
  "https://soundcloud.com/cristovienecr/sets/permaneced",
  "https://soundcloud.com/cristovienecr/sets/la-verdadera-fortaleza"
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

function extractHydration(html: string): Array<{ hydratable?: string; data?: any }> | null {
  const match = html.match(/window\.__sc_hydration\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch (err) {
    console.error("[series.ts] __sc_hydration encontrado pero no se pudo parsear:", err);
    return null;
  }
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: BROWSER_HEADERS });
  if (!res.ok) throw new Error(`${url} respondió HTTP ${res.status}`);
  return res.text();
}

// --- Bonus: intenta encontrar playlists extra desde la página de cuenta --
async function tryDiscoverExtraPlaylistUrls(): Promise<string[]> {
  try {
    const html = await fetchHtml(ACCOUNT_SETS_URL);
    const hydration = extractHydration(html);
    if (!hydration) return [];

    const urls = hydration
      .filter((e) => e.hydratable === "playlist" && e.data?.permalink_url)
      .map((e) => e.data.permalink_url as string);

    console.log(`[series.ts] Auto-descubrimiento bonus encontró ${urls.length} playlist(s) en la página de cuenta.`);
    return urls;
  } catch (err) {
    console.error("[series.ts] Auto-descubrimiento bonus falló (no afecta la lista manual):", err);
    return [];
  }
}

// --- oEmbed: título + portada, confiable, sin API key --------------------
async function fetchOEmbed(url: string): Promise<{ title: string; thumbnail_url?: string } | null> {
  try {
    const endpoint = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`oEmbed respondió HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[series.ts] oEmbed falló para ${url}:`, err);
    return null;
  }
}

// --- Detalle del playlist individual: track_count, año, tracks -----------
async function scrapePlaylistDetail(
  url: string
): Promise<{ trackCount?: number; year?: number; tracks?: Track[] } | null> {
  try {
    const html = await fetchHtml(url);
    const hydration = extractHydration(html);
    if (!hydration) throw new Error("__sc_hydration no encontrado en la página del playlist.");

    const playlistEntry = hydration.find((e) => e.hydratable === "playlist")?.data;
    if (!playlistEntry) throw new Error("No se encontró el objeto 'playlist' en la hidratación.");

    const rawTracks = (playlistEntry.tracks ?? []) as any[];
    const tracks: Track[] = rawTracks
      .filter((t) => t.title && t.permalink_url)
      .map((t) => ({
        title: t.title as string,
        permalinkUrl: t.permalink_url as string,
        artwork: t.artwork_url as string | undefined,
        createdAt: t.created_at as string | undefined,
      }));

    return {
      trackCount: (playlistEntry.track_count as number | undefined) ?? (tracks.length || undefined),
      year: playlistEntry.created_at ? new Date(playlistEntry.created_at as string).getFullYear() : undefined,
      tracks: tracks.length ? tracks : undefined,
    };
  } catch (err) {
    console.error(`[series.ts] Detalle de playlist falló para ${url}:`, err);
    return null;
  }
}

// --- Orquestación ----------------------------------------------------------
let cachedSeries: ResolvedSeries[] | null = null;

export async function getAllSeries(): Promise<ResolvedSeries[]> {
  if (cachedSeries) return cachedSeries;

  const extraUrls = await tryDiscoverExtraPlaylistUrls();
  const allUrls = [...new Set([...SERIES_SOURCES, ...extraUrls])];

  const seenSlugs = new Set<string>();

  cachedSeries = await Promise.all(
    allUrls.map(async (soundcloudUrl) => {
      const [oembed, detail] = await Promise.all([
        fetchOEmbed(soundcloudUrl),
        scrapePlaylistDetail(soundcloudUrl),
      ]);

      // Si oEmbed falló, usamos el último segmento de la URL como título
      // de respaldo (mejor que nada, y muy poco probable que pase).
      const fallbackTitle = soundcloudUrl.split("/").pop()?.replace(/-/g, " ") ?? soundcloudUrl;
      const title = oembed?.title ?? fallbackTitle;

      let slug = slugify(title);
      while (seenSlugs.has(slug)) slug += "-2";
      seenSlugs.add(slug);

      return {
        slug,
        title,
        soundcloudUrl,
        thumbnail: oembed?.thumbnail_url,
        trackCount: detail?.trackCount,
        year: detail?.year,
      } satisfies ResolvedSeries;
    })
  );

  console.log(
    `[series.ts] ${cachedSeries.length} series resueltas: ` +
      cachedSeries
        .map((s) => `"${s.title}" (img:${s.thumbnail ? "sí" : "NO"}, tracks:${s.trackCount ?? "?"}, año:${s.year ?? "?"})`)
        .join(" | ")
  );

  return cachedSeries;
}

export async function getSeriesBySlug(slug: string): Promise<ResolvedSeries | undefined> {
  const all = await getAllSeries();
  return all.find((s) => s.slug === slug);
}

/** Tracks completos de un playlist (usado para el "destacado" en /mensajes). */
export async function getPlaylistTracks(soundcloudUrl: string): Promise<Track[]> {
  const detail = await scrapePlaylistDetail(soundcloudUrl);
  return detail?.tracks ?? [];
}

/** URL del iframe del widget de SoundCloud para un playlist completo. */
export function buildPlaylistEmbedUrl(soundcloudUrl: string) {
  const params = new URLSearchParams({
    url: soundcloudUrl,
    color: "%23D8B24B",
    auto_play: "false",
    show_teaser: "false",
    visual: "false",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}