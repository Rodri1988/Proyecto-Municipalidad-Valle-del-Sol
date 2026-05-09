import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulación de llamada a la API de registro
    setTimeout(() => {
      setIsLoading(false);
      console.log("Registro simulado exitoso");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Sección Izquierda: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-800 justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-600/20 mix-blend-multiply" />
        <div className="relative z-10 text-center px-8 text-white">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Únete al Equipo</h1>
          <p className="text-lg text-slate-200">Plataforma de Prevención de Emergencias</p>
        </div>
      </div>

      {/* Sección Derecha: Formulario de Registro */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100 my-8">
          
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Crear Cuenta</h2>
            <p className="text-gray-500">Completa tus datos para solicitar acceso al sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                id="fullName"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div>
              <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
                RUT
              </label>
              <input
                id="rut"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="12.345.678-9"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico Institucional
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="jperez@valledelsol.cl"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Registrando...' : 'Solicitar Acceso'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}