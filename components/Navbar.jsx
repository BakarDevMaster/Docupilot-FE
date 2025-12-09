export default function Navbar({
  title = "DocuPilot",
  subtitle = "",
  onMenuClick,
}) {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 justify-between border-b border-slate-200 bg-white/80 px-4 md:px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Workspace
        </p>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="inline-flex md:hidden h-9 rounded-full border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          aria-label="Toggle menu"
        >
          Menu
        </button>
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 bg-white shadow-sm">
          <span className="text-slate-400 text-sm">⌘K</span>
          <input
            className="w-48 text-sm bg-transparent outline-none placeholder:text-slate-400"
            placeholder="Search docs"
          />
        </div>
        <button className="hidden sm:inline-flex h-9 rounded-full border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Theme
        </button>
        <button className="relative h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
          JP
        </button>
      </div>
    </header>
  );
}

