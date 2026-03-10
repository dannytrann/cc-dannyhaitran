"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>$</span>
        </div>
        <h1 style={styles.title}>CR Web Studio</h1>
        <p style={styles.subtitle}>Admin Panel</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  card: {
    background: "#111118",
    border: "1px solid #1f1f2e",
    borderRadius: "16px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  logo: {
    width: "56px",
    height: "56px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.25rem",
    boxShadow: "0 0 30px rgba(34,197,94,0.3)",
  },
  logoIcon: {
    color: "#fff",
    fontSize: "1.75rem",
    fontWeight: "900",
  },
  title: {
    color: "#f1f5f9",
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: "0 0 0.25rem",
    fontFamily: "inherit",
    fontStyle: "normal",
    lineHeight: "1.3",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "0.875rem",
    margin: "0 0 2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    textAlign: "left",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  label: {
    color: "#94a3b8",
    fontSize: "0.8rem",
    fontWeight: "600",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  input: {
    background: "#0a0a0f",
    border: "1px solid #1f1f2e",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "0.95rem",
    padding: "0.625rem 0.875rem",
    outline: "none",
    transition: "border-color 0.15s",
  },
  error: {
    color: "#f87171",
    fontSize: "0.85rem",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "6px",
    padding: "0.5rem 0.75rem",
    margin: "0",
  },
  button: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: "600",
    padding: "0.75rem",
    marginTop: "0.5rem",
    transition: "transform 0.1s, box-shadow 0.1s",
    boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
  },
};
