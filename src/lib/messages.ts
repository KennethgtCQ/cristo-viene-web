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

import { getAllSeries, getPlaylistTracks } from "./series";

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

  // Asumimos que getAllSeries() ya devuelve la serie más reciente primero
  // (así viene ordenada la página de "sets" de SoundCloud). Si tienes el
  // campo "year" en varias series, usamos ese como desempate explícito.
  const mostRecentSeries = [...series].sort((a, b) => (b.year ?? 0) - (a.year ?? 0))[0];

  const tracks = await getPlaylistTracks(mostRecentSeries.soundcloudUrl);
  if (tracks.length === 0) {
    console.error(
      `[messages.ts] La serie más reciente ("${mostRecentSeries.title}") no devolvió tracks; ` +
        "no se puede armar el destacado automático."
    );
    return undefined;
  }

  // "El track que esté último en esa playlist", tal como lo pediste.
  const lastTrack = tracks[tracks.length - 1];

  return {
    title: lastTrack.title,
    series: mostRecentSeries.title,
    provider: "soundcloud",
    soundcloudUrl: lastTrack.permalinkUrl,
  };
}

export async function getFeaturedMessage(): Promise<Message | undefined> {
  if (MANUAL_OVERRIDE) return MANUAL_OVERRIDE;
  return getAutoFeaturedMessage();
}

export function getYoutubeThumbnail(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}