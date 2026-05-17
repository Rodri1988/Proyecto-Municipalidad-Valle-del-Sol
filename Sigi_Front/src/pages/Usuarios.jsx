import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import { ROLES } from '../constants/usuariosPrueba';
import {
  listarUsuarios,
  crearUsuario,
  actualizarRolUsuario,
  suspenderUsuario,
  reactivarUsuario,
  eliminarUsuario,
} from '../services/usuarioService';

const ROLES_ASIGNABLES = Object.values(ROLES);

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [nuevo, setNuevo] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    password: '',
    rol: 'CIUDADANO',
    telefono: '',
  });

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      setUsuarios(await listarUsuarios());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const crear = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      await crearUsuario({
        ...nuevo,
        telefono: nuevo.telefono || undefined,
      });
      setNuevo({
        nombre: '',
        apellido: '',
        rut: '',
        email: '',
        password: '',
        rol: 'CIUDADANO',
        telefono: '',
      });
      setMensaje('Usuario creado');
      await cargar();
    } catch (err) {
      setMensaje(err.message);
    }
  };

  const cambiarRol = async (id, rol) => {
    try {
      await actualizarRolUsuario(id, rol);
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout title="Gestión de usuarios (admin)">
      <ErrorMessage message={error} onRetry={cargar} />
      {mensaje && (
        <p className="mb-4 text-sm text-green-700 bg-green-50 p-2 rounded-lg">{mensaje}</p>
      )}

      <form onSubmit={crear} className="mb-8 bg-white border rounded-2xl p-4 grid sm:grid-cols-2 gap-3 max-w-3xl">
        <h2 className="sm:col-span-2 font-bold text-slate-800">Crear usuario</h2>
        <input
          placeholder="Nombre"
          required
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <input
          placeholder="Apellido"
          required
          value={nuevo.apellido}
          onChange={(e) => setNuevo({ ...nuevo, apellido: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <input
          placeholder="RUT"
          required
          value={nuevo.rut}
          onChange={(e) => setNuevo({ ...nuevo, rut: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={nuevo.email}
          onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          minLength={6}
          value={nuevo.password}
          onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={nuevo.rol}
          onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          {ROLES_ASIGNABLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <button
          type="submit"
          className="sm:col-span-2 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold"
        >
          Crear usuario
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t hover:bg-slate-50">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.nombre} {u.apellido}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.rol}
                    onChange={(e) => cambiarRol(u.id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs"
                  >
                    {ROLES_ASIGNABLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <span className={u.activo ? 'text-emerald-600' : 'text-red-600'}>
                    {u.activo ? 'Activo' : 'Suspendido'}
                  </span>
                </td>
                <td className="p-3 flex flex-wrap gap-2">
                  {u.activo ? (
                    <button
                      type="button"
                      onClick={async () => {
                        await suspenderUsuario(u.id);
                        await cargar();
                      }}
                      className="text-amber-700 hover:underline text-xs font-semibold"
                    >
                      Suspender
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        await reactivarUsuario(u.id);
                        await cargar();
                      }}
                      className="text-emerald-700 hover:underline text-xs font-semibold"
                    >
                      Reactivar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm('¿Eliminar permanentemente?')) return;
                      await eliminarUsuario(u.id);
                      await cargar();
                    }}
                    className="text-red-600 hover:underline text-xs font-semibold"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
