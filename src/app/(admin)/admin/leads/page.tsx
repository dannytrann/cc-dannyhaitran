"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const FILTERS = ["all", "new", "contacted", "proposal_sent", "won", "lost"] as const;

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then(({ leads }) => {
        setLeads(leads);
        setLoading(false);
      });
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function updateStatus(id: string, status: LeadStatus) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l
      )
    );
  }

  const filtered =
    filter === "all" ? leads : leads.filter((l) => l.status === filter);

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
          <Link href="/admin/leads" style={{ ...s.navLink, ...s.navLinkActive }}>
            <span>🎯</span> Leads
          </Link>
        </nav>
        <button onClick={handleLogout} style={s.logoutBtn}>
          Sign Out
        </button>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>Leads</h1>
            <p style={s.pageSubtitle}>
              {filtered.length} business{filtered.length !== 1 ? "es" : ""}
              {filter !== "all" ? ` · ${STATUS_LABELS[filter]}` : ""}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={s.filterRow}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...s.filterBtn,
                ...(filter === f ? s.filterBtnActive : {}),
              }}
            >
              {f === "all"
                ? `All (${leads.length})`
                : `${STATUS_LABELS[f]} (${leads.filter((l) => l.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={s.loading}>Loading leads...</div>
        ) : (
          <div style={s.grid}>
            {filtered.map((lead) => (
              <div key={lead.id} style={s.card}>
                <div style={s.cardTop}>
                  <div style={s.cardBizInfo}>
                    <h3 style={s.bizName}>{lead.businessName}</h3>
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

                <div style={s.cardMeta}>
                  <p style={s.metaItem}>
                    <span style={s.metaIcon}>📍</span>
                    {lead.address}
                  </p>
                  {lead.phone && (
                    <p style={s.metaItem}>
                      <span style={s.metaIcon}>📞</span>
                      {lead.phone}
                    </p>
                  )}
                  {lead.currentWebsite ? (
                    <p style={s.metaItem}>
                      <span style={s.metaIcon}>🌐</span>
                      <a
                        href={lead.currentWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={s.siteLink}
                      >
                        {lead.currentWebsite.replace(/^https?:\/\//, "")}
                      </a>
                    </p>
                  ) : (
                    <p style={s.metaItem}>
                      <span style={s.metaIcon}>🚫</span>
                      <span style={{ color: "#ef4444" }}>No website</span>
                    </p>
                  )}
                </div>

                {/* Website Score */}
                <div style={s.scoreSection}>
                  <div style={s.scoreHeader}>
                    <span style={s.scoreLabel}>Website Quality</span>
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
                  <div style={s.issuesList}>
                    {lead.websiteIssues.slice(0, 2).map((issue, i) => (
                      <span key={i} style={s.issueTag}>
                        {issue}
                      </span>
                    ))}
                    {lead.websiteIssues.length > 2 && (
                      <span style={s.issueMore}>
                        +{lead.websiteIssues.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={s.cardActions}>
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateStatus(lead.id, e.target.value as LeadStatus)
                    }
                    style={s.statusSelect}
                  >
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <Link href={`/admin/leads/${lead.id}`} style={s.generateBtn}>
                    {lead.generatedAt ? "✓ View Site" : "✨ Generate Site"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

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
  navLinkActive: {
    color: "#f1f5f9",
    background: "#1a1a2a",
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
    padding: "2rem",
    overflow: "auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
  },
  pageTitle: {
    color: "#f1f5f9",
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: "0 0 0.25rem",
    fontStyle: "normal",
    lineHeight: "1.3",
  },
  pageSubtitle: {
    color: "#475569",
    fontSize: "0.85rem",
    margin: 0,
  },
  filterRow: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  filterBtn: {
    padding: "0.4rem 0.875rem",
    borderRadius: "9999px",
    border: "1px solid #1a1a2a",
    background: "transparent",
    color: "#64748b",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontWeight: "500",
  },
  filterBtnActive: {
    background: "#1a1a2a",
    color: "#f1f5f9",
    border: "1px solid #2a2a3a",
  },
  loading: {
    color: "#475569",
    textAlign: "center",
    padding: "4rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#111118",
    border: "1px solid #1a1a2a",
    borderRadius: "12px",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardBizInfo: {},
  bizName: {
    color: "#f1f5f9",
    fontSize: "1rem",
    fontWeight: "700",
    margin: "0 0 0.2rem",
    fontStyle: "normal",
    lineHeight: "1.3",
  },
  bizType: {
    color: "#64748b",
    fontSize: "0.78rem",
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
  cardMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  metaItem: {
    color: "#64748b",
    fontSize: "0.8rem",
    margin: 0,
    display: "flex",
    gap: "0.375rem",
    alignItems: "flex-start",
  },
  metaIcon: {
    flexShrink: 0,
    fontSize: "0.85rem",
  },
  siteLink: {
    color: "#60a5fa",
    textDecoration: "none",
    wordBreak: "break-all",
  },
  scoreSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
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
    fontSize: "0.8rem",
    fontWeight: "700",
  },
  scoreTrack: {
    height: "4px",
    background: "#1a1a2a",
    borderRadius: "2px",
    overflow: "hidden",
  },
  scoreFill: {
    height: "100%",
    borderRadius: "2px",
    transition: "width 0.5s ease",
  },
  issuesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.375rem",
  },
  issueTag: {
    color: "#94a3b8",
    background: "#1a1a2a",
    border: "1px solid #252535",
    borderRadius: "4px",
    padding: "0.15rem 0.5rem",
    fontSize: "0.7rem",
  },
  issueMore: {
    color: "#64748b",
    fontSize: "0.7rem",
    alignSelf: "center",
  },
  cardActions: {
    display: "flex",
    gap: "0.625rem",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: "0.5rem",
    borderTop: "1px solid #15151f",
  },
  statusSelect: {
    flex: 1,
    background: "#0a0a0f",
    border: "1px solid #1a1a2a",
    borderRadius: "6px",
    color: "#94a3b8",
    fontSize: "0.8rem",
    padding: "0.375rem 0.5rem",
    cursor: "pointer",
  },
  generateBtn: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    padding: "0.375rem 0.875rem",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "0.8rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
};
