import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

describe('Login', () => {
  it('permite mostrar y ocultar la contraseña', () => {
    render(<Login />);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const toggleBtn = screen.getByLabelText(/mostrar contraseña/i);
    // Por defecto debe ser type password
    expect(passwordInput).toHaveAttribute('type', 'password');
    // Click para mostrar
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    // Click para ocultar
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('deshabilita el botón al enviar', () => {
    render(<Login />);
    const button = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.submit(screen.getByRole('form'));
    expect(button).toBeDisabled();
  });
});
