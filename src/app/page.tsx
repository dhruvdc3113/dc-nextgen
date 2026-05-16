"use client";
import { useState } from "react";
import Link from "next/link";

const CLASSES = Array.from({ length: 12 }, (_, i) => i + 1);

const FEATURES = [
  {
    icon: "🎯",
    title: "Adaptive Assessments",
    desc: "AI-powered MCQ tests that adapt in real-time to your performance level and weak areas.",
    color: "#7C3AED",
  },
  {
    icon: "🧠",
    title: "Theory Exams",
    desc: "Comprehensive theory modules with instant AI feedback, concept maps, and revision tools.",
    color: "#06B6D4",
  },
  {
    icon: "📈",
    title: "Journey Tracking",
    desc: "Live progress tracking across all subjects with heatmaps, streaks, and rank board.",
    color: "#F59E0B",
  },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      style={{
        background: "linear-gradient(160deg, #070B14 0%, #0A0F1E 50%, #080C18 100%)",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "var(--font-geist-sans), -apple-system, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px",
          background: "rgba(7,11,20,0.85)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 13, color: "white",
              boxShadow: "0 0 20px rgba(124,58,237,0.4)",
            }}
          >DC</div>
          <div>
            <div style={{
              fontWeight: 900, fontSize: 16, letterSpacing: "-0.3px",
              background: "linear-gradient(135deg, #A78BFA, #06B6D4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>DC NextGen</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1 }}>AI Learning Platform</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="hidden md:flex">
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Classes", href: "#classes" },
            { label: "Leaderboard", href: "/leaderboard" },
          ].map((l) => (
            <Link key={l.label} href={l.href}
              style={{
                padding: "7px 18px", borderRadius: 8, fontSize: 14,
                color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#A78BFA"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >{l.label}</Link>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/login"
            style={{
              padding: "8px 22px", borderRadius: 9, fontSize: 14, fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)",
              textDecoration: "none", transition: "all 0.2s",
            }}
            className="hidden sm:block"
          >Login</Link>
          <Link href="/login"
            style={{
              padding: "8px 22px", borderRadius: 9, fontSize: 14, fontWeight: 700,
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              color: "white", textDecoration: "none",
              boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
            }}
          >Sign Up Free</Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, width: 36, height: 36, color: "white", cursor: "pointer", fontSize: 18 }}
            className="md:hidden"
          >{mobileOpen ? "✕" : "☰"}</button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 40,
          background: "rgba(7,11,20,0.98)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)", padding: 16,
        }}>
          {[{ label: "Dashboard", href: "/dashboard" }, { label: "Classes", href: "#classes" }, { label: "Login", href: "/login" }].map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
              style={{ display: "block", padding: "12px 16px", borderRadius: 10, color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 15, fontWeight: 600, marginBottom: 4, background: "rgba(255,255,255,0.04)" }}
            >{l.label}</Link>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: 1200, margin: "0 auto", padding: "130px 40px 80px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center",
        }}
        className="hero-responsive"
      >
        {/* Left content */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100, marginBottom: 24,
            background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(167,139,250,0.9)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A78BFA", display: "inline-block" }} />
            DC EDUVERSE
          </div>

          <h1 style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.06, letterSpacing: "-2px", marginBottom: 24 }}>
            Future of<br />
            <span style={{
              background: "linear-gradient(135deg, #fff 0%, #A78BFA 50%, #06B6D4 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Learning.</span>
          </h1>

          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.58)", lineHeight: 1.75, maxWidth: 470, marginBottom: 40 }}>
            AI powered education platform for Class 1–12 with secure assessments, adaptive learning, theory exams, journey tracking and premium student experiences.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/login"
              style={{
                padding: "15px 40px", borderRadius: 11, fontWeight: 800, fontSize: 16,
                background: "white", color: "#080C14", textDecoration: "none",
                boxShadow: "0 8px 30px rgba(255,255,255,0.15)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(255,255,255,0.22)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(255,255,255,0.15)"; }}
            >Start Learning</Link>
            <Link href="/dashboard"
              style={{
                padding: "15px 40px", borderRadius: 11, fontWeight: 700, fontSize: 16,
                border: "2px solid rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.85)",
                textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(167,139,250,0.5)"; (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.22)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"; }}
            >Explore Demo</Link>
          </div>

          {/* Trust indicators */}
          <div style={{ display: "flex", gap: 28, marginTop: 44, alignItems: "center" }}>
            {[["12K+", "Students"], ["98%", "Satisfaction"], ["50K+", "Tests Taken"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#A78BFA" }}>{val}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Student Journey card */}
        <div
          style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 24, padding: 36,
            backdropFilter: "blur(24px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Glow decoration */}
          <div style={{
            position: "absolute", top: -60, right: -60, width: 200, height: 200,
            borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 12, fontWeight: 500 }}>Student Journey</div>
          <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1, marginBottom: 8, letterSpacing: "-3px" }}>78%</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>Overall completion this semester</div>

          {/* Progress bar */}
          <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 100, marginBottom: 28, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: "78%",
              background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
              borderRadius: 100,
              boxShadow: "0 0 12px rgba(124,58,237,0.5)",
            }} />
          </div>

          {/* Mini stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { val: "17", label: "Day Streak", icon: "🔥", color: "#F59E0B" },
              { val: "1,280", label: "XP Points", icon: "⚡", color: "#A78BFA" },
            ].map(({ val, label, icon, color }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "18px 20px",
              }}>
                <div style={{ fontSize: 13, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Recent Activity</div>
            {[
              { sub: "Physics", ch: "Kinematics", score: "75%", color: "#EF4444" },
              { sub: "Maths", ch: "Sets & Relations", score: "95%", color: "#3B82F6" },
            ].map((a) => (
              <div key={a.ch} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color }} />
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{a.sub} — {a.ch}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: a.color }}>{a.score}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.title}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "28px 28px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = `rgba(${f.color === "#7C3AED" ? "124,58,237" : f.color === "#06B6D4" ? "6,182,212" : "245,158,11"},0.08)`;
                (e.currentTarget as HTMLElement).style.borderColor = `${f.color}35`;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, fontSize: 22,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `${f.color}1A`, border: `1px solid ${f.color}30`,
                marginBottom: 18,
              }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 10 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHOOSE YOUR CLASS ── */}
      <section id="classes" style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 40px 100px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(167,139,250,0.7)", marginBottom: 12 }}>
            ALL CLASSES
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-1px" }}>Choose Your Class</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14 }}>
          {CLASSES.map((cls) => (
            <Link key={cls} href={`/class/class-${cls}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20, padding: "26px 18px 22px",
                  cursor: "pointer", transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(124,58,237,0.14)";
                  el.style.borderColor = "rgba(124,58,237,0.35)";
                  el.style.transform = "translateY(-6px) scale(1.02)";
                  el.style.boxShadow = "0 20px 50px rgba(124,58,237,0.2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.035)";
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.transform = "translateY(0) scale(1)";
                  el.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 10, letterSpacing: "-0.3px" }}>
                  Class {cls}
                </div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, fontWeight: 500 }}>
                  Subjects&nbsp;•&nbsp;Assessments&nbsp;•&nbsp;Progress
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA below class grid */}
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
            Not sure where to start? Take our AI placement test.
          </div>
          <Link href="/login"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 36px", borderRadius: 12, fontWeight: 700, fontSize: 15,
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              color: "white", textDecoration: "none",
              boxShadow: "0 8px 30px rgba(124,58,237,0.35)",
            }}
          >
            🚀 Start Free Today
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 11, color: "white",
          }}>DC</div>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>DC NextGen — AI-Powered K-12 Learning</span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {[["Dashboard", "/dashboard"], ["Classes", "#classes"], ["Login", "/login"], ["Sign Up", "/login"]].map(([label, href]) => (
            <Link key={label} href={href}
              style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#A78BFA"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}
            >{label}</Link>
          ))}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>© 2025 DC Eduverse</div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-responsive { grid-template-columns: 1fr !important; gap: 40px !important; padding: 100px 20px 60px !important; }
          #classes > div:first-child { margin-bottom: 28px !important; }
          #classes > div:nth-child(2) { grid-template-columns: repeat(3,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
