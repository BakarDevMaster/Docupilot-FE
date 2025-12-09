export default function VersionDiff() {
  const left = [
    "- Added /api/auth/login endpoint",
    "- Requires email and password",
    "- Returns JWT bearer token",
  ];
  const right = [
    "- Added /api/auth/login endpoint",
    "- Requires email and password",
    "- Returns JWT bearer token",
    "- Added rate limit header doc",
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-sm font-semibold text-slate-900">Version A</h3>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
            v1.2.0
          </span>
        </div>
        <div className="space-y-2 text-sm text-slate-800">
          {left.map((line, idx) => (
            <div
              key={idx}
              className="rounded-md bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700"
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-sm font-semibold text-slate-900">Version B</h3>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
            v1.3.0
          </span>
        </div>
        <div className="space-y-2 text-sm text-slate-800">
          {right.map((line, idx) => (
            <div
              key={idx}
              className={`rounded-md px-3 py-2 font-mono text-xs ${
                idx === right.length - 1
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-slate-50 text-slate-700"
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

