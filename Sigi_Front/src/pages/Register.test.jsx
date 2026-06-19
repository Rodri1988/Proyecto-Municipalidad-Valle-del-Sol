import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import * as authService from '../services/authService';
import * as mediaService from '../services/mediaService';

jest.mock('../services/authService');
jest.mock('../services/mediaService');

describe('Register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
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

  it('valida que se requiera certificado de residencia', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: 'Carlos' } });
    fireEvent.change(screen.getByLabelText(/^apellido$/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/^rut$/i), { target: { value: '1-9' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'c@test.com' } });
    fireEvent.change(document.getElementById('password'), { target: { value: 'pass123' } });
    fireEvent.change(document.getElementById('confirmPassword'), { target: { value: 'pass123' } });
    
    fireEvent.submit(screen.getByRole('button', { name: /crear cuenta/i }).closest('form'));
    expect(screen.getByText(/debes adjuntar/i)).toBeInTheDocument();
  });

  it('registra usuario exitosamente', async () => {
    mediaService.subirImagen.mockResolvedValue({ id: 123 });
    authService.registro.mockResolvedValue({ id: 1, email: 'new@test.com' });

    const { container } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/^apellido$/i), { target: { value: 'González' } });
    fireEvent.change(screen.getByLabelText(/^rut$/i), { target: { value: '12.345.678-9' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'juan@test.com' } });
    fireEvent.change(document.getElementById('telefono'), { target: { value: '912345678' } });
    fireEvent.change(document.getElementById('password'), { target: { value: 'secure123' } });
    fireEvent.change(document.getElementById('confirmPassword'), { target: { value: 'secure123' } });

    // archivo de prueba en el formulario
    const certInput = screen.getByLabelText(/certificado de residencia/i);
    const file = new File(['pdf content'], 'cert.pdf', { type: 'application/pdf' });
    Object.defineProperty(certInput, 'files', {
      value: [file],
      writable: false,
    });
    fireEvent.change(certInput);

    fireEvent.submit(screen.getByRole('button', { name: /crear cuenta/i }).closest('form'));

    await waitFor(() => {
      expect(mediaService.subirImagen).toHaveBeenCalledWith(file, 'CERTIFICADO');
    });

    await waitFor(() => {
      expect(authService.registro).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Juan',
          apellido: 'González',
          rut: '12.345.678-9',
          email: 'juan@test.com',
          telefono: '+56912345678',
          password: 'secure123',
          certificadoResidenciaMediaId: 123,
        })
      );
    });
  });

  it('muestra error del API', async () => {
    mediaService.subirImagen.mockResolvedValue({ id: 456 });
    authService.registro.mockRejectedValue(new Error('Email ya registrado'));

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: 'Rosa' } });
    fireEvent.change(screen.getByLabelText(/^apellido$/i), { target: { value: 'Torres' } });
    fireEvent.change(screen.getByLabelText(/^rut$/i), { target: { value: '9-9' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'rosa@test.com' } });
    fireEvent.change(document.getElementById('password'), { target: { value: 'pass123' } });
    fireEvent.change(document.getElementById('confirmPassword'), { target: { value: 'pass123' } });

    const certInput = screen.getByLabelText(/certificado de residencia/i);
    const file = new File(['content'], 'file.jpg', { type: 'image/jpeg' });
    Object.defineProperty(certInput, 'files', {
      value: [file],
      writable: false,
    });
    fireEvent.change(certInput);

    fireEvent.submit(screen.getByRole('button', { name: /crear cuenta/i }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/Email ya registrado/)).toBeInTheDocument();
    });
  });

  it('limpia errores cuando se selecciona certificado', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    // mostramos el error de certificado faltante
    fireEvent.change(screen.getByLabelText(/^nombre$/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/^apellido$/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/^rut$/i), { target: { value: '1-1' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 't@test.com' } });
    fireEvent.change(document.getElementById('password'), { target: { value: 'pass' } });
    fireEvent.change(document.getElementById('confirmPassword'), { target: { value: 'pass' } });
    fireEvent.submit(screen.getByRole('button', { name: /crear cuenta/i }).closest('form'));

    expect(screen.getByText(/debes adjuntar/i)).toBeInTheDocument();

    // al elegir archivo el aviso desaparece
    const certInput = screen.getByLabelText(/certificado de residencia/i);
    const file = new File(['content'], 'file.pdf', { type: 'application/pdf' });
    Object.defineProperty(certInput, 'files', {
      value: [file],
      writable: false,
    });
    fireEvent.change(certInput);

    expect(screen.queryByText(/debes adjuntar/i)).not.toBeInTheDocument();
  });
});
