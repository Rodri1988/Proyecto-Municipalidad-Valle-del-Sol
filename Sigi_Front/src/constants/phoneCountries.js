export const PHONE_TYPES = {
  mobile: { key: 'mobile', label: 'Celular' },
  landline: { key: 'landline', label: 'Teléfono fijo' },
};

// Dígitos del número local, sin el prefijo internacional (+56, +54…)
export const PHONE_COUNTRIES = [
  {
    code: 'CL',
    name: 'Chile',
    dial: '+56',
    mobileDigits: 9,
    landlineDigits: 9,
    mobilePlaceholder: '912345678',
    landlinePlaceholder: '221234567',
  },
  {
    code: 'AR',
    name: 'Argentina',
    dial: '+54',
    mobileDigits: 10,
    landlineDigits: 10,
    mobilePlaceholder: '9112345678',
    landlinePlaceholder: '1112345678',
  },
  {
    code: 'PE',
    name: 'Perú',
    dial: '+51',
    mobileDigits: 9,
    landlineDigits: 8,
    mobilePlaceholder: '912345678',
    landlinePlaceholder: '12345678',
  },
  {
    code: 'BO',
    name: 'Bolivia',
    dial: '+591',
    mobileDigits: 8,
    landlineDigits: 8,
    mobilePlaceholder: '71234567',
    landlinePlaceholder: '21234567',
  },
  {
    code: 'CO',
    name: 'Colombia',
    dial: '+57',
    mobileDigits: 10,
    landlineDigits: 10,
    mobilePlaceholder: '3001234567',
    landlinePlaceholder: '6012345678',
  },
  {
    code: 'MX',
    name: 'México',
    dial: '+52',
    mobileDigits: 10,
    landlineDigits: 10,
    mobilePlaceholder: '5512345678',
    landlinePlaceholder: '5512345678',
  },
  {
    code: 'ES',
    name: 'España',
    dial: '+34',
    mobileDigits: 9,
    landlineDigits: 9,
    mobilePlaceholder: '612345678',
    landlinePlaceholder: '912345678',
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    dial: '+1',
    mobileDigits: 10,
    landlineDigits: 10,
    mobilePlaceholder: '2025550123',
    landlinePlaceholder: '2025550123',
  },
];

export const DEFAULT_PHONE_COUNTRY = 'CL';

export function getCountryByCode(code) {
  return PHONE_COUNTRIES.find((c) => c.code === code) ?? PHONE_COUNTRIES[0];
}

export function getPhoneDigitLength(countryCode, type) {
  const country = getCountryByCode(countryCode);
  return type === PHONE_TYPES.landline.key ? country.landlineDigits : country.mobileDigits;
}

export function getPhonePlaceholder(countryCode, type) {
  const country = getCountryByCode(countryCode);
  return type === PHONE_TYPES.landline.key ? country.landlinePlaceholder : country.mobilePlaceholder;
}

export function sanitizePhoneDigits(value, maxLength) {
  return String(value ?? '').replace(/\D/g, '').slice(0, maxLength);
}

export function formatPhoneNumber({ countryCode, type, digits }) {
  const trimmed = sanitizePhoneDigits(digits, getPhoneDigitLength(countryCode, type));
  if (!trimmed) return '';
  const { dial } = getCountryByCode(countryCode);
  return `${dial}${trimmed}`;
}

export function validatePhoneNumber({ countryCode, type, digits }, { required = false } = {}) {
  const country = getCountryByCode(countryCode);
  const expected = getPhoneDigitLength(countryCode, type);
  const clean = sanitizePhoneDigits(digits, expected);
  const typeLabel = type === PHONE_TYPES.landline.key ? 'fijo' : 'celular';

  if (!clean) {
    return required ? 'El teléfono es obligatorio' : null;
  }

  if (clean.length < expected) {
    return `Ingresa exactamente ${expected} dígitos para un ${typeLabel} de ${country.name} (faltan ${expected - clean.length}).`;
  }

  if (clean.length > expected) {
    return `El ${typeLabel} de ${country.name} debe tener exactamente ${expected} dígitos.`;
  }

  return null;
}
