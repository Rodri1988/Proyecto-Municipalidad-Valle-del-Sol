import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rutaInicioPorRol } from '../constants/usuariosPrueba';
import AuthHero from '../components/AuthHero';

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
      navigate(rutaInicioPorRol(session.rol));
    } catch {
      /* error en contexto */
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <AuthHero>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
          Municipalidad
          <br />
          Valle del Sol
        </h1>
        <p className="text-lg sm:text-xl text-white/90 font-medium">
          Gestión y prevención de emergencias
        </p>
      </AuthHero>

      <div className="relative flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="lg:hidden absolute inset-0 -z-10" aria-hidden>
          <img src="/images/valle.jpeg" alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-7 sm:p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Bienvenido</h2>
            <p className="text-gray-500 text-sm">SIGI — Municipalidad Valle del Sol</p>
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none pr-16"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-500 hover:text-gray-700"
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
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-70 shadow-lg shadow-orange-200"
            >
              {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-orange-600 hover:text-orange-500">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
