import { useEffect, useRef, useState } from 'react';
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
  asignarReporte,
} from '../services/reporteService';
import { listarTodasEmergencias } from '../services/emergenciaService';
import { listarPersonalEmergencia } from '../services/usuarioService';
import { useAuth } from '../context/AuthContext';
import { PRIORIDADES_API } from '../utils/reporteMappers';
import { serializeApiError } from '../utils/apiError';

const FILTROS = {
  todos: () => true,
  pendientes: (r) => r.estado === 'PENDIENTE',
  criticos: (r) => r.prioridad === 'CRITICA',
  emergencias: () => false,
};

export default function Dashboard() {
  const { esAdmin, esOperador } = useAuth();
  const [reportes, setReportes] = useState([]);
  const [emergencias, setEmergencias] = useState([]);
  const [personalEmergencia, setPersonalEmergencia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notas, setNotas] = useState({});
  const [prioridades, setPrioridades] = useState({});
  const [asignarA, setAsignarA] = useState({});
  const [filtro, setFiltro] = useState('todos');
  const colaRef = useRef(null);

  const cargar = async () => {
    setError(null);
    try {
      const [rep, em, pers] = await Promise.all([
        esAdmin ? listarTodosReportes() : reportesPendientes(),
        listarTodasEmergencias(),
        esOperador || esAdmin ? listarPersonalEmergencia().catch(() => []) : Promise.resolve([]),
      ]);
      setReportes(rep);
      setEmergencias(em);
      setPersonalEmergencia(pers);
      const pri = {};
      rep.forEach((r) => { pri[r.id] = r.prioridad; });
      setPrioridades(pri);
    } catch (err) {
      setError(serializeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    const id = setInterval(cargar, 15000);
    return () => clearInterval(id);
  }, [esAdmin]);

  const handleValidar = async (id, aprobado) => {
    try {
      await validarReporte(id, {
        aprobado,
        notasOperador: notas[id] ?? (aprobado ? 'Aprobado desde dashboard' : 'Rechazado'),
      });
      await cargar();
    } catch (err) {
      setError(serializeApiError(err));
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
      setError(serializeApiError(err));
    }
  };

  const handleAsignar = async (id) => {
    const usuarioId = Number(asignarA[id]);
    if (!usuarioId) {
      setError(serializeApiError('Selecciona personal de emergencia'));
      return;
    }
    try {
      await asignarReporte(id, {
        usuarioId,
        notas: notas[id] ?? 'Derivado desde dashboard',
      });
      await cargar();
    } catch (err) {
      setError(serializeApiError(err));
    }
  };

  const irACola = () => {
    colaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return <Layout><Spinner label="Cargando dashboard..." /></Layout>;

  const puntosMapa = [
    ...reportes.map((r) => ({
      id: r.id,
      latitud: r.latitud,
      longitud: r.longitud,
      direccion: r.direccion,
      descripcion: r.descripcion,
    })),
    ...emergencias.map((e) => ({
      id: `e-${e.id}`,
      latitud: e.latitud,
      longitud: e.longitud,
      direccion: e.direccion,
      descripcion: e.descripcion,
    })),
  ];

  const pendientes = reportes.filter((r) => r.estado === 'PENDIENTE').length;
  const criticos = reportes.filter((r) => r.prioridad === 'CRITICA').length;

  const listaCola = filtro === 'pendientes'
    ? reportes.filter((r) => r.estado === 'PENDIENTE')
    : filtro === 'criticos'
      ? reportes.filter((r) => r.prioridad === 'CRITICA')
      : reportes.filter((r) => r.estado === 'PENDIENTE');

  return (
    <Layout title="Dashboard operacional">
      <ErrorMessage error={error} onRetry={cargar} />

      <section className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-orange-900 p-6 sm:p-8 text-white shadow-xl">
        <h2 className="text-xl sm:text-2xl font-extrabold">Centro de control SIGI</h2>
        <p className="mt-1 text-sm text-white/75">
          Validación, priorización y derivación a equipos — Municipalidad Valle del Sol
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4 mb-8">
        <DashboardStat
          label="Total reportes"
          value={reportes.length}
          accent="slate"
          active={filtro === 'todos'}
          onClick={() => { setFiltro('todos'); irACola(); }}
        />
        <DashboardStat
          label="Pendientes"
          value={pendientes}
          accent="orange"
          hint="Requieren validación"
          active={filtro === 'pendientes'}
          onClick={() => { setFiltro('pendientes'); irACola(); }}
        />
        <DashboardStat
          label="Prioridad crítica"
          value={criticos}
          accent="red"
          hint="Por métricas o operador"
          active={filtro === 'criticos'}
          onClick={() => { setFiltro('criticos'); irACola(); }}
        />
        <DashboardStat
          label="Emergencias activas"
          value={emergencias.length}
          accent="sky"
          active={filtro === 'emergencias'}
          onClick={() => setFiltro('emergencias')}
        />
      </div>

      {filtro === 'emergencias' && (
        <section className="mb-8 rounded-2xl border bg-white p-6 shadow-lg">
          <h2 className="font-bold text-lg mb-4">Emergencias activas</h2>
          {emergencias.length === 0 ? (
            <p className="text-slate-500 text-sm">No hay emergencias activas.</p>
          ) : (
            <ul className="space-y-2">
              {emergencias.map((e) => (
                <li key={e.id} className="rounded-xl border p-3 text-sm">
                  <span className="font-bold">#{e.id}</span> — {e.descripcion?.slice(0, 80)}
                  <p className="text-slate-500 text-xs mt-1">{e.direccion}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {esAdmin && filtro !== 'emergencias' && (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-lg">
          <h2 className="font-bold text-lg mb-3 text-slate-800">Geolocalización de incidentes</h2>
          <MapaIncidentes puntos={puntosMapa} onRefresh={cargar} />
        </section>
      )}

      {filtro !== 'emergencias' && (
        <>
          <h2 ref={colaRef} className="font-bold text-lg mb-4 text-slate-800 scroll-mt-24">
            Cola de validación
            {filtro !== 'todos' && (
              <span className="ml-2 text-sm font-normal text-slate-500">
                (filtro: {filtro})
              </span>
            )}
          </h2>
          <ul className="grid gap-4 lg:grid-cols-2">
            {listaCola.map((r) => (
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
                  {r.asignadoANombre && (
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-800">
                      → {r.asignadoANombre} ({r.asignadoARol})
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700">{r.descripcion}</p>
                <p className="text-xs text-slate-500 mt-1">{r.direccion}</p>
                {r.motivoPrioridad && (
                  <p className="mt-2 text-xs italic text-slate-400">{r.motivoPrioridad}</p>
                )}

                {esOperador && r.estado === 'PENDIENTE' && (
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

                {(esOperador || esAdmin) && personalEmergencia.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    <label className="text-xs font-semibold text-slate-600">Derivar a:</label>
                    <select
                      className="border rounded-lg px-2 py-1 text-sm min-w-[160px]"
                      value={asignarA[r.id] ?? ''}
                      onChange={(e) => setAsignarA((a) => ({ ...a, [r.id]: e.target.value }))}
                    >
                      <option value="">Seleccionar…</option>
                      {personalEmergencia.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nombre} {u.apellido} — {u.rol}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleAsignar(r.id)}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900"
                    >
                      Enviar
                    </button>
                  </div>
                )}

                <input
                  className="mt-3 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Notas del operador"
                  value={notas[r.id] ?? ''}
                  onChange={(e) => setNotas((n) => ({ ...n, [r.id]: e.target.value }))}
                />
                {r.estado === 'PENDIENTE' && (
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
                )}
              </li>
            ))}
          </ul>
          {listaCola.length === 0 && (
            <p className="text-slate-500 text-center py-8">No hay reportes en esta vista.</p>
          )}
        </>
      )}
    </Layout>
  );
}
