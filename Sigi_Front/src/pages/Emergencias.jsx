import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import { listarEmergenciasActivas, actualizarEstadoEmergencia } from '../services/emergenciaService';

const ESTADOS = ['ACTIVA', 'EN_PROCESO', 'CONTROLADA', 'RESUELTA'];

export default function Emergencias() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await listarEmergenciasActivas());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const cambiarEstado = async (id, estado) => {
    try {
      await actualizarEstadoEmergencia(id, {
        estado,
        notas: `Actualizado por equipo — ${new Date().toLocaleString('es-CL')}`,
      });
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout title="Emergencias activas (brigada / bomberos)">
      <ErrorMessage message={error} onRetry={cargar} />
      <p className="text-sm text-gray-500 mb-4">Permiso de lectura y edición de estado</p>
      <ul className="space-y-4">
        {data.map((e) => (
          <li key={e.id} className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="font-bold">Emergencia #{e.id} — {e.prioridad}</p>
            <p className="text-sm">{e.descripcion}</p>
            <p className="text-xs text-gray-500">{e.direccion}</p>
            <p className="text-xs mt-1">Estado: <strong>{e.estado}</strong></p>
            <select
              className="mt-2 border rounded px-2 py-1 text-sm"
              value={e.estado}
              onChange={(ev) => cambiarEstado(e.id, ev.target.value)}
            >
              {ESTADOS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      {data.length === 0 && <p className="text-gray-500">No hay emergencias activas.</p>}
    </Layout>
  );
}
