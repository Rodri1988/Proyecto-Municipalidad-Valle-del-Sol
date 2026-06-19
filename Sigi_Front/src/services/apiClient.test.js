import {
  getStoredAuth,
  setStoredAuth,
  apiFetch,
  apiUpload,
  mediaUrl,
} from './apiClient';
import { API_BASE_URL } from '../config/api';

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('getStoredAuth', () => {
    it('debe retornar null si no hay auth guardado', () => {
      const result = getStoredAuth();
      expect(result).toBeNull();
    });

    it('debe retornar auth si está guardado', () => {
      const auth = {
        token: 'token_123',
        email: 'user@test.com',
        rol: 'CIUDADANO',
      };
      localStorage.setItem('sigi_auth', JSON.stringify(auth));

      const result = getStoredAuth();
      expect(result).toEqual(auth);
    });

    it('debe retornar null si hay JSON inválido', () => {
      localStorage.setItem('sigi_auth', 'invalid json {]');
      const result = getStoredAuth();
      expect(result).toBeNull();
    });
  });

  describe('setStoredAuth', () => {
    it('debe guardar auth en localStorage', () => {
      const auth = {
        token: 'token_456',
        email: 'admin@test.com',
      };

      setStoredAuth(auth);

      const stored = JSON.parse(localStorage.getItem('sigi_auth'));
      expect(stored).toEqual(auth);
    });

    it('debe limpiar auth si se pasa null', () => {
      localStorage.setItem('sigi_auth', '{}');
      setStoredAuth(null);

      expect(localStorage.getItem('sigi_auth')).toBeNull();
    });
  });

  describe('apiFetch', () => {
    it('debe hacer GET request sin token', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ id: 1, nombre: 'Test' }),
      });

      const result = await apiFetch('/api/datos', { skipAuth: true });

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/api/datos`, {
        skipAuth: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(result).toEqual({ id: 1, nombre: 'Test' });
    });

    it('debe incluir token en Authorization header', async () => {
      const auth = { token: 'bearer_token_xyz', email: 'user@test.com' };
      localStorage.setItem('sigi_auth', JSON.stringify(auth));

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
      });

      await apiFetch('/api/protected');

      const callArgs = global.fetch.mock.calls[0];
      expect(callArgs[1].headers.Authorization).toBe('Bearer bearer_token_xyz');
    });

    it('debe retornar null para status 204', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        text: async () => '',
      });

      const result = await apiFetch('/api/delete', { method: 'DELETE' });

      expect(result).toBeNull();
    });

    it('debe parsear response text vacío como null', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => '',
      });

      const result = await apiFetch('/api/empty');

      expect(result).toBeNull();
    });

    it('debe lanzar error si response no es ok con mensaje personalizado', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => JSON.stringify({ message: 'Usuario no encontrado' }),
      });

      await expect(apiFetch('/api/user/999')).rejects.toThrow(
        'Usuario no encontrado'
      );
    });

    it('debe usar label por defecto si no puede parsear error response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => '',
      });

      await expect(apiFetch('/auth/login')).rejects.toThrow(
        'contraseña'
      );
    });

    it('debe usar label "Error XXX" si no puede parsear error response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => '',
      });

      await expect(apiFetch('/api/error')).rejects.toThrow(
        'servidor'
      );
    });

    it('debe merging custom headers', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => '{}',
      });

      await apiFetch('/api/data', {
        headers: { 'X-Custom': 'value' },
        skipAuth: true,
      });

      const callArgs = global.fetch.mock.calls[0];
      expect(callArgs[1].headers['Content-Type']).toBe('application/json');
      expect(callArgs[1].headers['X-Custom']).toBe('value');
    });
  });

  describe('apiUpload', () => {
    it('debe hacer POST multipart sin Content-Type', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ id: 99, url: '/media/99' }),
      });

      const formData = new FormData();
      formData.append('file', new Blob(['content']), 'file.jpg');

      const result = await apiUpload('/api/media/upload', formData);

      const callArgs = global.fetch.mock.calls[0];
      expect(callArgs[0]).toBe(`${API_BASE_URL}/api/media/upload`);
      expect(callArgs[1].method).toBe('POST');
      expect(callArgs[1].body).toEqual(formData);
      expect(callArgs[1].headers['Content-Type']).toBeUndefined();

      expect(result).toEqual({ id: 99, url: '/media/99' });
    });

    it('debe incluir token en apiUpload', async () => {
      const auth = { token: 'upload_token' };
      localStorage.setItem('sigi_auth', JSON.stringify(auth));

      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'null',
      });

      const formData = new FormData();
      await apiUpload('/api/media/upload', formData);

      const callArgs = global.fetch.mock.calls[0];
      expect(callArgs[1].headers.Authorization).toBe('Bearer upload_token');
    });

    it('debe manejar error en apiUpload', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ message: 'Archivo inválido' }),
      });

      const formData = new FormData();

      await expect(apiUpload('/api/media/upload', formData)).rejects.toThrow(
        'Archivo inválido'
      );
    });
  });

  describe('mediaUrl', () => {
    it('debe retornar null si path es null', () => {
      expect(mediaUrl(null)).toBeNull();
    });

    it('debe retornar path si comienza con http', () => {
      const url = 'https://external.com/image.jpg';
      expect(mediaUrl(url)).toBe(url);
    });

    it('debe prefixar URL base si es ruta local', () => {
      const result = mediaUrl('/api/media/123/archivo');
      expect(result).toBe(`${API_BASE_URL}/api/media/123/archivo`);
    });
  });
});
