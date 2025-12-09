export default function AuthPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-3">
          <p className="text-xs uppercase text-indigo-600">DocuPilot</p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Sign in to your workspace
          </h1>
          <p className="text-sm text-slate-600">
            AI-driven documentation: generate, audit, and maintain with agents.
          </p>
          <div className="grid grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              Auto-generate docs
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              Version tracking
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              Embeddings search
            </div>
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500">Use your credentials to login</p>
          </div>
          <form className="mt-4 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Role (placeholder)
              </label>
              <select className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300">
                <option>Viewer</option>
                <option>Developer</option>
                <option>Technical Writer</option>
                <option>Admin</option>
              </select>
            </div>
            <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              Sign in
            </button>
            <button className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Continue with SSO (placeholder)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

