import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MaterialSymbol from './MaterialSymbol';
import {
  ROLES_EQUIPO,
  puedeReportar,
  esOperador,
  esAdmin,
  CONFIG_EQUIPO,
} from '../constants/usuariosPrueba';

export default function Layout({ children, title }) {
  const { auth, logout, nombreCompleto } = useAuth();
  const navigate = useNavigate();
  const rol = auth?.rol;
  const esEquipo = ROLES_EQUIPO.includes(rol);
  const configEquipo = CONFIG_EQUIPO[rol];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = 'hover:text-orange-300 transition whitespace-nowrap shrink-0 px-1 py-1';

  const navLinks = [];
  if (!esEquipo) navLinks.push({ to: '/inicio', label: 'Inicio' });
  navLinks.push({ to: '/actividades', label: 'Actividades' });
  navLinks.push({ to: '/empleos', label: 'Empleos' });
  if (puedeReportar(rol)) {
    navLinks.push({ to: '/mis-reportes', label: 'Mis reportes' });
    navLinks.push({ to: '/nuevo-reporte', label: 'Reportar' });
  }
  if (esEquipo) navLinks.push({ to: '/panel-equipo', label: 'Panel' });
  if (esOperador(rol) || esAdmin(rol)) {
    navLinks.push({ to: '/dashboard', label: 'Dashboard' });
    navLinks.push({ to: '/reportes', label: 'Cola reportes' });
  }
  if (esOperador(rol) || esAdmin(rol) || esEquipo) {
    navLinks.push({ to: '/emergencias', label: 'Emergencias' });
  }
  if (esAdmin(rol)) navLinks.push({ to: '/usuarios', label: 'Usuarios' });
  navLinks.push({ to: '/perfil', label: 'Perfil' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
      <header className="bg-slate-900/95 backdrop-blur text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Link
            to={esEquipo ? '/panel-equipo' : '/inicio'}
            className="font-bold text-lg tracking-tight shrink-0"
          >
            {esEquipo && configEquipo ? (
              <span className="inline-flex items-center gap-2">
                <MaterialSymbol icon={configEquipo.icono} className="text-[1.15rem]" />
                Valle del Sol · SIGI
              </span>
            ) : (
              'Valle del Sol · SIGI'
            )}
          </Link>

          <nav className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin text-sm max-w-full">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-sm shrink-0 flex-wrap">
            <span className="text-slate-300 truncate max-w-[140px]">
              {nombreCompleto ?? auth?.email}
            </span>
            <span className="bg-orange-600/90 px-2 py-0.5 rounded-full text-xs font-bold">{rol}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-orange-300 hover:text-white font-semibold"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {title && (
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-6 tracking-tight">{title}</h1>
        )}
        {children}
      </main>
    </div>
  );
}
