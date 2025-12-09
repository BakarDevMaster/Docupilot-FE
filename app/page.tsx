export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase text-indigo-600">DocuPilot</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          AI Technical Documentation Workspace
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Generate, audit, and maintain documentation with multi-step agents,
          embeddings, and version history.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/dashboard"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Go to Dashboard
          </a>
          <a
            href="/documents"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Browse Documents
          </a>
        </div>
      </div>
    </div>
  );
}
