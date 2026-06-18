import { login, registro, logout } from './authService';
import * as apiClient from './apiClient';

jest.mock('./apiClient');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe hacer login exitosamente', async () => {
      const mockResponse = {
        token: 'jwt_token_123',
        tipoToken: 'Bearer',
        email: 'usuario@test.com',
        rol: 'CIUDADANO',
        usuarioId: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        expiracionEnSegundos: 3600,
      };

      apiClient.apiFetch.mockResolvedValue(mockResponse);

      const result = await login('usuario@test.com', 'password123');

      expect(apiClient.apiFetch).toHaveBeenCalledWith('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'usuario@test.com', password: 'password123' }),
        skipAuth: true,
      });

      expect(result).toEqual(mockResponse);
      expect(apiClient.setStoredAuth).toHaveBeenCalledWith(mockResponse);
    });

    it('debe manejar error en login', async () => {
      const error = new Error('Credenciales incorrectas');
      apiClient.apiFetch.mockRejectedValue(error);

      await expect(login('usuario@test.com', 'password_incorrecta')).rejects.toThrow(
        'Credenciales incorrectas'
      );
    });
  });

  describe('registro', () => {
    it('debe registrar nuevo usuario', async () => {
      const payload = {
        nombre: 'Carlos',
        apellido: 'López',
        email: 'carlos@test.com',
        password: 'pass123',
        cedula: '12345678',
        tipo: 'CIUDADANO',
      };

      const mockResponse = {
        id: 42,
        email: 'carlos@test.com',
        nombre: 'Carlos',
      };

      apiClient.apiFetch.mockResolvedValue(mockResponse);

      const result = await registro(payload);

      expect(apiClient.apiFetch).toHaveBeenCalledWith('/auth/registro', {
        method: 'POST',
        body: JSON.stringify(payload),
        skipAuth: true,
      });

      expect(result).toEqual(mockResponse);
    });

    it('debe manejar error en registro', async () => {
      const error = new Error('Email ya registrado');
      apiClient.apiFetch.mockRejectedValue(error);

      await expect(
        registro({
          email: 'existe@test.com',
          password: 'pass123',
        })
      ).rejects.toThrow('Email ya registrado');
    });
  });

  describe('logout', () => {
    it('debe limpiar auth al hacer logout', () => {
      logout();
      expect(apiClient.setStoredAuth).toHaveBeenCalledWith(null);
    });
  });
});
