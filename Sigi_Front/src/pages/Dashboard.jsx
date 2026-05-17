import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import MapaIncidentes from '../components/MapaIncidentes';
import DashboardStat from '../components/DashboardStat';
import {
  listarTodosReportes,
  reportesPendientes,
  validarReporte,
  actualizarPrioridadReporte,
} from '../services/reporteService';
import { listarTodasEmergencias } from '../services/emergenciaService';
import { useAuth } from '../context/AuthContext';
import { PRIORIDADES_API } from '../utils/reporteMappers';

export default function Dashboard() {
  const { esAdmin, esOperador } = useAuth();
  const [reportes, setReportes] = useState([]);
  const [emergencias, setEmergencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notas, setNotas] = useState({});
  const [prioridades, setPrioridades] = useState({});

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
      const pri = {};
      rep.forEach((r) => { pri[r.id] = r.prioridad; });
      setPrioridades(pri);
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

  const handlePrioridad = async (id) => {
    try {
      await actualizarPrioridadReporte(id, {
        prioridad: prioridades[id],
        notasOperador: notas[id] ?? 'Prioridad ajustada por operador',
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
  const criticos = reportes.filter((r) => r.prioridad === 'CRITICA').length;

  return (
    <Layout title="Dashboard operacional">
      <ErrorMessage message={error} onRetry={cargar} />

      <section className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-orange-900 p-6 sm:p-8 text-white shadow-xl">
        <h2 className="text-xl sm:text-2xl font-extrabold">Centro de control SIGI</h2>
        <p className="mt-1 text-sm text-white/75">
          Validación, priorización manual y seguimiento de emergencias — Municipalidad Valle del Sol
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4 mb-8">
        <DashboardStat label="Total reportes" value={reportes.length} accent="slate" />
        <DashboardStat label="Pendientes" value={pendientes} accent="orange" hint="Requieren validación" />
        <DashboardStat label="Prioridad crítica" value={criticos} accent="red" hint="Por métricas o operador" />
        <DashboardStat label="Emergencias activas" value={emergencias.length} accent="sky" />
      </div>

      {esAdmin && (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-lg">
          <h2 className="font-bold text-lg mb-3 text-slate-800">Geolocalización de incidentes</h2>
          <MapaIncidentes puntos={puntosMapa} />
        </section>
      )}

      <h2 className="font-bold text-lg mb-4 text-slate-800">Cola de validación</h2>
      <ul className="grid gap-4 lg:grid-cols-2">
        {reportes
          .filter((r) => r.estado === 'PENDIENTE')
          .map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md hover:shadow-lg transition"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-bold text-slate-900">#{r.id}</span>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-800">
                  {r.prioridad}
                </span>
                {r.reportesSimilares > 0 && (
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                    {r.reportesSimilares} similares
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700">{r.descripcion}</p>
              <p className="text-xs text-slate-500 mt-1">{r.direccion}</p>
              {r.motivoPrioridad && (
                <p className="mt-2 text-xs italic text-slate-400">{r.motivoPrioridad}</p>
              )}

              {esOperador && (
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <label className="text-xs font-semibold text-slate-600">Prioridad:</label>
                  <select
                    className="border rounded-lg px-2 py-1 text-sm"
                    value={prioridades[r.id] ?? r.prioridad}
                    onChange={(e) => setPrioridades((p) => ({ ...p, [r.id]: e.target.value }))}
                  >
                    {PRIORIDADES_API.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handlePrioridad(r.id)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-800"
                  >
                    Guardar prioridad
                  </button>
                </div>
              )}

              <input
                className="mt-3 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                placeholder="Notas del operador"
                value={notas[r.id] ?? ''}
                onChange={(e) => setNotas((n) => ({ ...n, [r.id]: e.target.value }))}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => handleValidar(r.id, true)}
                  className="flex-1 min-w-[120px] px-3 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700"
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  onClick={() => handleValidar(r.id, false)}
                  className="flex-1 min-w-[120px] px-3 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700"
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
      </ul>
      {reportes.filter((r) => r.estado === 'PENDIENTE').length === 0 && (
        <p className="text-slate-500 text-center py-8">No hay reportes pendientes de validación.</p>
      )}
    </Layout>
  );
}
