/** Mapa simple con OpenStreetMap embed para geolocalizar incidentes */
export default function MapaIncidentes({ puntos = [] }) {
  const conCoords = puntos.filter((p) => p.latitud != null && p.longitud != null);

  if (conCoords.length === 0) {
    return (
      <p className="text-gray-500 text-sm p-4 bg-white rounded-lg border">
        No hay coordenadas GPS disponibles. Verifica la API de ubicación (OpenCage).
      </p>
    );
  }

  const centro = conCoords[0];
  const bbox = calcularBbox(conCoords);
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${centro.latitud}%2C${centro.longitud}`;

  return (
    <div className="space-y-3">
      <iframe
        title="Mapa de incidentes Valle del Sol"
        className="w-full h-80 rounded-lg border border-gray-200"
        src={embedUrl}
        loading="lazy"
      />
      <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
        {conCoords.map((p) => (
          <li key={p.id}>
            <a
              href={`https://www.openstreetmap.org/?mlat=${p.latitud}&mlon=${p.longitud}#map=16/${p.latitud}/${p.longitud}`}
              target="_blank"
              rel="noreferrer"
              className="text-orange-600 hover:underline"
            >
              #{p.id} — {p.direccion ?? p.sector ?? 'Incidente'}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function calcularBbox(puntos) {
  const lats = puntos.map((p) => p.latitud);
  const lons = puntos.map((p) => p.longitud);
  const pad = 0.02;
  const minLon = Math.min(...lons) - pad;
  const minLat = Math.min(...lats) - pad;
  const maxLon = Math.max(...lons) + pad;
  const maxLat = Math.max(...lats) + pad;
  return `${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}`;
}
