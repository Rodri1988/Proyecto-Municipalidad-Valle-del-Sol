import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

describe('Register', () => {
  it('permite mostrar y ocultar la contraseña', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    const passwordInput = screen.getByLabelText(/^contraseña$/i);
    const toggleBtn = screen.getByLabelText(/mostrar contraseña/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('valida que las contraseñas coincidan', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/^apellido$/i), { target: { value: 'López' } });
    fireEvent.change(screen.getByLabelText(/^rut$/i), { target: { value: '1-9' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'a@test.com' } });
    fireEvent.change(document.getElementById('password'), { target: { value: 'abc123' } });
    fireEvent.change(document.getElementById('confirmPassword'), { target: { value: 'otra' } });
    fireEvent.submit(screen.getByRole('button', { name: /crear cuenta/i }).closest('form'));
    expect(screen.getByText(/no coinciden/i)).toBeInTheDocument();
  });
});
