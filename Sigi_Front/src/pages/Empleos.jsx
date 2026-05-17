import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import {
  listarEmpleos,
  listarEmpleosAdmin,
  listarPostulaciones,
  crearEmpleo,
  eliminarEmpleo,
  postularEmpleo,
  misPostulaciones,
} from '../services/empleoService';

export default function Empleos() {
  const { esAdmin, esOperador } = useAuth();
  const puedeVerPostulaciones = esAdmin || esOperador;
  const [empleos, setEmpleos] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [todasPostulaciones, setTodasPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [nuevo, setNuevo] = useState({
    titulo: '',
    departamento: '',
    plazas: 1,
    descripcion: '',
    fechaCierre: '',
  });

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const [emp, post, todas] = await Promise.all([
        esAdmin ? listarEmpleosAdmin() : listarEmpleos(),
        misPostulaciones().catch(() => []),
        puedeVerPostulaciones ? listarPostulaciones().catch(() => []) : Promise.resolve([]),
      ]);
      setEmpleos(emp);
      setPostulaciones(post);
      setTodasPostulaciones(todas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [esAdmin, puedeVerPostulaciones]);

  const postular = async (empleoId) => {
    try {
      await postularEmpleo(empleoId);
      setMensaje('Postulación enviada al municipio');
      await cargar();
    } catch (err) {
      setMensaje(err.message);
    }
  };

  const agregarEmpleo = async (e) => {
    e.preventDefault();
    try {
      await crearEmpleo({
        ...nuevo,
        plazas: Number(nuevo.plazas),
        fechaCierre: nuevo.fechaCierre || null,
      });
      setNuevo({ titulo: '', departamento: '', plazas: 1, descripcion: '', fechaCierre: '' });
      await cargar();
    } catch (err) {
      setMensaje(err.message);
    }
  };

  if (loading) return <Layout><Spinner label="Cargando empleos..." /></Layout>;

  return (
    <Layout title="Empleos disponibles">
      <ErrorMessage message={error} onRetry={cargar} />
      {mensaje && <p className="mb-4 text-sm text-green-700 bg-green-50 p-2 rounded">{mensaje}</p>}
      <ul className="space-y-3 mb-8">
        {empleos.map((emp) => (
          <li key={emp.id} className="bg-white border rounded-xl p-4 flex flex-wrap justify-between gap-2">
            <div>
              <p className="font-bold">{emp.titulo}</p>
              <p className="text-sm text-gray-500">
                {emp.departamento} · {emp.plazas} plazas
                {emp.fechaCierre ? ` · cierra ${emp.fechaCierre}` : ''}
              </p>
              <p className="text-sm mt-1">{emp.descripcion}</p>
              {!emp.activo && <span className="text-xs text-red-500">Inactivo</span>}
            </div>
            <div className="flex gap-2">
              {emp.activo !== false && (
                <button
                  type="button"
                  onClick={() => postular(emp.id)}
                  className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg"
                >
                  Postular
                </button>
              )}
              {esAdmin && (
                <button
                  type="button"
                  onClick={async () => {
                    await eliminarEmpleo(emp.id);
                    await cargar();
                  }}
                  className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg"
                >
                  Desactivar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {puedeVerPostulaciones && todasPostulaciones.length > 0 && (
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-3 text-slate-800">Postulaciones recibidas</h2>
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full text-sm min-w-[520px]">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2 text-left">Empleo</th>
                  <th className="p-2 text-left">Postulante</th>
                  <th className="p-2 text-left">RUT</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {todasPostulaciones.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.empleoTitulo ?? `#${p.empleoId}`}</td>
                    <td className="p-2">
                      {p.postulanteNombre} {p.postulanteApellido}
                    </td>
                    <td className="p-2">{p.postulanteRut ?? '—'}</td>
                    <td className="p-2">{p.postulanteEmail ?? '—'}</td>
                    <td className="p-2 text-xs text-slate-500">
                      {p.fechaPostulacion
                        ? new Date(p.fechaPostulacion).toLocaleString('es-CL')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {postulaciones.length > 0 && (
        <>
          <h2 className="font-bold mb-2">Mis postulaciones</h2>
          <ul className="text-sm text-gray-600 space-y-1 mb-6">
            {postulaciones.map((p) => (
              <li key={p.id}>
                Empleo #{p.empleoId} — {p.estado} ·{' '}
                {p.fechaPostulacion
                  ? new Date(p.fechaPostulacion).toLocaleString('es-CL')
                  : ''}
              </li>
            ))}
          </ul>
        </>
      )}
      {esAdmin && (
        <form onSubmit={agregarEmpleo} className="bg-white border rounded-xl p-4 space-y-2 max-w-md">
          <h2 className="font-bold">Crear aviso (admin)</h2>
          <input
            placeholder="Título"
            required
            value={nuevo.titulo}
            onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })}
            className="w-full border rounded px-2 py-1"
          />
          <input
            placeholder="Departamento"
            required
            value={nuevo.departamento}
            onChange={(e) => setNuevo({ ...nuevo, departamento: e.target.value })}
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="number"
            min={1}
            value={nuevo.plazas}
            onChange={(e) => setNuevo({ ...nuevo, plazas: e.target.value })}
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="date"
            value={nuevo.fechaCierre}
            onChange={(e) => setNuevo({ ...nuevo, fechaCierre: e.target.value })}
            className="w-full border rounded px-2 py-1"
          />
          <textarea
            placeholder="Descripción"
            required
            value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            className="w-full border rounded px-2 py-1"
          />
          <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">
            Publicar
          </button>
        </form>
      )}
    </Layout>
  );
}
