import { USUARIOS_PRUEBA, esAdmin, rutaInicioPorRol } from './usuariosPrueba';

describe('usuariosPrueba', () => {
  it('incluye a los tres integrantes del grupo', () => {
    const emails = USUARIOS_PRUEBA.map((u) => u.email);
    expect(emails).toContain('hawk.durant@test.com');
    expect(emails).toContain('emilio.jaramillo@municipalidad.cl');
    expect(emails).toContain('rodrigo.candia@municipalidad.cl');
  });

  it('Rodrigo Candia es ADMIN', () => {
    const rodrigo = USUARIOS_PRUEBA.find((u) => u.apellido === 'Candia');
    expect(esAdmin(rodrigo.rol)).toBe(true);
    expect(rutaInicioPorRol('ADMIN')).toBe('/dashboard');
  });
});
