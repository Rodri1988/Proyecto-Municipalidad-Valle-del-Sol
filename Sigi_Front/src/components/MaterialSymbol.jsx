export default function MaterialSymbol({ icon, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} aria-hidden="true">
      {icon}
    </span>
  );
}