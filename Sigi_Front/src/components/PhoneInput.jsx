import {
  DEFAULT_PHONE_COUNTRY,
  PHONE_COUNTRIES,
  PHONE_TYPES,
  getCountryByCode,
  getPhoneDigitLength,
  getPhonePlaceholder,
  sanitizePhoneDigits,
} from '../constants/phoneCountries';

export default function PhoneInput({
  id = 'telefono',
  label = 'Teléfono',
  countryCode = DEFAULT_PHONE_COUNTRY,
  type = PHONE_TYPES.mobile.key,
  digits = '',
  onCountryChange,
  onTypeChange,
  onDigitsChange,
  required = false,
  error = null,
  inputClassName = 'w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none',
  selectClassName = 'px-3 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white text-sm',
}) {
  const country = getCountryByCode(countryCode);
  const digitLength = getPhoneDigitLength(countryCode, type);
  const typeLabel = type === PHONE_TYPES.landline.key ? 'fijo' : 'celular';
  const placeholder = getPhonePlaceholder(countryCode, type);
  const progress = digits.length;

  const handleCountryChange = (e) => {
    const next = e.target.value;
    onCountryChange?.(next);
    onDigitsChange?.('');
  };

  const handleTypeChange = (e) => {
    onTypeChange?.(e.target.value);
    onDigitsChange?.('');
  };

  const handleDigitsChange = (e) => {
    onDigitsChange?.(sanitizePhoneDigits(e.target.value, digitLength));
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {!required && <span className="text-gray-400 font-normal"> (opcional)</span>}
      </label>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <select
            id={`${id}-pais`}
            aria-label="País del teléfono"
            value={countryCode}
            onChange={handleCountryChange}
            className={selectClassName}
          >
            {PHONE_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dial})
              </option>
            ))}
          </select>

          <select
            id={`${id}-tipo`}
            aria-label="Tipo de teléfono"
            value={type}
            onChange={handleTypeChange}
            className={selectClassName}
          >
            <option value={PHONE_TYPES.mobile.key}>{PHONE_TYPES.mobile.label}</option>
            <option value={PHONE_TYPES.landline.key}>{PHONE_TYPES.landline.label}</option>
          </select>
        </div>

        <div className="flex gap-2">
          <span
            className="inline-flex items-center px-3 py-2 border rounded-xl bg-slate-50 text-sm text-slate-700 shrink-0"
            aria-hidden
          >
            {country.dial}
          </span>
          <input
            id={id}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required={required}
            value={digits}
            onChange={handleDigitsChange}
            placeholder={placeholder}
            maxLength={digitLength}
            minLength={required ? digitLength : undefined}
            aria-describedby={`${id}-hint`}
            className={inputClassName}
          />
        </div>
      </div>

      <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">
        {country.name}: {typeLabel} de exactamente {digitLength} dígitos (sin espacios ni guiones).
        {digits ? ` · ${progress}/${digitLength}` : ''}
      </p>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
