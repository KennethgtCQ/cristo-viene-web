// Fuente de datos del mensaje "Destacado" en /mensajes.
//
// Por defecto, el destacado se calcula AUTOMÁTICAMENTE: se toma el playlist
// (serie) más reciente de SoundCloud y, dentro de ese playlist, el último
// track de la lista. No necesitas tocar este archivo para eso.
//
// Si alguna vez quieres forzar manualmente qué mensaje se muestra como
// destacado (por ejemplo, un video de YouTube especial, o adelantarte a un
// track que sabes que vas a subir), agrega un objeto a MANUAL_OVERRIDE y
// tiene prioridad sobre la detección automática.

import { getAllSeries, getPlaylistTracks, sortSeriesNewestFirst } from "./series";

export type MediaProvider = "youtube" | "soundcloud";

export interface Message {
  title: string;
  series: string;
  pastor?: string;
  description?: string;
  provider: MediaProvider;
  /** Requerido si provider = "youtube". Es el ID del video (lo que va después de ?v= en la URL). */
  youtubeId?: string;
  /** Requerido si provider = "soundcloud". Es la URL completa del track. */
  soundcloudUrl?: string;
}

// ---------------------------------------------------------------------------
// Déjalo vacío (MANUAL_OVERRIDE = null) para usar la detección automática.
// Ponle un objeto para forzar manualmente el destacado.
// ---------------------------------------------------------------------------
const MANUAL_OVERRIDE: Message | null = null;

async function getAutoFeaturedMessage(): Promise<Message | undefined> {
  const series = await getAllSeries();
  if (series.length === 0) return undefined;

  // El destacado sale del track publicado más recientemente en cualquier set.
  const candidates = await Promise.all(
    sortSeriesNewestFirst(series).map(async (serie) => ({
      serie,
      tracks: await getPlaylistTracks(serie.soundcloudUrl),
    }))
  );
  const newest = candidates
    .flatMap(({ serie, tracks }) => tracks.map((track) => ({ serie, track })))
    .sort((a, b) => {
      const aTime = a.track.createdAt ? Date.parse(a.track.createdAt) : 0;
      const bTime = b.track.createdAt ? Date.parse(b.track.createdAt) : 0;
      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    })[0];
  if (!newest) return undefined;

  return {
    title: newest.track.title,
    series: newest.serie.title,
    provider: "soundcloud",
    soundcloudUrl: newest.track.permalinkUrl,
  };
}

export async function getFeaturedMessage(): Promise<Message | undefined> {
  if (MANUAL_OVERRIDE) return MANUAL_OVERRIDE;
  return getAutoFeaturedMessage();
}

export function getYoutubeThumbnail(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
