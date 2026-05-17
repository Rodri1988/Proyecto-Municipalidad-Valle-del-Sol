export default function Spinner({ label = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="h-10 w-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      <p className="text-orange-600 font-semibold">{label}</p>
    </div>
  );
}
