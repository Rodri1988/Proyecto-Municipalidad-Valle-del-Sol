import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registro } from '../services/authService';
import { subirImagen } from '../services/mediaService';
import AuthHero from '../components/AuthHero';
import ErrorMessage from '../components/ErrorMessage';
import PhoneInput from '../components/PhoneInput';
import { serializeApiError } from '../utils/apiError';
import {
  DEFAULT_PHONE_COUNTRY,
  PHONE_TYPES,
  formatPhoneNumber,
  validatePhoneNumber,
} from '../constants/phoneCountries';

const MAX_CERT_MB = 10;
const CERT_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCountry, setPhoneCountry] = useState(DEFAULT_PHONE_COUNTRY);
  const [phoneType, setPhoneType] = useState(PHONE_TYPES.mobile.key);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [certificado, setCertificado] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [certError, setCertError] = useState('');
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    if (!certificado) {
      setCertError('Debes adjuntar tu certificado de residencia');
      return;
    }
    const fileError = validarCertificado(certificado);
    if (fileError) {
      setCertError(fileError);
      return;
    }
    setPasswordError('');
    setCertError('');
    const phoneValidation = validatePhoneNumber(
      { countryCode: phoneCountry, type: phoneType, digits: phoneDigits },
    );
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      return;
    }
    setPhoneError('');
    setApiError(null);
    setIsLoading(true);
    try {
      const media = await subirImagen(certificado, 'CERTIFICADO');
      await registro({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        rut: rut.trim(),
        email: email.trim(),
        password,
        telefono: formatPhoneNumber({
          countryCode: phoneCountry,
          type: phoneType,
          digits: phoneDigits,
        }) || undefined,
        certificadoResidenciaMediaId: media.id,
      });
      navigate('/login', { state: { registered: email } });
    } catch (err) {
      setApiError(serializeApiError(err));
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

      <div className="relative flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="lg:hidden absolute inset-0 -z-10" aria-hidden>
          <img src="/images/valle.jpeg" alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-7 sm:p-8 rounded-2xl shadow-2xl border border-white/20 my-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Crear cuenta</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Registro de residente — rol ciudadano asignado automáticamente
          </p>

          <ErrorMessage error={apiError} onDismiss={() => setApiError(null)} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nombre" id="nombre" value={nombre} onChange={setNombre} required />
              <Field label="Apellido" id="apellido" value={apellido} onChange={setApellido} required />
            </div>
            <Field
              label="RUT"
              id="rut"
              value={rut}
              onChange={setRut}
              required
              placeholder="123456789"
              hint="Ingresa tu RUT sin puntos ni guion (ejemplo: 123456789)."
            />
            <Field label="Email" id="email" type="email" value={email} onChange={setEmail} required />
            <PhoneInput
              id="telefono"
              label="Teléfono"
              countryCode={phoneCountry}
              type={phoneType}
              digits={phoneDigits}
              onCountryChange={setPhoneCountry}
              onTypeChange={setPhoneType}
              onDigitsChange={(value) => {
                setPhoneDigits(value);
                setPhoneError('');
              }}
              error={phoneError}
            />
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
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 text-gray-500 text-sm"
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
                Certificado de residencia <span className="text-red-600">*</span>
              </label>
              <input
                id="cert"
                type="file"
                required
                accept="application/pdf,image/*"
                className="w-full text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setCertificado(file);
                  setCertError(file ? validarCertificado(file) : '');
                  setApiError(null);
                }}
              />
              {certError && <p className="text-red-600 text-xs mt-1">{certError}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-70 shadow-lg"
            >
              {isLoading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm">
            <Link to="/login" className="text-orange-600 font-semibold">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function validarCertificado(file) {
  if (!file) return 'Debes adjuntar tu certificado de residencia';
  if (file.size > MAX_CERT_MB * 1024 * 1024) {
    return `El archivo supera ${MAX_CERT_MB} MB. Elige uno más liviano.`;
  }
  if (file.type && !CERT_TYPES.includes(file.type)) {
    return 'Formato no permitido. Usa PDF o imagen (JPG, PNG, WEBP).';
  }
  return '';
}

function Field({ label, id, type = 'text', value, onChange, required, placeholder, hint }) {
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
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
      />
      {hint && (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}
