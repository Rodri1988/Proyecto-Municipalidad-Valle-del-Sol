import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/usuariosPrueba';

export default function Layout({ children, title }) {
  const { auth, logout, esAdmin, esOperador } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link to="/inicio" className="font-bold text-lg tracking-tight">
            Valle del Sol · SIGI
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link to="/inicio" className="hover:text-orange-300">Inicio</Link>
            <Link to="/actividades" className="hover:text-orange-300">Actividades</Link>
            <Link to="/empleos" className="hover:text-orange-300">Empleos</Link>
            {auth?.rol === ROLES.CIUDADANO && (
              <>
                <Link to="/mis-reportes" className="hover:text-orange-300">Mis reportes</Link>
                <Link to="/nuevo-reporte" className="hover:text-orange-300">Reportar</Link>
              </>
            )}
            {(esOperador || esAdmin) && (
              <>
                <Link to="/dashboard" className="hover:text-orange-300">Dashboard</Link>
                <Link to="/reportes" className="hover:text-orange-300">Cola reportes</Link>
              </>
            )}
            {(esOperador || esAdmin || auth?.rol === ROLES.EQUIPO_EMERGENCIA) && (
              <Link to="/emergencias" className="hover:text-orange-300">Emergencias</Link>
            )}
            {esAdmin && (
              <Link to="/usuarios" className="hover:text-orange-300">Usuarios</Link>
            )}
            <Link to="/perfil" className="hover:text-orange-300">Perfil</Link>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-300 hidden sm:inline">{auth?.email}</span>
            <span className="bg-orange-600/80 px-2 py-0.5 rounded text-xs font-bold">{auth?.rol}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-orange-300 hover:text-white font-medium"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {title && <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
