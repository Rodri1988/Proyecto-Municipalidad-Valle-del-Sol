export default function AuthHero({ children }) {
  return (
    <aside className="hidden lg:flex lg:w-1/2 justify-center items-center relative overflow-hidden">
      <img
        src="/images/valle.jpeg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-950/88 via-slate-900/78 to-orange-950/55"
        aria-hidden
      />
      <div className="relative z-10 text-center px-6 sm:px-10 text-white max-w-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
        {children}
      </div>
    </aside>
  );
}
