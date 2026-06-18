import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import MaterialSymbol from '../components/MaterialSymbol';
import { useAuth } from '../context/AuthContext';
import { getActividades } from '../services/municipioLocal';
import { puedeReportar, esOperador, esAdmin } from '../constants/usuariosPrueba';

export default function Home() {
  const { auth, esEquipoSolo, nombreCompleto } = useAuth();
  const actividades = getActividades().slice(0, 2);
  const saludo = nombreCompleto ?? auth?.nombre ?? 'vecino';

  return (
    <Layout title={`Hola, ${saludo}`}>
      <p className="text-slate-600 mb-8 max-w-2xl">
        Plataforma SIGI — Municipalidad Valle del Sol. Reporta incendios, fugas, rutas dañadas y más.
        La prioridad de tu reporte se calcula automáticamente según métricas del sistema.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {puedeReportar(auth?.rol) && (
          <>
            <CardLink to="/nuevo-reporte" title="Reportar emergencia" desc="Foto, ubicación y detalles" icon="emergency" />
            <CardLink to="/mis-reportes" title="Mis reportes" desc="Historial pendientes y resueltos" icon="assignment" />
          </>
        )}
        <CardLink to="/empleos" title="Empleos" desc="Avisos y postulaciones" icon="work" />
        <CardLink to="/actividades" title="Actividades" desc="Eventos municipales" icon="event" />
        {(esOperador(auth?.rol) || esAdmin(auth?.rol)) && (
          <CardLink to="/dashboard" title="Dashboard" desc="Validación y mapa de incidentes" accent icon="space_dashboard" />
        )}
        {esEquipoSolo && (
          <CardLink to="/panel-equipo" title="Panel de equipo" desc="Clasificar y atender reportes" accent icon="local_fire_department" />
        )}
      </div>

      <h2 className="font-bold text-lg mb-3 text-slate-800">Próximas actividades</h2>
      <ul className="grid sm:grid-cols-2 gap-3">
        {actividades.map((a) => (
          <li key={a.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <p className="font-semibold text-slate-900">{a.titulo}</p>
            <p className="text-sm text-slate-500">{a.fecha} · {a.lugar}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

function CardLink({ to, title, desc, accent, icon }) {
  return (
    <Link
      to={to}
      className={`block p-5 rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition ${
        accent
          ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50'
          : 'bg-white border-slate-200'
      }`}
    >
      <MaterialSymbol icon={icon} className="text-3xl text-slate-700" />
      <h3 className="font-bold text-slate-800 mt-2">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{desc}</p>
    </Link>
  );
}
