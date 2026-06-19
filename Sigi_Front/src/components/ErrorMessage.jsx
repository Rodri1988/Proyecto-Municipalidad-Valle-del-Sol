import MaterialSymbol from './MaterialSymbol';
import { toApiError } from '../utils/apiError';

export default function ErrorMessage({ message, error, onRetry, onDismiss }) {
  const info = toApiError(error ?? message);
  if (!info?.message?.trim()) return null;

  return (
    <div
      role="alert"
      className="mb-4 rounded-2xl border border-red-200 bg-red-50/90 shadow-sm overflow-hidden"
    >
      <div className="flex gap-3 p-4">
        <div className="shrink-0 mt-0.5">
          <MaterialSymbol icon="error" className="text-2xl text-red-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-red-900">{info.title}</p>
              <p className="mt-1 text-sm text-red-800">{info.message}</p>
            </div>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="shrink-0 text-red-400 hover:text-red-700 transition"
                aria-label="Cerrar aviso de error"
              >
                <MaterialSymbol icon="close" className="text-xl" />
              </button>
            )}
          </div>

          {info.cause && (
            <p className="mt-2 text-sm text-red-700">
              <span className="font-semibold">Causa probable: </span>
              {info.cause}
            </p>
          )}

          {info.details?.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-red-800 list-disc list-inside">
              {info.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          )}

          {(info.status || info.path) && (
            <p className="mt-3 text-xs text-red-500/90">
              {info.status && <span>Código {info.status}</span>}
              {info.status && info.path && <span> · </span>}
              {info.path && <span>{info.path}</span>}
            </p>
          )}

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-red-700 underline hover:no-underline"
            >
              <MaterialSymbol icon="refresh" className="text-base" />
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
