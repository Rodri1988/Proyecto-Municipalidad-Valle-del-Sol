import { parseApiError, toApiError, serializeApiError, ApiError } from './apiError';

describe('apiError', () => {
  it('parsea mensaje del backend cuando existe', () => {
    const err = parseApiError(
      400,
      '/auth/registro',
      JSON.stringify({ message: 'Email ya registrado' }),
    );
    expect(err.message).toBe('Email ya registrado');
    expect(err.title).toBe('Datos incorrectos');
  });

  it('extrae errores por campo de validación', () => {
    const err = parseApiError(
      400,
      '/auth/registro',
      JSON.stringify({
        message: 'Validación fallida',
        errors: [
          { field: 'email', defaultMessage: 'Formato de email inválido' },
          { field: 'password', defaultMessage: 'La contraseña debe tener al menos 6 caracteres' },
        ],
      }),
    );
    expect(err.details).toContain('Correo electrónico: Formato de email inválido');
    expect(err.details).toContain('Contraseña: La contraseña debe tener al menos 6 caracteres');
  });

  it('da pista útil cuando el cuerpo está vacío en subida de certificado', () => {
    const err = parseApiError(400, '/api/media/upload-registro', '');
    expect(err.message).toContain('certificado');
    expect(err.cause).toContain('archivo');
  });

  it('da pista útil para login sin cuerpo', () => {
    const err = parseApiError(401, '/auth/login', '');
    expect(err.message).toContain('contraseña');
  });

  it('toApiError convierte Error plano', () => {
    const plain = new Error('Fallo de red');
    const err = toApiError(plain);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toBe('Fallo de red');
  });

  it('no muestra error genérico para objetos vacíos', () => {
    expect(toApiError({})).toBeNull();
    expect(toApiError('')).toBeNull();
  });

  it('serializeApiError conserva datos al guardar en state', () => {
    const original = parseApiError(400, '/auth/registro', '');
    const stored = serializeApiError(original);
    expect(stored.message).toContain('cuenta');
    expect(stored.status).toBe(400);
    expect(stored.path).toBe('/auth/registro');

    const restored = toApiError(stored);
    expect(restored.message).toBe(stored.message);
    expect(restored.cause).toBe(stored.cause);
  });
});
