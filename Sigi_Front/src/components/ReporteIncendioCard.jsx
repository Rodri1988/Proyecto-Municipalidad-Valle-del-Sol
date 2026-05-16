import { useState } from 'react';

export default function ReporteIncendioCard({ reporte, onAtendido }) {
  const [atendido, setAtendido] = useState(false);

  const handleAtendido = () => {
    setAtendido(true);
    onAtendido(reporte.id);
  };

  return (
    <div className={`border rounded-xl p-4 shadow-md transition-all ${
      atendido ? 'bg-gray-100 opacity-60' : 'bg-white'
    }`}>
      
      {/* Nivel de riesgo */}
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
        reporte.nivelRiesgo === 'crítico' ? 'bg-red-100 text-red-700' :
        reporte.nivelRiesgo === 'alto'    ? 'bg-orange-100 text-orange-700' :
        'bg-yellow-100 text-yellow-700'
      }`}>
        {reporte.nivelRiesgo.toUpperCase()}
      </span>

      <h3 className="text-lg font-bold text-gray-800 mt-2">{reporte.sector}</h3>
      <p className="text-sm text-gray-500">Fuente: {reporte.fuente}</p>
      <p className="text-sm text-gray-500">Hora: {reporte.hora}</p>

      <button
        onClick={handleAtendido}
        disabled={atendido}
        className="mt-4 w-full py-2 rounded-lg text-sm font-bold text-white transition-all
          bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {atendido ? '✓ Atendido' : 'Marcar como Atendido'}
      </button>
    </div>
  );
}