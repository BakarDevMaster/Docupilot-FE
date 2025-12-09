"use client";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import VersionDiff from "../../components/VersionDiff";

const versionOptions = [
  { id: "v1.3.0", label: "v1.3.0 - Added rate limit docs" },
  { id: "v1.2.0", label: "v1.2.0 - Auth doc refresh" },
  { id: "v1.1.0", label: "v1.1.0 - Initial draft" },
];

export default function VersionsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar
          active="versions"
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <main className="flex-1">
          <Navbar
            title="Versions"
            subtitle="Compare and track history"
            onMenuClick={() => setMobileOpen(true)}
          />

          <div className="px-6 py-6 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="text-xs uppercase text-slate-500">Document</p>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Authentication Service
                  </h3>
                </div>
                <div className="ml-auto flex flex-wrap gap-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">From</span>
                    <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                      {versionOptions.map((v) => (
                        <option key={v.id}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">To</span>
                    <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                      {versionOptions.map((v) => (
                        <option key={v.id}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                  <button className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                    Compare
                  </button>
                </div>
              </div>
            </div>

            <VersionDiff />

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900">
                Version timeline
              </h4>
              <div className="mt-3 space-y-3">
                {versionOptions.map((v, idx) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {v.label}
                      </p>
                      <p className="text-xs text-slate-500">
                        Updated {idx === 0 ? "3h ago" : idx === 1 ? "1d ago" : "3d ago"}
                      </p>
                    </div>
                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

