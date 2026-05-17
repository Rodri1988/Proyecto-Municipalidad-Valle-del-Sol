import { useState } from 'react';
import Layout from '../components/Layout';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { mediaUrl } from '../services/apiClient';
import { subirImagen } from '../services/mediaService';
import { actualizarFotoPerfil } from '../services/usuarioService';

export default function Perfil() {
  const { auth } = useAuth();
  const [fotoUrl, setFotoUrl] = useState(null);
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [guardado, setGuardado] = useState(false);

  const onFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const media = await subirImagen(file, 'PERFIL');
      const usuario = await actualizarFotoPerfil(media.id);
      setFotoUrl(mediaUrl(usuario.fotoUrl));
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Mi perfil">
      <ErrorMessage message={error} />
      <div className="max-w-md bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          {fotoUrl ? (
            <img src={fotoUrl} alt="Perfil" className="w-20 h-20 rounded-full object-cover border" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-800">
              Sin foto
            </div>
          )}
          <label className="text-sm">
            <span className="font-medium block mb-1">Foto de perfil</span>
            <input type="file" accept="image/*" onChange={onFoto} disabled={loading} />
          </label>
        </div>
        <p className="text-sm text-gray-500">Email: {auth?.email}</p>
        <p className="text-sm text-gray-500">Rol: {auth?.rol}</p>
        <label className="block text-sm">
          Teléfono (nota local)
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </label>
        {guardado && <p className="text-green-600 text-sm">Foto guardada en el servidor</p>}
        {loading && <p className="text-orange-600 text-sm">Subiendo imagen...</p>}
      </div>
    </Layout>
  );
}
