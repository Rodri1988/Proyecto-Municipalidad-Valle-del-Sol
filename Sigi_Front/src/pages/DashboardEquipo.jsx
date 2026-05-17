import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import DashboardStat from '../components/DashboardStat';
import { useAuth } from '../context/AuthContext';
import { CONFIG_EQUIPO } from '../constants/usuariosPrueba';
import { clasificarReporte, listarReportesEquipo } from '../services/reporteService';
import { reporteApiACard } from '../utils/reporteMappers';

const COLOR_MAP = {
  emerald: { header: 'from-emerald-700 to-teal-800', badge: 'bg-emerald-100 text-emerald-800', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  red: { header: 'from-red-700 to-rose-900', badge: 'bg-red-100 text-red-800', btn: 'bg-red-600 hover:bg-red-700' },
  sky: { header: 'from-sky-700 to-blue-900', badge: 'bg-sky-100 text-sky-800', btn: 'bg-sky-600 hover:bg-sky-700' },
  indigo: { header: 'from-indigo-700 to-violet-900', badge: 'bg-indigo-100 text-indigo-800', btn: 'bg-indigo-600 hover:bg-indigo-700' },
  amber: { header: 'from-amber-700 to-orange-900', badge: 'bg-amber-100 text-amber-800', btn: 'bg-amber-600 hover:bg-amber-700' },
};

export default function DashboardEquipo() {
  const { rol } = useAuth();
  const config = CONFIG_EQUIPO[rol] ?? CONFIG_EQUIPO.EQUIPO_EMERGENCIA;
  const theme = COLOR_MAP[config.color] ?? COLOR_MAP.amber;

  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notas, setNotas] = useState({});
  const [filtro, setFiltro] = useState('todos');

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarReportesEquipo();
      setReportes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const clasificar = async (id, estado, requiereCarabineros = false) => {
    try {
      await clasificarReporte(id, {
        estado,
        requiereCarabineros,
        notas: notas[id] ?? `Clasificado por ${config.titulo}`,
      });
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Spinner label={`Cargando panel de ${config.titulo}...`} />
      </Layout>
    );
  }

  const pendientes = reportes.filter((r) => r.estado === 'PENDIENTE').length;
  const enAtencion = reportes.filter((r) => r.estado === 'EN_ATENCION').length;
  const resueltos = reportes.filter((r) => r.estado === 'CERRADO').length;
  const carabineros = reportes.filter((r) => r.requiereCarabineros).length;

  const filtrados = reportes.filter((r) => {
    if (filtro === 'pendientes') return r.estado === 'PENDIENTE';
    if (filtro === 'atencion') return r.estado === 'EN_ATENCION';
    if (filtro === 'resueltos') return r.estado === 'CERRADO';
    if (filtro === 'carabineros') return r.requiereCarabineros;
    return true;
  });

  return (
    <Layout>
      <section
        className={`mb-8 rounded-2xl bg-gradient-to-r ${theme.header} p-6 sm:p-8 text-white shadow-xl`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-3xl" aria-hidden>{config.icono}</span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{config.titulo}</h1>
            <p className="mt-1 text-sm text-white/80 sm:text-base">{config.subtitulo}</p>
          </div>
          <span className={`self-start rounded-full px-3 py-1 text-xs font-bold ${theme.badge}`}>
            {rol}
          </span>
        </div>
      </section>

      <ErrorMessage message={error} onRetry={cargar} />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <DashboardStat label="Pendientes" value={pendientes} accent={config.color} />
        <DashboardStat label="En atención" value={enAtencion} accent="slate" />
        <DashboardStat label="Resueltos" value={resueltos} accent={config.color} />
        <DashboardStat label="Req. Carabineros" value={carabineros} accent="red" />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ['todos', 'Todos'],
          ['pendientes', 'Pendientes'],
          ['atencion', 'En atención'],
          ['resueltos', 'Resueltos'],
          ['carabineros', 'Carabineros'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFiltro(key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filtro === key ? `${theme.btn} text-white` : 'border bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtrados.map((r) => {
          const card = reporteApiACard(r);
          return (
            <li
              key={r.id}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-md transition hover:shadow-lg"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${theme.badge}`}>
                  {card.nivelRiesgo}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {r.estado}
                </span>
                {r.requiereCarabineros && (
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                    Carabineros
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 line-clamp-1">{card.sector}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-600 line-clamp-3">{card.descripcion}</p>
              {r.motivoPrioridad && (
                <p className="mt-2 text-xs text-slate-400 italic">{r.motivoPrioridad}</p>
              )}
              {r.reportesSimilares > 0 && (
                <p className="mt-1 text-xs font-semibold text-orange-600">
                  {r.reportesSimilares} reportes similares (métrica)
                </p>
              )}
              <input
                className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Notas de clasificación"
                value={notas[r.id] ?? ''}
                onChange={(e) => setNotas((n) => ({ ...n, [r.id]: e.target.value }))}
              />
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => clasificar(r.id, 'PENDIENTE')}
                  className="rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Pendiente
                </button>
                <button
                  type="button"
                  onClick={() => clasificar(r.id, 'EN_ATENCION')}
                  className={`rounded-lg py-2 text-xs font-bold text-white ${theme.btn}`}
                >
                  En atención
                </button>
                <button
                  type="button"
                  onClick={() => clasificar(r.id, 'CERRADO')}
                  className="rounded-lg bg-slate-800 py-2 text-xs font-bold text-white hover:bg-slate-900"
                >
                  Resuelto
                </button>
              </div>
              <button
                type="button"
                onClick={() => clasificar(r.id, r.estado === 'CERRADO' ? 'CERRADO' : 'EN_ATENCION', true)}
                className="mt-2 w-full rounded-lg border-2 border-red-300 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
              >
                Requiere presencia de Carabineros
              </button>
            </li>
          );
        })}
      </ul>
      {filtrados.length === 0 && (
        <p className="text-center text-slate-500 py-12">No hay reportes en esta categoría.</p>
      )}
    </Layout>
  );
}
