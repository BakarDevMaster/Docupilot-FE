const navItems = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { key: "documents", label: "Documents", href: "/documents", icon: "📄" },
  { key: "versions", label: "Versions", href: "/versions", icon: "🧾" },
  { key: "embeddings", label: "Embeddings", href: "#", icon: "🧠" },
];

export default function Sidebar({ active = "dashboard", mobileOpen = false, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 h-full w-64 flex-col border-r border-slate-200 bg-white shadow-lg transition-transform duration-200 md:static md:flex ${
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
            DP
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">DocuPilot</p>
            <p className="text-xs text-slate-500">AI Docs Workspace</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
          aria-label="Close menu"
        >
          Close
        </button>
      </div>
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
          DP
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">DocuPilot</p>
          <p className="text-xs text-slate-500">AI Docs Workspace</p>
        </div>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const isActive = item.key === active;
          return (
            <a
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="px-4 pb-4">
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 shadow-sm">
          <p className="text-xs font-semibold text-slate-900">
            Agent Status
          </p>
          <p className="text-xs text-slate-500">Generator · Maintenance</p>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">
              Ready
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">
              Idle
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

