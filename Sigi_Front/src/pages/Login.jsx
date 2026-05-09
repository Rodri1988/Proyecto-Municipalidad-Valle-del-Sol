import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulación de llamada a la API
    setTimeout(() => {
      setIsLoading(false);
      console.log("Login simulado exitoso");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Sección Izquierda: Branding (Oculta en móviles) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-600/20 mix-blend-multiply" />
        <div className="relative z-10 text-center px-8 text-white">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Municipalidad<br/>Valle del Sol</h1>
          <p className="text-xl text-slate-200">Plataforma de Gestión y Prevención de Incendios</p>
        </div>
      </div>

      {/* Sección Derecha: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Bienvenido</h2>
            <p className="text-gray-500">Ingresa tus credenciales para acceder al panel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico (o RUT)
              </label>
              <input
                id="email"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="operador@valledelsol.cl"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Recordarme
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}