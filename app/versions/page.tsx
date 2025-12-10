"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import VersionDiff from "../../components/VersionDiff";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { useDocuments, useDocumentVersions, useDocumentVersion } from "../../hooks/useDocuments";
import type { DocumentVersion } from "../../types/api";

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

export default function VersionsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [fromVersion, setFromVersion] = useState<number | null>(null);
  const [toVersion, setToVersion] = useState<number | null>(null);

  // Fetch documents list
  const { data: documents, isLoading: isLoadingDocs } = useDocuments({ limit: 100 });
  
  // Fetch versions for selected document
  const { data: versions, isLoading: isLoadingVersions } = useDocumentVersions(selectedDocId);
  
  // Fetch specific versions for comparison
  const { data: fromVersionData } = useDocumentVersion(selectedDocId, fromVersion);
  const { data: toVersionData } = useDocumentVersion(selectedDocId, toVersion);

  // Auto-select first document if none selected
  useEffect(() => {
    if (!selectedDocId && documents && documents.length > 0) {
      setSelectedDocId(documents[0].id);
    }
  }, [documents, selectedDocId]);

  // Auto-select versions when versions load
  useEffect(() => {
    if (versions && versions.length > 0) {
      if (versions.length >= 2) {
        // Select last two versions for comparison
        setToVersion(versions[0].version_number); // Latest
        setFromVersion(versions[1].version_number); // Previous
      } else if (versions.length === 1) {
        // Only one version, compare with itself
        setToVersion(versions[0].version_number);
        setFromVersion(versions[0].version_number);
      }
    }
  }, [versions]);

  const handleCompare = () => {
    if (fromVersion && toVersion) {
      // Versions will be fetched automatically via hooks
      // The diff will be displayed in VersionDiff component
    }
  };

  const handleVersionSelect = (versionNumber: number, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromVersion(versionNumber);
    } else {
      setToVersion(versionNumber);
    }
  };

  const sortedVersions = versions
    ? [...versions].sort((a, b) => b.version_number - a.version_number)
    : [];

  return (
    <ProtectedRoute>
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
              {/* Document and Version Selection */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-xs uppercase text-slate-500">Document</p>
                    {isLoadingDocs ? (
                      <p className="text-sm text-slate-500">Loading documents...</p>
                    ) : (
                      <select
                        value={selectedDocId || ""}
                        onChange={(e) => setSelectedDocId(e.target.value || null)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                      >
                        <option value="">Select a document</option>
                        {documents?.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {selectedDocId && (
                    <div className="ml-auto flex flex-wrap gap-3 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">From</span>
                        <select
                          value={fromVersion || ""}
                          onChange={(e) =>
                            setFromVersion(e.target.value ? parseInt(e.target.value) : null)
                          }
                          disabled={isLoadingVersions || !versions || versions.length === 0}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300 disabled:opacity-50"
                        >
                          <option value="">Select version</option>
                          {sortedVersions.map((v) => (
                            <option key={v.version_number} value={v.version_number}>
                              v{v.version_number} - {v.diff || "Version " + v.version_number}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">To</span>
                        <select
                          value={toVersion || ""}
                          onChange={(e) =>
                            setToVersion(e.target.value ? parseInt(e.target.value) : null)
                          }
                          disabled={isLoadingVersions || !versions || versions.length === 0}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300 disabled:opacity-50"
                        >
                          <option value="">Select version</option>
                          {sortedVersions.map((v) => (
                            <option key={v.version_number} value={v.version_number}>
                              v{v.version_number} - {v.diff || "Version " + v.version_number}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleCompare}
                        disabled={!fromVersion || !toVersion || isLoadingVersions}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Compare
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Version Diff Display */}
              {fromVersionData && toVersionData ? (
                <VersionDiff
                  fromContent={fromVersionData.content}
                  toContent={toVersionData.content}
                  fromVersion={fromVersionData.version_number}
                  toVersion={toVersionData.version_number}
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                  {isLoadingVersions ? (
                    <p className="text-slate-500">Loading versions...</p>
                  ) : !selectedDocId ? (
                    <p className="text-slate-500">Please select a document to view versions</p>
                  ) : !versions || versions.length === 0 ? (
                    <p className="text-slate-500">No versions found for this document</p>
                  ) : !fromVersion || !toVersion ? (
                    <p className="text-slate-500">Please select versions to compare</p>
                  ) : (
                    <p className="text-slate-500">Loading version data...</p>
                  )}
                </div>
              )}

              {/* Version Timeline */}
              {selectedDocId && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Version timeline
                  </h4>
                  <div className="mt-3 space-y-3">
                    {isLoadingVersions ? (
                      <div className="text-sm text-slate-500 p-3">Loading versions...</div>
                    ) : !versions || versions.length === 0 ? (
                      <div className="text-sm text-slate-500 p-3">No versions available</div>
                    ) : (
                      sortedVersions.map((version) => (
                        <div
                          key={version.id}
                          className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              v{version.version_number} - {version.diff || "Version " + version.version_number}
                            </p>
                            <p className="text-xs text-slate-500">
                              Updated {formatDate(version.timestamp)}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setToVersion(version.version_number);
                              if (!fromVersion) {
                                setFromVersion(version.version_number);
                              }
                            }}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                          >
                            View
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
