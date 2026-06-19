import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { mediaUrl } from '../services/apiClient';
import { misReportes } from '../services/reporteService';
import { serializeApiError } from '../utils/apiError';

export default function MisReportes() {
  const { usuarioId } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const lista = await misReportes(usuarioId);
      setData(lista);
    } catch (err) {
      setError(serializeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [usuarioId]);

  const filtrados = data.filter((r) => {
    if (filtro === 'pendientes') return r.estado === 'PENDIENTE' || r.estado === 'EN_REVISION';
    if (filtro === 'resueltos') return ['VALIDADO', 'CERRADO', 'EN_ATENCION'].includes(r.estado);
    return true;
  });

  if (loading) return <Layout><Spinner label="Cargando tus reportes..." /></Layout>;
  if (error) return <Layout><ErrorMessage error={error} onRetry={cargar} /></Layout>;

  return (
    <Layout title="Mis reportes">
      <div className="flex gap-2 mb-4">
        {['todos', 'pendientes', 'resueltos'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFiltro(f)}
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              filtro === f ? 'bg-orange-600 text-white' : 'bg-white border'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {filtrados.length === 0 ? (
        <p className="text-gray-500">No hay reportes en esta categoría.</p>
      ) : (
        <ul className="space-y-3">
          {filtrados.map((r) => (
            <li key={r.id} className="bg-white border rounded-xl p-4 shadow-sm">
              <div className="flex justify-between gap-2">
                <span className="font-bold text-gray-800">#{r.id}</span>
                <EstadoBadge estado={r.estado} />
              </div>
              <p className="text-sm mt-2">{r.descripcion}</p>
              <p className="text-xs text-gray-500 mt-1">{r.direccion}</p>
              <p className="text-xs text-gray-400">
                {r.prioridad} · {r.fechaReporte ? new Date(r.fechaReporte).toLocaleString('es-CL') : ''}
              </p>
              {r.fotoUrl && (
                <img
                  src={mediaUrl(r.fotoUrl)}
                  alt="Evidencia"
                  className="mt-2 h-32 rounded-lg object-cover border"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}

function EstadoBadge({ estado }) {
  const colors = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    VALIDADO: 'bg-green-100 text-green-800',
    RECHAZADO: 'bg-red-100 text-red-800',
    CERRADO: 'bg-gray-200 text-gray-700',
  };
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded ${colors[estado] ?? 'bg-slate-100'}`}>
      {estado}
    </span>
  );
}
