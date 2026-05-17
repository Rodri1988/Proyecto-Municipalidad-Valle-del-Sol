import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import MapaIncidentes from '../components/MapaIncidentes';
import { listarTodosReportes, reportesPendientes, validarReporte } from '../services/reporteService';
import { listarTodasEmergencias } from '../services/emergenciaService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { esAdmin } = useAuth();
  const [reportes, setReportes] = useState([]);
  const [emergencias, setEmergencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notas, setNotas] = useState({});

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rep, em] = await Promise.all([
        esAdmin ? listarTodosReportes() : reportesPendientes(),
        listarTodasEmergencias(),
      ]);
      setReportes(rep);
      setEmergencias(em);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [esAdmin]);

  const handleValidar = async (id, aprobado) => {
    try {
      await validarReporte(id, {
        aprobado,
        notasOperador: notas[id] ?? (aprobado ? 'Aprobado desde dashboard' : 'Rechazado'),
      });
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Layout><Spinner label="Cargando dashboard..." /></Layout>;

  const puntosMapa = [
    ...reportes.map((r) => ({
      id: r.id,
      latitud: r.latitud,
      longitud: r.longitud,
      direccion: r.direccion,
    })),
    ...emergencias.map((e) => ({
      id: `e-${e.id}`,
      latitud: e.latitud,
      longitud: e.longitud,
      direccion: e.direccion,
    })),
  ];

  const pendientes = reportes.filter((r) => r.estado === 'PENDIENTE').length;

  return (
    <Layout title="Dashboard de reportes">
      <ErrorMessage message={error} onRetry={cargar} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Total reportes" value={reportes.length} />
        <Stat label="Pendientes" value={pendientes} />
        <Stat label="Emergencias" value={emergencias.length} />
        <Stat label="Con GPS" value={puntosMapa.filter((p) => p.latitud).length} />
      </div>

      {esAdmin && (
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-2">Geolocalización de incidentes</h2>
          <MapaIncidentes puntos={puntosMapa} />
        </section>
      )}

      <h2 className="font-bold text-lg mb-3">Cola de validación</h2>
      <ul className="space-y-3">
        {reportes
          .filter((r) => r.estado === 'PENDIENTE')
          .map((r) => (
            <li key={r.id} className="bg-white border rounded-xl p-4">
              <p className="font-bold">#{r.id} — {r.prioridad}</p>
              <p className="text-sm">{r.descripcion}</p>
              <p className="text-xs text-gray-500">{r.direccion}</p>
              <input
                className="mt-2 w-full border rounded px-2 py-1 text-sm"
                placeholder="Notas del operador"
                value={notas[r.id] ?? ''}
                onChange={(e) => setNotas((n) => ({ ...n, [r.id]: e.target.value }))}
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleValidar(r.id, true)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg"
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  onClick={() => handleValidar(r.id, false)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg"
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
      </ul>
    </Layout>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
      <p className="text-2xl font-bold text-orange-600">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
