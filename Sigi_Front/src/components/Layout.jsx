import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ROLES_EQUIPO,
  puedeReportar,
  esOperador,
  esAdmin,
  CONFIG_EQUIPO,
} from '../constants/usuariosPrueba';

export default function Layout({ children, title }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const rol = auth?.rol;
  const esEquipo = ROLES_EQUIPO.includes(rol);
  const configEquipo = CONFIG_EQUIPO[rol];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = 'hover:text-orange-300 transition whitespace-nowrap';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
      <header className="bg-slate-900/95 backdrop-blur text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link to={esEquipo ? '/panel-equipo' : '/inicio'} className="font-bold text-lg tracking-tight shrink-0">
              {esEquipo && configEquipo ? (
                <span>{configEquipo.icono} Valle del Sol · SIGI</span>
              ) : (
                'Valle del Sol · SIGI'
              )}
            </Link>

            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {!esEquipo && <Link to="/inicio" className={linkClass}>Inicio</Link>}
              <Link to="/actividades" className={linkClass}>Actividades</Link>
              <Link to="/empleos" className={linkClass}>Empleos</Link>

              {puedeReportar(rol) && (
                <>
                  <Link to="/mis-reportes" className={linkClass}>Mis reportes</Link>
                  <Link to="/nuevo-reporte" className={linkClass}>Reportar</Link>
                </>
              )}

              {esEquipo && (
                <Link to="/panel-equipo" className={linkClass}>Panel</Link>
              )}

              {(esOperador(rol) || esAdmin(rol)) && (
                <>
                  <Link to="/dashboard" className={linkClass}>Dashboard</Link>
                  <Link to="/reportes" className={linkClass}>Cola reportes</Link>
                </>
              )}

              {(esOperador(rol) || esAdmin(rol) || esEquipo) && (
                <Link to="/emergencias" className={linkClass}>Emergencias</Link>
              )}

              {esAdmin(rol) && (
                <Link to="/usuarios" className={linkClass}>Usuarios</Link>
              )}

              <Link to="/perfil" className={linkClass}>Perfil</Link>
            </nav>

            <div className="flex items-center gap-3 text-sm shrink-0">
              <span className="text-slate-300 hidden md:inline truncate max-w-[160px]">{auth?.email}</span>
              <span className="bg-orange-600/90 px-2.5 py-0.5 rounded-full text-xs font-bold">{rol}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-orange-300 hover:text-white font-semibold"
              >
                Salir
              </button>
            </div>
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
