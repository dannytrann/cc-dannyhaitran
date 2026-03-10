"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import type { Lead, LeadStatus } from "@/lib/leads-db";

const STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6",
  contacted: "#f59e0b",
  proposal_sent: "#a855f7",
  won: "#22c55e",
  lost: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

type GenState = "idle" | "generating" | "done" | "error";

export default function LeadDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string>("");
  const [genState, setGenState] = useState<GenState>("idle");
  const [previewMode, setPreviewMode] = useState<"code" | "preview">("preview");
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch(`/api/admin/leads/${id}`)
      .then((r) => r.json())
      .then(({ lead, generatedHtml }) => {
        setLead(lead);
        if (generatedHtml) {
          setGeneratedHtml(generatedHtml);
          setGenState("done");
        }
        setLoading(false);
      });
  }, [id]);

  // Update iframe when HTML changes
  useEffect(() => {
    if (iframeRef.current && generatedHtml) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(generatedHtml);
        doc.close();
      }
    }
  }, [generatedHtml, previewMode]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function generateWebsite() {
    setGenState("generating");
    setGeneratedHtml("");

    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: id }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let html = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        html += chunk;
        setGeneratedHtml(html);
      }

      setGenState("done");
      setLead((prev) =>
        prev ? { ...prev, generatedAt: new Date().toISOString() } : prev
      );
    } catch {
      setGenState("error");
    }
  }

  async function updateStatus(status: LeadStatus) {
    if (!lead) return;
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLead((prev) => (prev ? { ...prev, status } : prev));
  }

  function downloadHtml() {
    if (!generatedHtml || !lead) return;
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lead.businessName.toLowerCase().replace(/\s+/g, "-")}-website.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div style={{ ...s.page, justifyContent: "center", alignItems: "center" }}>
        <p style={{ color: "#475569" }}>Loading...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={{ ...s.page, justifyContent: "center", alignItems: "center" }}>
        <p style={{ color: "#ef4444" }}>Lead not found</p>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <span style={s.sidebarLogoIcon}>$</span>
          <span style={s.sidebarLogoText}>CR Web Studio</span>
        </div>
        <nav style={s.nav}>
          <Link href="/admin" style={s.navLink}>
            <span>📊</span> Dashboard
          </Link>
          <Link href="/admin/leads" style={s.navLink}>
            <span>🎯</span> Leads
          </Link>
        </nav>
        <button onClick={handleLogout} style={s.logoutBtn}>
          Sign Out
        </button>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {/* Breadcrumb */}
        <div style={s.breadcrumb}>
          <Link href="/admin/leads" style={s.breadcrumbLink}>
            ← Leads
          </Link>
          <span style={s.breadcrumbSep}>/</span>
          <span style={s.breadcrumbCurrent}>{lead.businessName}</span>
        </div>

        <div style={s.layout}>
          {/* Left: Business Info */}
          <div style={s.infoPanel}>
            <div style={s.infoCard}>
              <div style={s.infoBizHeader}>
                <div>
                  <h1 style={s.bizTitle}>{lead.businessName}</h1>
                  <p style={s.bizType}>{lead.businessType}</p>
                </div>
                <span
                  style={{
                    ...s.statusBadge,
                    color: STATUS_COLORS[lead.status],
                    background: `${STATUS_COLORS[lead.status]}18`,
                    border: `1px solid ${STATUS_COLORS[lead.status]}33`,
                  }}
                >
                  {STATUS_LABELS[lead.status]}
                </span>
              </div>

              <div style={s.infoRows}>
                <InfoRow icon="📍" label="Address" value={lead.address} />
                <InfoRow icon="📞" label="Phone" value={lead.phone} />
                <InfoRow icon="📧" label="Email" value={lead.email} />
                {lead.currentWebsite ? (
                  <InfoRow
                    icon="🌐"
                    label="Current Site"
                    value={
                      <a
                        href={lead.currentWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={s.infoLink}
                      >
                        {lead.currentWebsite.replace(/^https?:\/\//, "")}
                      </a>
                    }
                  />
                ) : (
                  <InfoRow
                    icon="🚫"
                    label="Current Site"
                    value={<span style={{ color: "#ef4444" }}>No website</span>}
                  />
                )}
              </div>

              {/* Website Score */}
              <div style={s.scoreSection}>
                <div style={s.scoreHeader}>
                  <span style={s.scoreLabel}>Website Quality Score</span>
                  <span
                    style={{
                      ...s.scoreValue,
                      color:
                        lead.websiteScore <= 3
                          ? "#22c55e"
                          : lead.websiteScore <= 6
                          ? "#f59e0b"
                          : "#ef4444",
                    }}
                  >
                    {lead.websiteScore}/10
                  </span>
                </div>
                <div style={s.scoreTrack}>
                  <div
                    style={{
                      ...s.scoreFill,
                      width: `${lead.websiteScore * 10}%`,
                      background:
                        lead.websiteScore <= 3
                          ? "#22c55e"
                          : lead.websiteScore <= 6
                          ? "#f59e0b"
                          : "#ef4444",
                    }}
                  />
                </div>
                <p style={s.scoreNote}>
                  {lead.websiteScore <= 3
                    ? "⚡ Hot lead — major improvement opportunity"
                    : lead.websiteScore <= 6
                    ? "👍 Good lead — clear pain points"
                    : "👀 Warm lead — minor improvements"}
                </p>
              </div>

              {/* Issues */}
              <div style={s.issuesSection}>
                <p style={s.issuesTitle}>Website Issues</p>
                <div style={s.issuesList}>
                  {lead.websiteIssues.map((issue, i) => (
                    <div key={i} style={s.issueItem}>
                      <span style={s.issueX}>✗</span>
                      {issue}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {lead.notes && (
                <div style={s.notesSection}>
                  <p style={s.issuesTitle}>Notes</p>
                  <p style={s.notesText}>{lead.notes}</p>
                </div>
              )}

              {/* Status Update */}
              <div style={s.statusSection}>
                <p style={s.issuesTitle}>Update Status</p>
                <div style={s.statusButtons}>
                  {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(status as LeadStatus)}
                      style={{
                        ...s.statusBtn,
                        ...(lead.status === status
                          ? {
                              background: `${STATUS_COLORS[status]}18`,
                              border: `1px solid ${STATUS_COLORS[status]}55`,
                              color: STATUS_COLORS[status],
                            }
                          : {}),
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Website Generator */}
          <div style={s.generatePanel}>
            {/* Generator Header */}
            <div style={s.generateHeader}>
              <div>
                <h2 style={s.generateTitle}>Website Generator</h2>
                <p style={s.generateSubtitle}>
                  Powered by Claude Opus 4.6
                </p>
              </div>
              <div style={s.generateHeaderActions}>
                {genState === "done" && (
                  <>
                    <div style={s.previewToggle}>
                      <button
                        onClick={() => setPreviewMode("preview")}
                        style={{
                          ...s.toggleBtn,
                          ...(previewMode === "preview" ? s.toggleBtnActive : {}),
                        }}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setPreviewMode("code")}
                        style={{
                          ...s.toggleBtn,
                          ...(previewMode === "code" ? s.toggleBtnActive : {}),
                        }}
                      >
                        HTML
                      </button>
                    </div>
                    <button onClick={downloadHtml} style={s.downloadBtn}>
                      ↓ Download
                    </button>
                  </>
                )}
                <button
                  onClick={generateWebsite}
                  disabled={genState === "generating"}
                  style={{
                    ...s.generateBtn,
                    opacity: genState === "generating" ? 0.7 : 1,
                    cursor: genState === "generating" ? "not-allowed" : "pointer",
                  }}
                >
                  {genState === "generating"
                    ? "✨ Generating..."
                    : genState === "done"
                    ? "↺ Regenerate"
                    : "✨ Generate Website"}
                </button>
              </div>
            </div>

            {/* Output Area */}
            <div style={s.outputArea}>
              {genState === "idle" && (
                <div style={s.emptyState}>
                  <p style={s.emptyIcon}>✨</p>
                  <p style={s.emptyTitle}>Ready to generate</p>
                  <p style={s.emptySubtitle}>
                    Click &quot;Generate Website&quot; to create a professional website
                    for {lead.businessName} using Claude AI.
                  </p>
                </div>
              )}

              {genState === "error" && (
                <div style={s.emptyState}>
                  <p style={s.emptyIcon}>⚠️</p>
                  <p style={{ ...s.emptyTitle, color: "#ef4444" }}>
                    Generation failed
                  </p>
                  <p style={s.emptySubtitle}>
                    Check your ANTHROPIC_API_KEY and try again.
                  </p>
                </div>
              )}

              {(genState === "generating" || genState === "done") && (
                <>
                  {previewMode === "preview" ? (
                    <iframe
                      ref={iframeRef}
                      style={s.iframe}
                      title="Website Preview"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : (
                    <pre style={s.codeBlock}>
                      <code style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                        {generatedHtml || "Generating..."}
                      </code>
                    </pre>
                  )}

                  {genState === "generating" && (
                    <div style={s.streamingIndicator}>
                      <div style={s.streamingDot} />
                      <span style={s.streamingText}>
                        Claude is writing your website...{" "}
                        {Math.round(generatedHtml.length / 1000)}KB
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div style={rowS.row}>
      <span style={rowS.icon}>{icon}</span>
      <div>
        <p style={rowS.label}>{label}</p>
        <div style={rowS.value}>{value}</div>
      </div>
    </div>
  );
}

const rowS: Record<string, React.CSSProperties> = {
  row: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-start",
  },
  icon: {
    fontSize: "1rem",
    marginTop: "0.1rem",
    flexShrink: 0,
  },
  label: {
    color: "#475569",
    fontSize: "0.72rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 0.15rem",
  },
  value: {
    color: "#cbd5e1",
    fontSize: "0.875rem",
  },
};

const s: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#e2e8f0",
  },
  sidebar: {
    width: "220px",
    flexShrink: 0,
    background: "#0f0f16",
    borderRight: "1px solid #1a1a2a",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem 0",
  },
  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
    padding: "0 1.25rem 1.5rem",
    borderBottom: "1px solid #1a1a2a",
    marginBottom: "1rem",
  },
  sidebarLogoIcon: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    width: "30px",
    height: "30px",
    borderRadius: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "1rem",
    flexShrink: 0,
  } as React.CSSProperties,
  sidebarLogoText: {
    color: "#f1f5f9",
    fontWeight: "700",
    fontSize: "0.9rem",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.125rem",
    padding: "0 0.75rem",
    flex: 1,
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
    padding: "0.625rem 0.75rem",
    borderRadius: "8px",
    color: "#64748b",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  logoutBtn: {
    margin: "1rem 0.75rem 0",
    padding: "0.5rem",
    background: "transparent",
    border: "1px solid #1a1a2a",
    borderRadius: "8px",
    color: "#64748b",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "1.5rem 2rem",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    fontSize: "0.85rem",
  },
  breadcrumbLink: {
    color: "#475569",
    textDecoration: "none",
  },
  breadcrumbSep: {
    color: "#2a2a3a",
  },
  breadcrumbCurrent: {
    color: "#94a3b8",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "1.5rem",
    flex: 1,
    minHeight: 0,
  },
  infoPanel: {
    overflow: "auto",
  },
  infoCard: {
    background: "#111118",
    border: "1px solid #1a1a2a",
    borderRadius: "12px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  infoBizHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bizTitle: {
    color: "#f1f5f9",
    fontSize: "1.2rem",
    fontWeight: "700",
    margin: "0 0 0.25rem",
    fontStyle: "normal",
    lineHeight: "1.3",
  },
  bizType: {
    color: "#64748b",
    fontSize: "0.8rem",
    margin: 0,
  },
  statusBadge: {
    display: "inline-block",
    padding: "0.2rem 0.6rem",
    borderRadius: "9999px",
    fontSize: "0.72rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  infoRows: {
    display: "flex",
    flexDirection: "column",
    gap: "0.875rem",
    paddingTop: "0.25rem",
    borderTop: "1px solid #15151f",
  },
  infoLink: {
    color: "#60a5fa",
    textDecoration: "none",
    fontSize: "0.875rem",
    wordBreak: "break-all",
  },
  scoreSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    paddingTop: "0.25rem",
    borderTop: "1px solid #15151f",
  },
  scoreHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreLabel: {
    color: "#475569",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  scoreValue: {
    fontSize: "0.85rem",
    fontWeight: "700",
  },
  scoreTrack: {
    height: "6px",
    background: "#1a1a2a",
    borderRadius: "3px",
    overflow: "hidden",
  },
  scoreFill: {
    height: "100%",
    borderRadius: "3px",
  },
  scoreNote: {
    color: "#64748b",
    fontSize: "0.78rem",
    margin: 0,
  },
  issuesSection: {
    borderTop: "1px solid #15151f",
    paddingTop: "0.25rem",
  },
  issuesTitle: {
    color: "#475569",
    fontSize: "0.72rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 0.625rem",
  },
  issuesList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  issueItem: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "flex-start",
    color: "#94a3b8",
    fontSize: "0.8rem",
  },
  issueX: {
    color: "#ef4444",
    fontWeight: "700",
    flexShrink: 0,
  },
  notesSection: {
    borderTop: "1px solid #15151f",
    paddingTop: "0.25rem",
  },
  notesText: {
    color: "#64748b",
    fontSize: "0.82rem",
    margin: 0,
    lineHeight: "1.6",
  },
  statusSection: {
    borderTop: "1px solid #15151f",
    paddingTop: "0.25rem",
  },
  statusButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.375rem",
  },
  statusBtn: {
    padding: "0.3rem 0.6rem",
    borderRadius: "6px",
    border: "1px solid #1a1a2a",
    background: "transparent",
    color: "#64748b",
    fontSize: "0.75rem",
    cursor: "pointer",
    fontWeight: "500",
  },
  generatePanel: {
    display: "flex",
    flexDirection: "column",
    background: "#111118",
    border: "1px solid #1a1a2a",
    borderRadius: "12px",
    overflow: "hidden",
    minHeight: "600px",
  },
  generateHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.25rem",
    borderBottom: "1px solid #1a1a2a",
    gap: "1rem",
    flexWrap: "wrap",
  },
  generateTitle: {
    color: "#f1f5f9",
    fontSize: "1rem",
    fontWeight: "700",
    margin: "0 0 0.2rem",
    fontStyle: "normal",
    lineHeight: "1.3",
  },
  generateSubtitle: {
    color: "#475569",
    fontSize: "0.75rem",
    margin: 0,
  },
  generateHeaderActions: {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
    flexWrap: "wrap",
  },
  previewToggle: {
    display: "flex",
    background: "#0a0a0f",
    border: "1px solid #1a1a2a",
    borderRadius: "7px",
    overflow: "hidden",
  },
  toggleBtn: {
    padding: "0.3rem 0.75rem",
    background: "transparent",
    border: "none",
    color: "#64748b",
    fontSize: "0.78rem",
    cursor: "pointer",
    fontWeight: "500",
  },
  toggleBtnActive: {
    background: "#1a1a2a",
    color: "#f1f5f9",
  },
  downloadBtn: {
    padding: "0.4rem 0.875rem",
    borderRadius: "7px",
    border: "1px solid #22c55e33",
    background: "#22c55e18",
    color: "#22c55e",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontWeight: "600",
  },
  generateBtn: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "none",
    borderRadius: "7px",
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: "600",
    padding: "0.5rem 1rem",
    boxShadow: "0 4px 15px rgba(34,197,94,0.25)",
    whiteSpace: "nowrap",
  },
  outputArea: {
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "3rem",
    margin: "0 0 1rem",
  },
  emptyTitle: {
    color: "#f1f5f9",
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: "0 0 0.5rem",
  },
  emptySubtitle: {
    color: "#475569",
    fontSize: "0.875rem",
    maxWidth: "300px",
    margin: 0,
    lineHeight: "1.6",
  },
  iframe: {
    width: "100%",
    flex: 1,
    border: "none",
    background: "#fff",
    minHeight: "550px",
  },
  codeBlock: {
    flex: 1,
    margin: 0,
    padding: "1rem",
    overflow: "auto",
    background: "#0a0a0f",
    minHeight: "550px",
  },
  streamingIndicator: {
    position: "absolute",
    bottom: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(10,10,15,0.9)",
    border: "1px solid #1a1a2a",
    borderRadius: "9999px",
    padding: "0.375rem 0.875rem",
    backdropFilter: "blur(8px)",
  },
  streamingDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
    animation: "pulse 1s ease-in-out infinite",
  },
  streamingText: {
    color: "#94a3b8",
    fontSize: "0.78rem",
  },
};
