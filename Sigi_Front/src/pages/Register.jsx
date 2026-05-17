import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registro } from '../services/authService';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    setPasswordError('');
    setApiError('');
    setIsLoading(true);
    try {
      await registro({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        rut: rut.trim(),
        email: email.trim(),
        password,
        telefono: telefono.trim() || undefined,
        rol: 'CIUDADANO',
      });
      navigate('/login', { state: { registered: email } });
    } catch (err) {
      setApiError(err.message ?? 'No se pudo registrar. ¿El email ya existe?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-800 justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-600/20 mix-blend-multiply" />
        <div className="relative z-10 text-center px-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Únete a Valle del Sol</h1>
          <p className="text-lg text-slate-200">Reporta emergencias de forma segura</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border my-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Crear cuenta</h2>
          <p className="text-gray-500 mb-6">Registro de residente (rol CIUDADANO)</p>

          {apiError && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{apiError}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" id="nombre" value={nombre} onChange={setNombre} required />
              <Field label="Apellido" id="apellido" value={apellido} onChange={setApellido} required />
            </div>
            <Field label="RUT" id="rut" value={rut} onChange={setRut} required placeholder="12.345.678-9" />
            <Field label="Email" id="email" type="email" value={email} onChange={setEmail} required />
            <Field label="Teléfono" id="telefono" value={telefono} onChange={setTelefono} />
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 text-gray-500"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>
            <Field
              label="Confirmar contraseña"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />
            {passwordError && <p className="text-red-600 text-xs">{passwordError}</p>}
            <div>
              <label htmlFor="cert" className="block text-sm font-medium text-gray-700 mb-1">
                Certificado de residencia (opcional en demo)
              </label>
              <input id="cert" type="file" accept="application/pdf,image/*" className="w-full text-sm" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-70"
            >
              {isLoading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm">
            <Link to="/login" className="text-orange-600 font-medium">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, id, type = 'text', value, onChange, required, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
      />
    </div>
  );
}
