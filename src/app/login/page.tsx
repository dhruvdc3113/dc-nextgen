"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", classNum: "11" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (tab === "signup" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Password must be 6+ characters";
    if (tab === "signup" && form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    signIn("google", { callbackUrl: "/setup" });
  };

  return (
    <div style={{
      minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr",
      fontFamily: "var(--font-geist-sans), -apple-system, sans-serif",
    }} className="auth-grid">
      {/* ── LEFT: Brand panel ── */}
      <div style={{
        background: "linear-gradient(145deg, #0D0B1E 0%, #160D2E 40%, #0A1020 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 64px",
      }}>
        {/* Background orbs */}
        <div style={{ position: "absolute", top: -100, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.22), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 64 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 14, color: "white",
              boxShadow: "0 0 24px rgba(124,58,237,0.5)",
            }}>DC</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, background: "linear-gradient(135deg, #A78BFA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DC NextGen</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>AI Learning Platform</div>
            </div>
          </Link>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(167,139,250,0.7)", marginBottom: 20 }}>DC EDUVERSE</div>
          <h2 style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: "white", letterSpacing: "-1.5px" }}>
            Unlock Your<br />
            <span style={{ background: "linear-gradient(135deg, #A78BFA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Full Potential.</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 380, marginBottom: 52 }}>
            Join 12,000+ students already transforming their academic journey with AI-powered personalized learning.
          </p>

          {/* Feature list */}
          {[
            { icon: "🎯", text: "Adaptive MCQ tests that evolve with you" },
            { icon: "🧠", text: "ARIA AI Tutor available 24/7" },
            { icon: "🔥", text: "Streak rewards & achievement badges" },
            { icon: "📊", text: "Real-time progress across all subjects" },
          ].map((f) => (
            <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, fontSize: 17,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)",
                flexShrink: 0,
              }}>{f.icon}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{f.text}</div>
            </div>
          ))}

          {/* Stats */}
          <div style={{ display: "flex", gap: 36, marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {[["12K+", "Students"], ["98%", "Satisfaction"], ["50K+", "Tests"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#A78BFA" }}>{v}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form panel ── */}
      <div style={{
        background: "#080C14", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "60px 64px",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Tab switcher */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: 5, marginBottom: 36,
          }}>
            {(["login", "signup"] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setErrors({}); }}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer",
                  border: "none", transition: "all 0.2s",
                  background: tab === t ? "linear-gradient(135deg, #7C3AED, #5B21B6)" : "transparent",
                  color: tab === t ? "white" : "rgba(255,255,255,0.45)",
                  boxShadow: tab === t ? "0 4px 16px rgba(124,58,237,0.35)" : "none",
                }}
              >{t === "login" ? "Login" : "Sign Up"}</button>
            ))}
          </div>

          <div style={{ color: "white" }}>
            <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
              {tab === "login" ? "Welcome back!" : "Create account"}
            </h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 32 }}>
              {tab === "login" ? "Sign in to continue your learning journey" : "Start your AI-powered learning journey today"}
            </p>
          </div>

          {/* Google login */}
          <button
            style={{
              width: "100%", padding: "13px", borderRadius: 12, fontSize: 15, fontWeight: 600,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
              color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              marginBottom: 24, transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
            onClick={() => { setLoading(true); signIn("google", { callbackUrl: "/setup" }); }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {tab === "signup" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Full Name</label>
                <input
                  type="text" placeholder="Your full name"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 15,
                    background: "rgba(255,255,255,0.05)", border: `1px solid ${errors.name ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
                    color: "white", outline: "none", boxSizing: "border-box",
                  }}
                />
                {errors.name && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 5 }}>{errors.name}</p>}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Email Address</label>
              <input
                type="email" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 15,
                  background: "rgba(255,255,255,0.05)", border: `1px solid ${errors.email ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
                  color: "white", outline: "none", boxSizing: "border-box",
                }}
              />
              {errors.email && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 5 }}>{errors.email}</p>}
            </div>

            {tab === "signup" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Select Class</label>
                <select
                  value={form.classNum} onChange={(e) => setForm({ ...form, classNum: e.target.value })}
                  style={{
                    width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 15,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", outline: "none", boxSizing: "border-box", cursor: "pointer",
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
                    <option key={c} value={c} style={{ background: "#080C14" }}>Class {c}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: tab === "login" ? 12 : 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Password</label>
              <input
                type="password" placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 15,
                  background: "rgba(255,255,255,0.05)", border: `1px solid ${errors.password ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
                  color: "white", outline: "none", boxSizing: "border-box",
                }}
              />
              {errors.password && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 5 }}>{errors.password}</p>}
            </div>

            {tab === "login" && (
              <div style={{ textAlign: "right", marginBottom: 24 }}>
                <span style={{ fontSize: 13, color: "#A78BFA", cursor: "pointer", fontWeight: 600 }}>Forgot password?</span>
              </div>
            )}

            {tab === "signup" && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Confirm Password</label>
                <input
                  type="password" placeholder="••••••••"
                  value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  style={{
                    width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 15,
                    background: "rgba(255,255,255,0.05)", border: `1px solid ${errors.confirmPassword ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
                    color: "white", outline: "none", boxSizing: "border-box",
                  }}
                />
                {errors.confirmPassword && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 5 }}>{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px", borderRadius: 12, fontSize: 16, fontWeight: 700,
                background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7C3AED, #5B21B6)",
                color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 8px 24px rgba(124,58,237,0.4)",
                transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  {tab === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : tab === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setTab(tab === "login" ? "signup" : "login"); setErrors({}); }}
              style={{ background: "none", border: "none", color: "#A78BFA", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
            >{tab === "login" ? "Sign Up Free" : "Login"}</button>
          </p>

          <p style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:focus { border-color: rgba(124,58,237,0.5) !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.12); }
        select option { background: #080C14; color: white; }
        @media (max-width: 768px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-grid > div:first-child { display: none !important; }
          .auth-grid > div:last-child { padding: 40px 24px !important; }
        }
      `}</style>
    </div>
  );
}
