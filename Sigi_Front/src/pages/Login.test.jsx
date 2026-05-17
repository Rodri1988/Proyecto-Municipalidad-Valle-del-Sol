import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';
import * as authService from '../services/authService';

jest.mock('../services/authService');

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('permite mostrar y ocultar la contraseña', () => {
    renderLogin();
    const passwordInput = document.getElementById('password');
    const toggleBtn = screen.getByLabelText(/mostrar contraseña/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('no muestra lista de usuarios de prueba', () => {
    renderLogin();
    expect(screen.queryByText(/Usuarios de prueba/i)).not.toBeInTheDocument();
  });

  it('llama al API de login al enviar', async () => {
    authService.login.mockResolvedValue({
      token: 'jwt-test',
      rol: 'CIUDADANO',
      usuarioId: 1,
      email: 'hawk.durant@test.com',
    });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'hawk.durant@test.com' },
    });
    fireEvent.change(document.getElementById('password'), {
      target: { value: 'secreta123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('hawk.durant@test.com', 'secreta123');
    });
  });
});
