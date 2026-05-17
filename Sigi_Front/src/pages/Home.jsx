import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getActividades } from '../services/municipioLocal';

export default function Home() {
  const { auth, esAdmin, esOperador } = useAuth();
  const actividades = getActividades().slice(0, 2);

  return (
    <Layout title={`Hola, ${auth?.email}`}>
      <p className="text-gray-600 mb-6">
        Plataforma SIGI — Municipalidad Valle del Sol. Reporta incendios, fugas, rutas dañadas y más.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <CardLink to="/nuevo-reporte" title="Reportar emergencia" desc="Foto, ubicación y detalles" />
        <CardLink to="/mis-reportes" title="Mis reportes" desc="Historial pendientes y resueltos" />
        <CardLink to="/empleos" title="Empleos" desc="Avisos y postulaciones" />
        <CardLink to="/actividades" title="Actividades" desc="Eventos municipales" />
        {(esOperador || esAdmin) && (
          <CardLink to="/dashboard" title="Dashboard" desc="Validación y mapa de incidentes" accent />
        )}
      </div>

      <h2 className="font-bold text-lg mb-3">Próximas actividades</h2>
      <ul className="space-y-2">
        {actividades.map((a) => (
          <li key={a.id} className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="font-semibold">{a.titulo}</p>
            <p className="text-sm text-gray-500">{a.fecha} · {a.lugar}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

function CardLink({ to, title, desc, accent }) {
  return (
    <Link
      to={to}
      className={`block p-5 rounded-xl border shadow-sm hover:shadow-md transition ${
        accent ? 'border-orange-400 bg-orange-50' : 'bg-white'
      }`}
    >
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </Link>
  );
}
