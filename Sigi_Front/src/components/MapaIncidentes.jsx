// Mapa OpenStreetMap + listado de incidentes
export default function MapaIncidentes({ puntos = [], onRefresh }) {
  const conCoords = puntos.filter((p) => p.latitud != null && p.longitud != null);

  if (conCoords.length === 0) {
    return (
      <p className="text-gray-500 text-sm p-4 bg-slate-50 rounded-xl border border-slate-200">
        No hay coordenadas GPS disponibles. Verifica la API de ubicación (OpenCage).
      </p>
    );
  }

  const centro = conCoords[0];
  const bbox = calcularBbox(conCoords);
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${centro.latitud}%2C${centro.longitud}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-700">
          {conCoords.length} incidente{conCoords.length !== 1 ? 's' : ''} en mapa
        </p>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="text-xs font-bold text-orange-600 hover:text-orange-800 px-2 py-1 rounded-lg border border-orange-200"
          >
            Actualizar
          </button>
        )}
      </div>
      <iframe
        title="Mapa de incidentes Valle del Sol"
        className="w-full h-80 rounded-xl border border-slate-200 shadow-inner"
        src={embedUrl}
        loading="lazy"
      />
      <ul className="grid gap-2 sm:grid-cols-2">
        {conCoords.map((p) => (
          <li
            key={p.id}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 hover:border-orange-300 hover:bg-orange-50/50 transition"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-xs font-bold text-white">
              #{p.id}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800 truncate">
                {p.descripcion?.replace(/^\[[^\]]+\]\s*/, '').slice(0, 60) || 'Incidente'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {p.direccion ?? p.sector ?? 'Sin dirección'}
              </p>
              <a
                href={`https://www.openstreetmap.org/?mlat=${p.latitud}&mlon=${p.longitud}#map=16/${p.latitud}/${p.longitud}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-1 text-xs font-semibold text-orange-600 hover:underline"
              >
                Ver en mapa →
              </a>
            </div>
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
