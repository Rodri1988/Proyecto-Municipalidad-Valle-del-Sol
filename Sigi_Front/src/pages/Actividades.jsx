import Layout from '../components/Layout';
import { getActividades } from '../services/municipioLocal';

export default function Actividades() {
  const actividades = getActividades();

  return (
    <Layout title="Actividades municipales">
      <p className="text-gray-600 mb-6">
        Información de eventos y capacitaciones de la Municipalidad Valle del Sol.
      </p>
      <ul className="space-y-4">
        {actividades.map((a) => (
          <li key={a.id} className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-lg">{a.titulo}</h3>
            <p className="text-orange-600 text-sm font-medium">{a.fecha} · {a.lugar}</p>
            <p className="text-gray-600 mt-2">{a.descripcion}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
