"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Editor from "../../components/Editor";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { useDocuments, useDocument, useUpdateDocument } from "../../hooks/useDocuments";
import type { Document } from "../../types/api";

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

export default function DocumentsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  const { data: documents, isLoading, error } = useDocuments({ limit: 100 });
  const { data: selectedDocument, isLoading: isLoadingDoc } = useDocument(selectedDocId);
  const updateMutation = useUpdateDocument();

  // Filter documents based on search
  const filteredDocuments = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Select first document if none selected
  useEffect(() => {
    if (!selectedDocId && filteredDocuments.length > 0) {
      setSelectedDocId(filteredDocuments[0].id);
    }
  }, [selectedDocId, filteredDocuments]);

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocId(docId);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedDocument) return;
    
    // Get content from editor (this would need to be implemented in Editor component)
    // For now, we'll just show a message
    alert('Save functionality will be implemented with Editor component integration');
  };

  return (
    <ProtectedRoute>
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
              {/* Documents List */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <p className="text-xs uppercase text-slate-500">Docs</p>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Library
                    </h3>
                  </div>
                  <button
                    onClick={() => window.location.href = '/documents?new=true'}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    New
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search documents"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300"
                  />
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {isLoading ? (
                      <div className="text-sm text-slate-500 p-3">Loading...</div>
                    ) : error ? (
                      <div className="text-sm text-red-600 p-3">Error loading documents</div>
                    ) : filteredDocuments.length === 0 ? (
                      <div className="text-sm text-slate-500 p-3">No documents found</div>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => handleDocumentSelect(doc.id)}
                          className={`rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
                            selectedDocId === doc.id
                              ? "border-indigo-300 bg-indigo-50"
                              : "border-slate-100 bg-slate-50 hover:border-indigo-100"
                          }`}
                        >
                          <p className="text-sm font-semibold text-slate-900">
                            {doc.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-700">
                              {doc.doc_type || "document"}
                            </span>
                            <span>{formatDate(doc.updated_at)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Document Editor/Viewer */}
              <div className="space-y-4">
                {isLoadingDoc ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                    <p className="text-slate-500">Loading document...</p>
                  </div>
                ) : selectedDocument ? (
                  <>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-wrap items-center gap-3">
                        <div>
                          <p className="text-xs uppercase text-slate-500">Editing</p>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {selectedDocument.title}
                          </h3>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <span className="rounded-full bg-slate-200 px-2 py-1 text-slate-700">
                            {selectedDocument.doc_type || "document"}
                          </span>
                        </div>
                        <div className="ml-auto flex gap-2 text-xs">
                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
                          >
                            {isEditing ? "Preview" : "Edit"}
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={updateMutation.isPending}
                            className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {updateMutation.isPending ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {isEditing ? (
                      <Editor />
                    ) : (
                      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="prose max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono bg-slate-50 p-4 rounded-lg">
                            {selectedDocument.content}
                          </pre>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                    <p className="text-slate-500">Select a document to view or edit</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
