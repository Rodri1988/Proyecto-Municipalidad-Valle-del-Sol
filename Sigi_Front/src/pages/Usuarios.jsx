import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import { listarUsuarios, desactivarUsuario } from '../services/usuarioService';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const desactivar = async (id) => {
    if (!window.confirm('¿Desactivar este usuario?')) return;
    try {
      await desactivarUsuario(id);
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout title="Gestión de usuarios (admin)">
      <ErrorMessage message={error} onRetry={cargar} />
      <table className="w-full bg-white border rounded-xl overflow-hidden text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Rol</th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.nombre} {u.apellido}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.rol}</td>
              <td className="p-2">
                <button
                  type="button"
                  onClick={() => desactivar(u.id)}
                  className="text-red-600 hover:underline"
                >
                  Desactivar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
