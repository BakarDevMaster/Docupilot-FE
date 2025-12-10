"use client";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { useDocuments } from "../../hooks/useDocuments";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function DashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: documents, isLoading, error } = useDocuments({ limit: 100 });

  // Calculate stats from documents
  const stats = [
    {
      label: "Documents",
      value: documents?.length || 0,
      trend: documents && documents.length > 0 ? `+${documents.length} total` : "No documents",
    },
    {
      label: "Embeddings",
      value: "0",
      trend: "Active",
    },
    {
      label: "Versions",
      value: "0",
      trend: "Tracked",
    },
    {
      label: "Agents",
      value: "2",
      trend: "Ready",
    },
  ];

  // Get recent documents for activity feed
  const recentDocuments = documents
    ?.slice(0, 5)
    .map((doc) => ({
      title: `${doc.title} updated`,
      meta: `Updated ${doc.updated_at ? formatDate(doc.updated_at) : 'recently'}`,
      badge: doc.doc_type || "Document",
    })) || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <div className="flex">
          <Sidebar
            active="dashboard"
            mobileOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />
          <main className="flex-1">
            <Navbar
              title="Dashboard"
              subtitle="Overview & recent activity"
              onMenuClick={() => setMobileOpen(true)}
            />
            <div className="px-6 py-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {isLoading ? "..." : item.value}
                    </p>
                    <p className="text-xs text-emerald-600">{item.trend}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {/* Workflows Section */}
                <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase text-slate-500">
                        Quick actions
                      </p>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Workflows
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.location.href = '/documents'}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                      >
                        New Document
                      </button>
                      <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        Run Agent
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Generator Agent
                      </p>
                      <p className="text-xs text-slate-500">
                        Create docs from specs, code, or change logs.
                      </p>
                      <div className="mt-3 flex gap-2 text-xs">
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                          Ready
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                          Last run: 2h ago
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Maintenance Agent
                      </p>
                      <p className="text-xs text-slate-500">
                        Audit and update outdated sections with context.
                      </p>
                      <div className="mt-3 flex gap-2 text-xs">
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                          Ready
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                          Last run: 1d ago
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3">
                    <div>
                      <p className="text-xs uppercase text-slate-500">Recent</p>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Activity
                      </h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      Live
                    </span>
                  </div>
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="text-sm text-slate-500">Loading...</div>
                    ) : error ? (
                      <div className="text-sm text-red-600">
                        Error loading documents
                      </div>
                    ) : recentDocuments.length === 0 ? (
                      <div className="text-sm text-slate-500">
                        No recent activity
                      </div>
                    ) : (
                      recentDocuments.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                        >
                          <p className="text-sm font-medium text-slate-900">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{item.meta}</span>
                            <span className="rounded-full bg-indigo-50 px-2 py-1 text-indigo-700">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
