import {
  formatPhoneNumber,
  sanitizePhoneDigits,
  validatePhoneNumber,
  getPhoneDigitLength,
} from './phoneCountries';

describe('phoneCountries', () => {
  it('limita dígitos al máximo del país', () => {
    expect(sanitizePhoneDigits('91-234-567-890', 9)).toBe('912345678');
  });

  it('valida celular chileno de 9 dígitos', () => {
    expect(validatePhoneNumber({ countryCode: 'CL', type: 'mobile', digits: '912345678' })).toBeNull();
    expect(validatePhoneNumber({ countryCode: 'CL', type: 'mobile', digits: '91234567' })).toMatch(
      /exactamente 9/,
    );
  });

  it('formatea con prefijo internacional', () => {
    expect(
      formatPhoneNumber({ countryCode: 'CL', type: 'mobile', digits: '912345678' }),
    ).toBe('+56912345678');
  });

  it('usa longitudes distintas para fijo y celular en Perú', () => {
    expect(getPhoneDigitLength('PE', 'mobile')).toBe(9);
    expect(getPhoneDigitLength('PE', 'landline')).toBe(8);
  });
});
