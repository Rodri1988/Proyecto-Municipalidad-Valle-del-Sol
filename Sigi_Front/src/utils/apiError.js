const STATUS_TITLES = {
  400: 'Datos incorrectos',
  401: 'Acceso denegado',
  403: 'Sin permiso',
  404: 'No encontrado',
  409: 'Conflicto',
  413: 'Archivo demasiado grande',
  422: 'Validación fallida',
  500: 'Error del servidor',
  502: 'Servicio no disponible',
  503: 'Servicio no disponible',
};

const FIELD_LABELS = {
  nombre: 'Nombre',
  apellido: 'Apellido',
  rut: 'RUT',
  email: 'Correo electrónico',
  password: 'Contraseña',
  telefono: 'Teléfono',
  certificadoResidenciaMediaId: 'Certificado de residencia',
  file: 'Archivo',
  tipo: 'Tipo de archivo',
  titulo: 'Título',
  descripcion: 'Descripción',
  direccion: 'Dirección',
  rol: 'Rol',
};

const PATH_HINTS = {
  '/api/media/upload-registro':
    'No se pudo subir el certificado. Usa PDF o imagen (JPG, PNG) de hasta 10 MB.',
  '/api/media/upload':
    'No se pudo subir la imagen. Verifica el formato y que no supere 10 MB.',
  '/auth/registro':
    'No se pudo crear la cuenta. Revisa los datos o prueba con otro correo/RUT.',
  '/auth/login': 'Correo o contraseña incorrectos. Verifica tus credenciales.',
};

export class ApiError extends Error {
  constructor({ message, status, title, cause, details = [], fields = {}, path, raw }) {
    super(message);
    this.name = 'ApiError';
    this.status = status ?? null;
    this.title = title ?? 'Ocurrió un error';
    this.cause = cause ?? null;
    this.details = details;
    this.fields = fields;
    this.path = path ?? null;
    this.raw = raw ?? null;
  }
}

export function toApiError(value, fallbackPath = null) {
  if (value == null || value === '') return null;

  if (value instanceof ApiError) return value;

  if (typeof value === 'object' && !Array.isArray(value)) {
    if (value.name === 'ApiError' || (typeof value.message === 'string' && value.message.trim())) {
      return new ApiError({
        message: value.message.trim(),
        status: value.status ?? null,
        title: value.title ?? STATUS_TITLES[value.status] ?? 'Ocurrió un error',
        cause: value.cause ?? null,
        details: Array.isArray(value.details) ? value.details : [],
        fields: value.fields ?? {},
        path: value.path ?? fallbackPath,
        raw: value.raw ?? null,
      });
    }
    return null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return new ApiError({ message: trimmed, title: 'Ocurrió un error' });
  }

  if (value instanceof Error) {
    const message = value.message?.trim();
    if (!message) return null;
    return new ApiError({
      message,
      status: value.status ?? null,
      title: value.title ?? STATUS_TITLES[value.status] ?? 'Ocurrió un error',
      cause: value.cause ?? null,
      details: value.details ?? [],
      fields: value.fields ?? {},
      path: value.path ?? fallbackPath,
      raw: value.raw ?? null,
    });
  }

  return null;
}

// Pasamos el error a objeto plano; React no guarda bien instancias Error
export function serializeApiError(value, fallbackPath = null) {
  const err = toApiError(value, fallbackPath);
  if (!err) return null;
  return {
    name: 'ApiError',
    message: err.message,
    status: err.status,
    title: err.title,
    cause: err.cause,
    details: err.details,
    fields: err.fields,
    path: err.path,
  };
}

export function parseApiError(status, path, bodyText) {
  const title = STATUS_TITLES[status] ?? `Error ${status}`;
  let body = null;

  if (bodyText?.trim()) {
    try {
      body = JSON.parse(bodyText);
    } catch {
      body = { message: bodyText.trim() };
    }
  }

  const fields = extractFieldErrors(body);
  const details = extractDetails(body, fields);
  const message = buildMessage({ status, path, body, fields, details });
  const cause = body?.message && body.message !== message ? body.message : inferCause({ status, path, body, fields });

  return new ApiError({
    message,
    status,
    title,
    cause,
    details,
    fields,
    path: body?.path ?? path ?? null,
    raw: body,
  });
}

function extractFieldErrors(body) {
  if (!body || typeof body !== 'object') return {};

  const fields = {};

  if (Array.isArray(body.errors)) {
    for (const item of body.errors) {
      if (typeof item === 'string') continue;
      const field = item.field ?? item.property ?? item.name;
      const msg = item.defaultMessage ?? item.message ?? item.reason;
      if (field && msg) fields[field] = msg;
    }
  }

  if (body.fieldErrors && typeof body.fieldErrors === 'object') {
    Object.assign(fields, body.fieldErrors);
  }

  if (body.violations && Array.isArray(body.violations)) {
    for (const v of body.violations) {
      const field = v.field ?? v.propertyPath;
      const msg = v.message;
      if (field && msg) fields[field] = msg;
    }
  }

  return fields;
}

function extractDetails(body, fields) {
  const details = [];
  if (!body || typeof body !== 'object') return details;

  if (Array.isArray(body.errors) && body.errors.every((e) => typeof e === 'string')) {
    details.push(...body.errors);
  }

  if (Array.isArray(body.details)) {
    details.push(...body.details.filter((d) => typeof d === 'string'));
  }

  for (const [field, msg] of Object.entries(fields)) {
    details.push(`${labelField(field)}: ${msg}`);
  }

  return [...new Set(details)];
}

function buildMessage({ status, path, body, fields, details }) {
  if (body?.message && typeof body.message === 'string' && body.message.trim()) {
    return body.message.trim();
  }

  if (details.length === 1) return details[0];

  if (details.length > 1) {
    return `Se encontraron ${details.length} problemas en los datos enviados.`;
  }

  if (body?.error && typeof body.error === 'string' && body.error !== 'Bad Request') {
    return body.error;
  }

  const hint = path ? PATH_HINTS[path] : null;
  if (hint) return hint;

  if (status === 400) return 'La solicitud contiene datos incorrectos o incompletos.';
  if (status === 401) return 'No se pudo verificar tu identidad. Inicia sesión de nuevo.';
  if (status === 403) return 'Tu cuenta no tiene permiso para realizar esta acción.';
  if (status === 404) return 'El recurso solicitado no existe o fue eliminado.';
  if (status === 413) return 'El archivo es demasiado grande. El límite es 10 MB.';
  if (status >= 500) return 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.';

  return `Error ${status}`;
}

function inferCause({ status, path, body, fields }) {
  if (Object.keys(fields).length > 0) {
    return 'Algunos campos no cumplen los requisitos del formulario.';
  }

  if (body?.error === 'Bad Request' && path?.includes('/media/')) {
    return 'El servidor rechazó el archivo enviado.';
  }

  if (path?.includes('/media/')) {
    return 'El servidor rechazó el archivo enviado.';
  }

  if (body?.error === 'Bad Request' && path?.includes('/auth/registro')) {
    return 'El email o RUT podrían estar registrados, o falta el certificado de residencia.';
  }

  if (status === 401 && path?.includes('/auth/login')) {
    return 'Las credenciales no coinciden con ninguna cuenta activa.';
  }

  if (body?.error && body.error !== body?.message) {
    return body.error;
  }

  return null;
}

export function labelField(field) {
  return FIELD_LABELS[field] ?? field;
}
