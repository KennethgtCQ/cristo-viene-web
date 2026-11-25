// Ubicación de la iglesia: única fuente de verdad para el mapa y los enlaces.
export const UBICACION = { lng: -83.92307, lat: 9.864313 } as const;

export const COMO_LLEGAR_URL = `https://www.google.com/maps/dir/?api=1&destination=${UBICACION.lat},${UBICACION.lng}`;