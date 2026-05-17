import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ErrorMessage from '../components/ErrorMessage';
import { crearReporte } from '../services/reporteService';
import { subirImagen } from '../services/mediaService';
import { PRIORIDADES_API, TIPOS_EMERGENCIA } from '../utils/reporteMappers';

export default function NuevoReporte() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('INCENDIO');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [prioridad, setPrioridad] = useState('ALTA');
  const [archivo, setArchivo] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivo(file);
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const texto = `[${tipo}] ${descripcion}`;
    try {
      let fotoMediaId = null;
      if (archivo) {
        const media = await subirImagen(archivo, 'REPORTE');
        fotoMediaId = media.id;
      }
      await crearReporte({
        descripcion: texto,
        direccion,
        prioridad,
        fotoMediaId,
      });
      navigate('/mis-reportes');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Nuevo reporte de emergencia">
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        <label className="block">
          <span className="text-sm font-medium">Tipo de emergencia</span>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          >
            {TIPOS_EMERGENCIA.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Descripción</span>
          <textarea
            required
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="Detalla lo ocurrido..."
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Dirección o referencia</span>
          <input
            required
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="Avenida Valle del Sol 450"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Prioridad</span>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          >
            {PRIORIDADES_API.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Foto (sube al servidor)</span>
          <input type="file" accept="image/*" onChange={handleFoto} className="mt-1 w-full text-sm" />
          {fotoPreview && (
            <img src={fotoPreview} alt="Vista previa" className="mt-2 max-h-40 rounded-lg object-cover" />
          )}
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg disabled:opacity-60"
        >
          {loading ? 'Enviando...' : 'Enviar reporte'}
        </button>
      </form>
    </Layout>
  );
}
