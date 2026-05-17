import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USUARIOS_PRUEBA } from '../constants/usuariosPrueba';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);
    try {
      const session = await login(email.trim(), password);
      navigate(rutaInicioPorSesion(session));
    } catch {
      /* error en contexto */
    } finally {
      setIsLoading(false);
    }
  };

  const usarPrueba = (u) => {
    setEmail(u.email);
    setPassword(u.password);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-600/20 mix-blend-multiply" />
        <div className="relative z-10 text-center px-8 text-white">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Municipalidad
            <br />
            Valle del Sol
          </h1>
          <p className="text-xl text-slate-200">Gestión y prevención de emergencias</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Bienvenido</h2>
            <p className="text-gray-500">Conectado al API Gateway SIGI (puerto 8080)</p>
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="hawk.durant@test.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-70"
            >
              {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <section className="mt-6 border-t pt-4">
            <p className="text-xs text-gray-500 mb-2 font-medium">Usuarios de prueba (grupo):</p>
            <div className="flex flex-col gap-2">
              {USUARIOS_PRUEBA.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => usarPrueba(u)}
                  className="text-left text-xs px-3 py-2 rounded-lg border hover:border-orange-400 hover:bg-orange-50"
                >
                  <span className="font-bold">{u.nombre} {u.apellido}</span>
                  <span className="text-gray-500"> — {u.rol}</span>
                </button>
              ))}
            </div>
          </section>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-medium text-orange-600 hover:text-orange-500">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function rutaInicioPorSesion(session) {
  const rol = session.rol;
  if (rol === 'ADMIN' || rol === 'OPERADOR_MUNICIPAL') return '/dashboard';
  if (rol === 'EQUIPO_EMERGENCIA') return '/emergencias';
  return '/inicio';
}
