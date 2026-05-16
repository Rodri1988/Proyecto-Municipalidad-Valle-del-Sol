import { useState } from 'react';

// Este componente representa el formulario de registro de nuevos usuarios para la plataforma.
import { Link } from 'react-router-dom';

export default function Register() {
  // Estado para el valor de la contraseña y su confirmación
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Estado para mostrar el error si las contraseñas no coinciden
  const [passwordError, setPasswordError] = useState("");
  // Estado para mostrar un spinner o deshabilitar el botón mientras se envía el formulario
  const [isLoading, setIsLoading] = useState(false);
  // Estado para mostrar o no la contraseña. Así el usuario puede ver lo que escribe si lo necesita.
  const [showPassword, setShowPassword] = useState(false);

  // Esta función se ejecuta cuando el usuario envía el formulario de registro.
  // Simulamos una llamada a la API y deshabilitamos el botón mientras tanto.
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validamos que las contraseñas coincidan antes de continuar
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    setPasswordError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Registro simulado exitoso");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/*
        Sección Izquierda: Branding
        Aquí mostramos el nombre de la plataforma y un mensaje motivacional.
      */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-800 justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-600/20 mix-blend-multiply" />
        <div className="relative z-10 text-center px-8 text-white">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Únete al Equipo</h1>
          <p className="text-lg text-slate-200">Plataforma de Prevención de Emergencias</p>
        </div>
      </div>

      {/*
        Sección Derecha: Formulario de Registro
        Aquí está el formulario principal donde el usuario ingresa sus datos para crear una cuenta.
      */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100 my-8">
          
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Crear Cuenta</h2>
            <p className="text-gray-500">Completa tus datos para solicitar acceso al sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
           
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo <span className="text-red-600">*</span>
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
                RUT <span className="text-red-600">*</span>
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
                Correo Electrónico <span className="text-red-600">*</span>
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
                 Contraseña <span className="text-red-600">*</span>
              </label>
              {/*
                Este bloque nos permite alternar la visibilidad de la contraseña.
                El botón a la derecha del input cambia el tipo de password a texto y viceversa.
              */}
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {/* Mostramos un ícono diferente según el estado de showPassword */}
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m2.062 2.675A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-2.062-2.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m2.675-2.062A9.956 9.956 0 0121 12c0-1.657-.336-3.236-.938-4.675" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a6 6 0 1112 0 6 6 0 01-12 0z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña <span className="text-red-600">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="••••••••"
              />
              {passwordError && (
                <p className="text-red-600 text-xs mt-1">{passwordError}</p>
              )}
            </div>
             {/*
              Solicitamos el certificado de residencia emitido por la junta vecinal de la comuna.
              Esto nos permite rastrear y validar a los usuarios, ayudando a prevenir el mal uso de la plataforma (por ejemplo, denuncias falsas).
            */}
            <div>
              <label htmlFor="certificadoResidencia" className="block text-sm font-medium text-gray-700 mb-1">
                Certificado de Residencia (emitido por la junta vecinal de la comuna) <span className="text-red-600">*</span>
              </label>
              <input
                id="certificadoResidencia"
                name="certificadoResidencia"
                type="file"
                accept="application/pdf,image/*"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Adjunta el certificado en formato PDF, JPG o PNG. Es obligatorio para validar tu residencia.</p>
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