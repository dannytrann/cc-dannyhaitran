"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lead } from "@/lib/leads-db";

interface Stats {
  total: number;
  new: number;
  contacted: number;
  proposal_sent: number;
  won: number;
  lost: number;
  generated: number;
}

const AVG_WEBSITE_PRICE = 1200;

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

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then(({ leads, stats }) => {
        setLeads(leads);
        setStats(stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const recentLeads = leads.slice(0, 5);
  const estRevenue = (stats?.won ?? 0) * AVG_WEBSITE_PRICE;
  const pipeline =
    ((stats?.contacted ?? 0) + (stats?.proposal_sent ?? 0)) *
    AVG_WEBSITE_PRICE *
    0.4;

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <span style={s.sidebarLogoIcon}>$</span>
          <span style={s.sidebarLogoText}>CR Web Studio</span>
        </div>
        <nav style={s.nav}>
          <Link href="/admin" style={{ ...s.navLink, ...s.navLinkActive }}>
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
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>Dashboard</h1>
            <p style={s.pageSubtitle}>Campbell River website leads</p>
          </div>
          <Link href="/admin/leads" style={s.primaryBtn}>
            + View All Leads
          </Link>
        </div>

        {loading ? (
          <div style={s.loading}>Loading...</div>
        ) : (
          <>
            {/* Revenue Cards */}
            <div style={s.statsGrid}>
              <div style={{ ...s.statCard, ...s.statCardGreen }}>
                <p style={s.statLabel}>Revenue Won</p>
                <p style={s.statValue}>${estRevenue.toLocaleString()}</p>
                <p style={s.statMeta}>{stats?.won ?? 0} clients closed</p>
              </div>
              <div style={{ ...s.statCard, ...s.statCardPurple }}>
                <p style={s.statLabel}>Pipeline Value</p>
                <p style={s.statValue}>${Math.round(pipeline).toLocaleString()}</p>
                <p style={s.statMeta}>est. 40% close rate</p>
              </div>
              <div style={{ ...s.statCard }}>
                <p style={s.statLabel}>Total Leads</p>
                <p style={s.statValue}>{stats?.total ?? 0}</p>
                <p style={s.statMeta}>{stats?.new ?? 0} new to contact</p>
              </div>
              <div style={{ ...s.statCard }}>
                <p style={s.statLabel}>Websites Generated</p>
                <p style={s.statValue}>{stats?.generated ?? 0}</p>
                <p style={s.statMeta}>ready to pitch</p>
              </div>
            </div>

            {/* Status Breakdown */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Lead Pipeline</h2>
              <div style={s.pipelineGrid}>
                {Object.entries(STATUS_LABELS).map(([status, label]) => (
                  <div key={status} style={s.pipelineCard}>
                    <div
                      style={{
                        ...s.pipelineDot,
                        background: STATUS_COLORS[status],
                        boxShadow: `0 0 10px ${STATUS_COLORS[status]}55`,
                      }}
                    />
                    <p style={s.pipelineCount}>
                      {stats?.[status as keyof Stats] ?? 0}
                    </p>
                    <p style={s.pipelineLabel}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Leads */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <h2 style={s.sectionTitle}>Recent Leads</h2>
                <Link href="/admin/leads" style={s.viewAllLink}>
                  View all →
                </Link>
              </div>
              <div style={s.table}>
                <div style={s.tableHeader}>
                  <span>Business</span>
                  <span>Type</span>
                  <span>Score</span>
                  <span>Status</span>
                  <span></span>
                </div>
                {recentLeads.map((lead) => (
                  <div key={lead.id} style={s.tableRow}>
                    <div>
                      <p style={s.businessName}>{lead.businessName}</p>
                      <p style={s.businessAddress}>{lead.address.split(",")[0]}</p>
                    </div>
                    <span style={s.typeTag}>{lead.businessType}</span>
                    <div style={s.scoreBar}>
                      <div
                        style={{
                          ...s.scoreBarFill,
                          width: `${lead.websiteScore * 10}%`,
                          background:
                            lead.websiteScore <= 3
                              ? "#22c55e"
                              : lead.websiteScore <= 6
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      />
                      <span style={s.scoreText}>{lead.websiteScore}/10</span>
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
                    <Link href={`/admin/leads/${lead.id}`} style={s.actionBtn}>
                      Generate →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
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
    transition: "all 0.15s",
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
    marginBottom: "2rem",
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
  primaryBtn: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    padding: "0.625rem 1.25rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(34,197,94,0.25)",
  },
  loading: {
    color: "#475569",
    textAlign: "center",
    padding: "4rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    background: "#111118",
    border: "1px solid #1a1a2a",
    borderRadius: "12px",
    padding: "1.25rem",
  },
  statCardGreen: {
    background: "linear-gradient(135deg, #0f2218, #0d1f14)",
    border: "1px solid #1a3a26",
  },
  statCardPurple: {
    background: "linear-gradient(135deg, #150d1f, #120a1a)",
    border: "1px solid #2a1a3a",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 0.5rem",
  },
  statValue: {
    color: "#f1f5f9",
    fontSize: "2rem",
    fontWeight: "800",
    margin: "0 0 0.25rem",
    lineHeight: "1",
  },
  statMeta: {
    color: "#475569",
    fontSize: "0.78rem",
    margin: 0,
  },
  section: {
    marginBottom: "2rem",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  sectionTitle: {
    color: "#94a3b8",
    fontSize: "0.8rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    margin: "0 0 1rem",
    fontStyle: "normal",
  },
  viewAllLink: {
    color: "#22c55e",
    textDecoration: "none",
    fontSize: "0.85rem",
  },
  pipelineGrid: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  pipelineCard: {
    background: "#111118",
    border: "1px solid #1a1a2a",
    borderRadius: "10px",
    padding: "1rem 1.5rem",
    textAlign: "center",
    flex: "1",
    minWidth: "100px",
  },
  pipelineDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    margin: "0 auto 0.5rem",
  },
  pipelineCount: {
    color: "#f1f5f9",
    fontSize: "1.75rem",
    fontWeight: "800",
    margin: "0 0 0.25rem",
    lineHeight: "1",
  },
  pipelineLabel: {
    color: "#475569",
    fontSize: "0.75rem",
    margin: 0,
  },
  table: {
    background: "#111118",
    border: "1px solid #1a1a2a",
    borderRadius: "12px",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr 1fr 1fr auto",
    gap: "1rem",
    padding: "0.875rem 1.25rem",
    borderBottom: "1px solid #1a1a2a",
    color: "#475569",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr 1fr 1fr auto",
    gap: "1rem",
    padding: "0.875rem 1.25rem",
    borderBottom: "1px solid #15151f",
    alignItems: "center",
  },
  businessName: {
    color: "#e2e8f0",
    fontSize: "0.875rem",
    fontWeight: "600",
    margin: "0 0 0.2rem",
  },
  businessAddress: {
    color: "#475569",
    fontSize: "0.75rem",
    margin: 0,
  },
  typeTag: {
    color: "#94a3b8",
    fontSize: "0.78rem",
  },
  scoreBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  scoreBarFill: {
    height: "4px",
    borderRadius: "2px",
    flex: "0 0 auto",
    minWidth: "4px",
  },
  scoreText: {
    color: "#64748b",
    fontSize: "0.75rem",
  },
  statusBadge: {
    display: "inline-block",
    padding: "0.2rem 0.6rem",
    borderRadius: "9999px",
    fontSize: "0.72rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  actionBtn: {
    color: "#22c55e",
    textDecoration: "none",
    fontSize: "0.82rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
};
