export default function Editor() {
  const toolbar = ["Bold", "Italic", "Underline", "Bullet", "Numbered", "Save"];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center flex-wrap gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        {toolbar.map((item) => (
          <button
            key={item}
            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {item}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">Auto-save preview</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-semibold text-slate-900">Editor</h3>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
              Draft
            </span>
          </div>
          <textarea
            className="h-72 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-indigo-300"
            defaultValue={`# API Overview\n\n- Endpoint: /api/auth/login\n- Method: POST\n- Description: Issues JWT token after validating credentials.\n\n## Request\n- email (string)\n- password (string)\n\n## Response\n- access_token\n- token_type`}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-semibold text-slate-900">Preview</h3>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
              Synced
            </span>
          </div>
          <div className="prose prose-sm max-w-none text-slate-800">
            <p className="font-semibold text-slate-900">API Overview</p>
            <ul className="list-disc pl-4 text-sm">
              <li>Endpoint: /api/auth/login</li>
              <li>Method: POST</li>
              <li>Description: Issues JWT token after validating credentials.</li>
            </ul>
            <p className="mt-3 text-sm font-semibold">Request</p>
            <ul className="list-disc pl-4 text-sm">
              <li>email (string)</li>
              <li>password (string)</li>
            </ul>
            <p className="mt-3 text-sm font-semibold">Response</p>
            <ul className="list-disc pl-4 text-sm">
              <li>access_token</li>
              <li>token_type</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

