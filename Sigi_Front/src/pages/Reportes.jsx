import { useState, useEffect } from 'react';
import ReporteIncendioCard from '../components/ReporteIncendioCard';

// Datos iniciales hardcodeados (simulando lo que vendría de la API)
const reportesIniciales = [
  { id: 1, sector: 'Sector Norte', nivelRiesgo: 'crítico', fuente: 'Vecino', hora: '08:30' },
  { id: 2, sector: 'Sector Sur',   nivelRiesgo: 'alto',    fuente: 'Bomberos', hora: '09:15' },
  { id: 3, sector: 'Sector Este',  nivelRiesgo: 'medio',   fuente: 'Brigadista', hora: '10:00' },
  { id: 4, sector: 'Sector Oeste', nivelRiesgo: 'alto',    fuente: 'Vecino', hora: '10:45' },
];

export default function Reportes() {
  // ── useState ──────────────────────────────────────────────
  const [reportes, setReportes]       = useState(reportesIniciales);
  const [filtroNivel, setFiltroNivel] = useState('todos');
  const [loading, setLoading]         = useState(true);

  // ── useEffect 1: simula carga inicial ─────────────────────
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // ── useEffect 2: simula nuevo reporte cada 5 segundos ─────
  useEffect(() => {
    const niveles = ['alto', 'crítico', 'medio'];
    const sectores = ['Sector Centro', 'Cerro Alto', 'Villa Verde', 'Parque Industrial'];
    const fuentes = ['Vecino', 'Bomberos', 'Brigadista', 'Cámara'];

    const intervalo = setInterval(() => {
      const nuevoReporte = {
        id: Date.now(),
        sector: sectores[Math.floor(Math.random() * sectores.length)],
        nivelRiesgo: niveles[Math.floor(Math.random() * niveles.length)],
        fuente: fuentes[Math.floor(Math.random() * fuentes.length)],
        hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      };
      setReportes(prev => [nuevoReporte, ...prev]);
    }, 60000);

    // Limpieza: detiene el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalo);
  }, []);

  // ── Marcar como atendido: mueve al final ──────────────────
  const handleAtendido = (id) => {
    setReportes(prev => {
      const atendido = prev.find(r => r.id === id);
      const resto    = prev.filter(r => r.id !== id);
      return [...resto, atendido];
    });
  };

  // ── Filtro por nivel de riesgo ────────────────────────────
  const reportesFiltrados = reportes.filter(r =>
    filtroNivel === 'todos' ? true : r.nivelRiesgo === filtroNivel
  );

  // ── Render ────────────────────────────────────────────────
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-orange-600 font-bold text-xl">Cargando reportes...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Reportes de Incendio
      </h1>
      <p className="text-gray-500 mb-6">Municipalidad Valle del Sol</p>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {['todos', 'crítico', 'alto', 'medio'].map(nivel => (
          <button
            key={nivel}
            onClick={() => setFiltroNivel(nivel)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filtroNivel === nivel
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-orange-400'
            }`}
          >
            {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
          </button>
        ))}
      </div>

      {/* Total de reportes */}
      <p className="text-sm text-gray-500 mb-4">
        Mostrando <span className="font-bold text-orange-600">{reportesFiltrados.length}</span> reportes
      </p>

      {/* Lista de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportesFiltrados.map(reporte => (
          <ReporteIncendioCard
            key={reporte.id}
            reporte={reporte}
            onAtendido={handleAtendido}
          />
        ))}
      </div>
    </div>
  );
}