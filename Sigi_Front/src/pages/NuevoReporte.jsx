import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { crearReporte } from '../services/reporteService';
import { subirImagen } from '../services/mediaService';
import { TIPOS_EMERGENCIA, PRIORIDADES_API } from '../utils/reporteMappers';
import { esOperador } from '../constants/usuariosPrueba';
import { serializeApiError } from '../utils/apiError';

export default function NuevoReporte() {
  const navigate = useNavigate();
  const { rol } = useAuth();
  const operadorPuedePriorizar = esOperador(rol);

  const [tipo, setTipo] = useState('INCENDIO');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [prioridadOperador, setPrioridadOperador] = useState('ALTA');
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
      const payload = { descripcion: texto, direccion, fotoMediaId };
      if (operadorPuedePriorizar) {
        payload.prioridad = prioridadOperador;
      }
      const creado = await crearReporte(payload);
      navigate(operadorPuedePriorizar || rol !== 'CIUDADANO' ? '/mis-reportes' : '/mis-reportes', {
        state: { mensaje: creado.motivoPrioridad },
      });
    } catch (err) {
      setError(serializeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Nuevo reporte de emergencia">
      <ErrorMessage error={error} />

      {!operadorPuedePriorizar && (
        <div className="mb-6 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          <p className="font-semibold">Prioridad automática por métricas</p>
          <p className="mt-1 text-sky-800">
            La prioridad se calcula según el tipo de emergencia, la gravedad y cuántos
            ciudadanos reportan lo mismo en la zona (≥10 reportes similares = crítica).
            Solo el operador municipal puede ajustarla manualmente.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg"
      >
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Tipo de emergencia</span>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
          >
            {TIPOS_EMERGENCIA.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Descripción</span>
          <textarea
            required
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Detalla lo ocurrido..."
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Dirección o referencia</span>
          <input
            required
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Avenida Valle del Sol 450"
          />
        </label>

        {operadorPuedePriorizar && (
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Prioridad (operador municipal)</span>
            <select
              value={prioridadOperador}
              onChange={(e) => setPrioridadOperador(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5"
            >
              {PRIORIDADES_API.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </label>
        )}

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Foto (opcional)</span>
          <input type="file" accept="image/*" onChange={handleFoto} className="mt-1 w-full text-sm" />
          {fotoPreview && (
            <img src={fotoPreview} alt="Vista previa" className="mt-2 max-h-40 rounded-xl object-cover" />
          )}
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold rounded-xl disabled:opacity-60 shadow-md"
        >
          {loading ? 'Enviando...' : 'Enviar reporte'}
        </button>
      </form>
    </Layout>
  );
}
