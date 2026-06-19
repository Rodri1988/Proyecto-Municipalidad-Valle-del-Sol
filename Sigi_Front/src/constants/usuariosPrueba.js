// Usuarios de demo — grupo Valle del Sol (Hawk, Emilio, Rodrigo)
export const USUARIOS_PRUEBA = [
  {
    id: 'hawk',
    nombre: 'Hawk',
    apellido: 'Durant',
    email: 'hawk.durant@test.com',
    password: 'secreta123',
    rut: '12.345.678-9',
    rol: 'CIUDADANO',
    descripcion: 'Residente — reporta emergencias y consulta avisos municipales',
  },
  {
    id: 'emilio',
    nombre: 'Emilio',
    apellido: 'Jaramillo',
    email: 'emilio.jaramillo@municipalidad.cl',
    password: 'operador123',
    rut: '11.222.333-4',
    rol: 'OPERADOR_MUNICIPAL',
    descripcion: 'Operador — valida reportes, asigna prioridad y gestiona emergencias',
  },
  {
    id: 'rodrigo',
    nombre: 'Rodrigo',
    apellido: 'Candia',
    email: 'rodrigo.candia@municipalidad.cl',
    password: 'admin123',
    rut: '18.765.432-1',
    rol: 'ADMIN',
    descripcion: 'Administrador — dashboard, usuarios y mapa de incidentes',
  },
  {
    id: 'carla',
    nombre: 'Carla',
    apellido: 'Méndez',
    email: 'brigada@municipalidad.cl',
    password: 'brigada123',
    rut: '14.555.666-7',
    rol: 'BRIGADISTA',
    descripcion: 'Brigada municipal — lee, clasifica y reporta emergencias',
  },
  {
    id: 'luis',
    nombre: 'Luis',
    apellido: 'Fuentes',
    email: 'bomberos@municipalidad.cl',
    password: 'bomberos123',
    rut: '15.666.777-8',
    rol: 'BOMBERO',
    descripcion: 'Cuerpo de bomberos — atención y clasificación en terreno',
  },
  {
    id: 'ana',
    nombre: 'Ana',
    apellido: 'Rojas',
    email: 'ambulancia@municipalidad.cl',
    password: 'ambulancia123',
    rut: '16.777.888-9',
    rol: 'AMBULANCIA',
    descripcion: 'SAMU municipal — lectura de reportes y derivación',
  },
  {
    id: 'pedro',
    nombre: 'Pedro',
    apellido: 'Silva',
    email: 'seguridad@municipalidad.cl',
    password: 'seguridad123',
    rut: '17.888.999-0',
    rol: 'SEGURIDAD_MUNICIPAL',
    descripcion: 'Seguridad municipal — presencia y coordinación con Carabineros',
  },
];

export const ROLES = {
  CIUDADANO: 'CIUDADANO',
  OPERADOR_MUNICIPAL: 'OPERADOR_MUNICIPAL',
  EQUIPO_EMERGENCIA: 'EQUIPO_EMERGENCIA',
  BRIGADISTA: 'BRIGADISTA',
  BOMBERO: 'BOMBERO',
  AMBULANCIA: 'AMBULANCIA',
  SEGURIDAD_MUNICIPAL: 'SEGURIDAD_MUNICIPAL',
  ADMIN: 'ADMIN',
};

export const ROLES_EQUIPO = [
  ROLES.EQUIPO_EMERGENCIA,
  ROLES.BRIGADISTA,
  ROLES.BOMBERO,
  ROLES.AMBULANCIA,
  ROLES.SEGURIDAD_MUNICIPAL,
];

export const ROLES_PUEDEN_REPORTAR = [
  ROLES.CIUDADANO,
  ROLES.OPERADOR_MUNICIPAL,
  ...ROLES_EQUIPO,
];

export const CONFIG_EQUIPO = {
  BRIGADISTA: {
    titulo: 'Brigada Municipal',
    subtitulo: 'Prevención y respuesta en terreno',
    color: 'emerald',
    icono: 'forest',
  },
  BOMBERO: {
    titulo: 'Cuerpo de Bomberos',
    subtitulo: 'Incendios y rescates',
    color: 'red',
    icono: 'local_fire_department',
  },
  AMBULANCIA: {
    titulo: 'SAMU Municipal',
    subtitulo: 'Atención prehospitalaria',
    color: 'sky',
    icono: 'medical_services',
  },
  SEGURIDAD_MUNICIPAL: {
    titulo: 'Seguridad Municipal',
    subtitulo: 'Orden público y coordinación',
    color: 'indigo',
    icono: 'shield',
  },
  EQUIPO_EMERGENCIA: {
    titulo: 'Equipo de Emergencia',
    subtitulo: 'Respuesta integral',
    color: 'amber',
    icono: 'bolt',
  },
};

export function esAdmin(rol) {
  return rol === ROLES.ADMIN;
}

export function esOperador(rol) {
  return rol === ROLES.OPERADOR_MUNICIPAL || rol === ROLES.ADMIN;
}

export function esEquipoEmergencia(rol) {
  return ROLES_EQUIPO.includes(rol) || esOperador(rol);
}

export function esEquipoSolo(rol) {
  return ROLES_EQUIPO.includes(rol);
}

export function esCiudadano(rol) {
  return rol === ROLES.CIUDADANO;
}

export function puedeReportar(rol) {
  return ROLES_PUEDEN_REPORTAR.includes(rol);
}

export function rutaInicioPorRol(rol) {
  if (esAdmin(rol) || rol === ROLES.OPERADOR_MUNICIPAL) return '/dashboard';
  if (esEquipoSolo(rol)) return '/panel-equipo';
  return '/inicio';
}
