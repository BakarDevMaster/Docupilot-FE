"use client";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Editor from "../../components/Editor";

const docs = [
  {
    id: "1",
    title: "Authentication Service",
    type: "api",
    updated: "2h ago",
    status: "Draft",
  },
  {
    id: "2",
    title: "Billing Events",
    type: "module",
    updated: "1d ago",
    status: "Published",
  },
  {
    id: "3",
    title: "Changelog v1.3",
    type: "release",
    updated: "3d ago",
    status: "Draft",
  },
];

export default function DocumentsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar
          active="documents"
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <main className="flex-1">
          <Navbar
            title="Documents"
            subtitle="Edit, preview, and manage versions"
            onMenuClick={() => setMobileOpen(true)}
          />

          <div className="px-6 py-6 grid gap-6 lg:grid-cols-[320px,1fr]">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <p className="text-xs uppercase text-slate-500">Docs</p>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Library
                  </h3>
                </div>
                <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
                  New
                </button>
              </div>
              <div className="space-y-2">
                <input
                  placeholder="Search documents"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
                <div className="space-y-2">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 hover:border-indigo-100"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {doc.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-700">
                          {doc.type}
                        </span>
                        <span>{doc.updated}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 ${
                            doc.status === "Published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {doc.status}
                        </span>
                        <span className="ml-auto rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700">
                          v1.3
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <p className="text-xs uppercase text-slate-500">Editing</p>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Authentication Service
                    </h3>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="rounded-full bg-slate-200 px-2 py-1 text-slate-700">
                      api
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                      Published
                    </span>
                  </div>
                  <div className="ml-auto flex gap-2 text-xs">
                    <button className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">
                      Preview
                    </button>
                    <button className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700">
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <Editor />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

