import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import ReporteIncendioCard from '../components/ReporteIncendioCard';
import { reportesPendientes } from '../services/reporteService';
import { reporteApiACard } from '../utils/reporteMappers';
import { useAuth } from '../context/AuthContext';

const reportesDemo = [
  { id: 1, sector: 'Sector Norte', nivelRiesgo: 'crítico', fuente: 'Vecino', hora: '08:30', estado: 'PENDIENTE' },
  { id: 2, sector: 'Sector Sur', nivelRiesgo: 'alto', fuente: 'Bomberos', hora: '09:15', estado: 'PENDIENTE' },
];

export default function Reportes() {
  const { isAuthenticated } = useAuth();
  const [reportes, setReportes] = useState([]);
  const [filtroNivel, setFiltroNivel] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usarApi, setUsarApi] = useState(isAuthenticated);

  const cargarApi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportesPendientes();
      setReportes(data.map(reporteApiACard));
    } catch (err) {
      setError(err.message);
      setReportes(reportesDemo);
      setUsarApi(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (usarApi && isAuthenticated) {
      cargarApi();
    } else {
      setReportes(reportesDemo);
      const t = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(t);
    }
  }, [usarApi, isAuthenticated, cargarApi]);

  useEffect(() => {
    if (!usarApi || !isAuthenticated) {
      const niveles = ['alto', 'crítico', 'medio'];
      const sectores = ['Sector Centro', 'Cerro Alto', 'Villa Verde'];
      const fuentes = ['Vecino', 'Bomberos', 'Brigadista'];

      const id = setInterval(() => {
        const nuevo = {
          id: Date.now(),
          sector: sectores[Math.floor(Math.random() * sectores.length)],
          nivelRiesgo: niveles[Math.floor(Math.random() * niveles.length)],
          fuente: fuentes[Math.floor(Math.random() * fuentes.length)],
          hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
          estado: 'PENDIENTE',
        };
        setReportes((prev) => [nuevo, ...prev]);
      }, 5000);
      return () => clearInterval(id);
    }
    return undefined;
  }, [usarApi, isAuthenticated]);

  const handleAtendido = (id) => {
    setReportes((prev) => {
      const atendido = prev.find((r) => r.id === id);
      const resto = prev.filter((r) => r.id !== id);
      return [...resto, atendido];
    });
  };

  const reportesFiltrados = reportes.filter((r) =>
    filtroNivel === 'todos' ? true : r.nivelRiesgo === filtroNivel,
  );

  if (loading) {
    return (
      <Layout title="Cola de reportes">
        <Spinner label="Cargando reportes..." />
      </Layout>
    );
  }

  return (
    <Layout title="Reportes de emergencia">
      <ErrorMessage message={error} onRetry={cargarApi} />
      <p className="text-sm text-gray-500 mb-4">
        {usarApi ? 'Datos en vivo desde API' : 'Modo demo (FULLSTACK III)'} · filtro y simulación cada 5s
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {['todos', 'crítico', 'alto', 'medio'].map((nivel) => (
          <button
            key={nivel}
            type="button"
            onClick={() => setFiltroNivel(nivel)}
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              filtroNivel === nivel ? 'bg-orange-600 text-white' : 'bg-white border'
            }`}
          >
            {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Mostrando <strong className="text-orange-600">{reportesFiltrados.length}</strong> reportes
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportesFiltrados.map((reporte) => (
          <ReporteIncendioCard
            key={reporte.id}
            reporte={reporte}
            onAtendido={handleAtendido}
            modoOperador={usarApi}
          />
        ))}
      </div>
    </Layout>
  );
}
