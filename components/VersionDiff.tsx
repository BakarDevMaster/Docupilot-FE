/**
 * Version Diff Component
 * Displays side-by-side comparison of two document versions
 */

interface VersionDiffProps {
  fromContent: string;
  toContent: string;
  fromVersion: number;
  toVersion: number;
}

export default function VersionDiff({
  fromContent,
  toContent,
  fromVersion,
  toVersion,
}: VersionDiffProps) {
  // Simple line-by-line comparison
  const fromLines = fromContent.split('\n');
  const toLines = toContent.split('\n');
  const maxLines = Math.max(fromLines.length, toLines.length);

  // Simple diff highlighting (can be enhanced with a proper diff library)
  const getLineClass = (lineIndex: number, side: 'from' | 'to') => {
    if (side === 'from') {
      if (lineIndex >= fromLines.length) return 'bg-red-50 text-red-800'; // Removed
      if (lineIndex >= toLines.length || fromLines[lineIndex] !== toLines[lineIndex]) {
        return 'bg-amber-50 text-amber-800'; // Changed
      }
      return 'bg-slate-50 text-slate-700'; // Unchanged
    } else {
      if (lineIndex >= toLines.length) return 'bg-emerald-50 text-emerald-800'; // Added
      if (lineIndex >= fromLines.length || fromLines[lineIndex] !== toLines[lineIndex]) {
        return 'bg-emerald-50 text-emerald-800'; // Changed/Added
      }
      return 'bg-slate-50 text-slate-700'; // Unchanged
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-sm font-semibold text-slate-900">From Version</h3>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
            v{fromVersion}
          </span>
        </div>
        <div className="space-y-1 text-sm text-slate-800 max-h-[600px] overflow-y-auto">
          {fromLines.length === 0 ? (
            <div className="rounded-md bg-slate-50 px-3 py-2 font-mono text-xs text-slate-500">
              (empty)
            </div>
          ) : (
            fromLines.map((line, idx) => (
              <div
                key={idx}
                className={`rounded-md px-3 py-1 font-mono text-xs ${getLineClass(idx, 'from')}`}
              >
                {line || '\u00A0'} {/* Non-breaking space for empty lines */}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-sm font-semibold text-slate-900">To Version</h3>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
            v{toVersion}
          </span>
        </div>
        <div className="space-y-1 text-sm text-slate-800 max-h-[600px] overflow-y-auto">
          {toLines.length === 0 ? (
            <div className="rounded-md bg-slate-50 px-3 py-2 font-mono text-xs text-slate-500">
              (empty)
            </div>
          ) : (
            toLines.map((line, idx) => (
              <div
                key={idx}
                className={`rounded-md px-3 py-1 font-mono text-xs ${getLineClass(idx, 'to')}`}
              >
                {line || '\u00A0'} {/* Non-breaking space for empty lines */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

