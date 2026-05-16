"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CLASS_LIST, getSubjectsForClass } from "@/lib/data";

function CircularRing({ percent, color, size = 110 }: { percent: number; color: string; size?: number }) {
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`grad-${percent}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={`${color}99`} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#grad-${percent})`} strokeWidth="10"
        strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`}
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fontSize={size > 100 ? 22 : 15} fontWeight="900" fill="white" fontFamily="var(--font-geist-sans)">
        {percent}%
      </text>
    </svg>
  );
}

export default function ClassPage() {
  const params = useParams();
  const rawId = params?.id as string;
  const classNum = parseInt(rawId?.replace("class-", "").replace(/\D/g, "") || "11");
  const [activeClassNum, setActiveClassNum] = useState(classNum || 11);
  const [activeTab, setActiveTab] = useState<"subjects" | "assessments">("subjects");

  const subjects = getSubjectsForClass(activeClassNum);
  const classLabel = activeClassNum <= 3 ? "Primary" : activeClassNum <= 8 ? "Middle School" : "Senior Secondary";
  const totalChapters = subjects.reduce((s, sub) => s + sub.totalChapters, 0);
  const totalTests = totalChapters * 4;
  const overallProgress = Math.round(subjects.reduce((s, sub) => s + sub.progress, 0) / subjects.length);

  const RING_COLOR = "#7C3AED";

  return (
    <div style={{
      background: "linear-gradient(160deg,#070B14 0%,#0A0F1E 100%)",
      minHeight: "100vh", color: "#fff",
      fontFamily: "var(--font-geist-sans),-apple-system,sans-serif",
    }}>

      {/* ── NAVBAR (minimal, matching screenshots) ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px",
        background: "rgba(7,11,20,0.88)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, fontWeight: 900, fontSize: 12, color: "white",
            background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(124,58,237,0.4)",
          }}>DC</div>
          <span style={{ fontWeight: 900, fontSize: 16, background: "linear-gradient(135deg,#A78BFA,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NextGen</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/dashboard" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", fontWeight: 600 }}>Dashboard</Link>
          <Link href="/leaderboard" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", fontWeight: 600 }}>Leaderboard</Link>
          <Link href="/login" style={{
            padding: "7px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700,
            background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "white", textDecoration: "none",
          }}>Account</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "84px 28px 80px" }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontSize: 14 }}>
          <Link href="/" style={{ color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>Classes</Link>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>Class {activeClassNum}</span>
        </div>

        {/* ── CLASS HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#A78BFA", marginBottom: 14, letterSpacing: "0.05em" }}>
              {classLabel}
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, marginBottom: 12 }}>
              Class {activeClassNum}
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
              {subjects.length} subjects&nbsp;·&nbsp;{totalChapters} chapters&nbsp;·&nbsp;{totalTests} tests
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <CircularRing percent={overallProgress} color={RING_COLOR} size={120} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 8, fontWeight: 600 }}>Overall Progress</div>
          </div>
        </div>

        {/* ── CLASS SELECTOR ── */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, marginBottom: 28 }}>
          {CLASS_LIST.map((cls) => {
            const n = parseInt(cls.label);
            const active = activeClassNum === n;
            return (
              <button key={cls.id} onClick={() => setActiveClassNum(n)}
                style={{
                  padding: "6px 14px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
                  border: active ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  background: active ? "linear-gradient(135deg,#7C3AED,#5B21B6)" : "rgba(255,255,255,0.04)",
                  color: active ? "white" : "rgba(255,255,255,0.45)",
                  boxShadow: active ? "0 4px 14px rgba(124,58,237,0.3)" : "none",
                  transition: "all 0.18s ease",
                }}
              >Class {cls.label}</button>
            );
          })}
        </div>

        {/* ── TAB SWITCHER ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 5 }}>
          {(["subjects", "assessments"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer",
                border: "none", transition: "all 0.2s",
                background: activeTab === t ? "linear-gradient(135deg,#7C3AED,#5B21B6)" : "transparent",
                color: activeTab === t ? "white" : "rgba(255,255,255,0.45)",
                boxShadow: activeTab === t ? "0 4px 16px rgba(124,58,237,0.35)" : "none",
              }}
            >{t === "subjects" ? "📚 Subjects" : "🎯 Assessments"}</button>
          ))}
        </div>

        {/* ── SUBJECTS LIST ── */}
        {activeTab === "subjects" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {subjects.map((subj) => (
              <div key={subj.id}
                style={{
                  background: "rgba(255,255,255,0.035)", border: `1px solid rgba(255,255,255,0.08)`,
                  borderRadius: 20, padding: "26px 28px", transition: "all 0.25s ease", position: "relative", overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = `rgba(${subj.color === "#3B82F6" ? "59,130,246" : subj.color === "#06B6D4" ? "6,182,212" : subj.color === "#A78BFA" ? "124,58,237" : subj.color === "#F97316" ? "249,115,22" : subj.color === "#EC4899" ? "236,72,153" : subj.color === "#10B981" ? "16,185,129" : subj.color === "#EF4444" ? "239,68,68" : subj.color === "#F59E0B" ? "245,158,11" : subj.color === "#6366F1" ? "99,102,241" : "124,58,237"},0.06)`;
                  el.style.borderColor = `${subj.color}30`;
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.035)";
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Radial glow decoration */}
                <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle,${subj.color}18,transparent 70%)`, pointerEvents: "none" }} />

                <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 20, position: "relative", zIndex: 1 }}>
                  {/* Icon */}
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, fontSize: 26,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${subj.color}20`, border: `1px solid ${subj.color}35`,
                    flexShrink: 0,
                  }}>{subj.icon}</div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4, letterSpacing: "-0.3px" }}>{subj.name}</div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>{subj.description}</div>

                    {/* Stats row */}
                    <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                      <div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>{subj.totalChapters}</span>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>Chapters</span>
                      </div>
                      <div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>{subj.totalChapters * 4}</span>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>Tests</span>
                      </div>
                      <div>
                        <span style={{ fontSize: 16, fontWeight: 800, color: subj.color }}>{subj.progress}%</span>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>Complete</span>
                      </div>
                      {subj.score > 0 && (
                        <div>
                          <span style={{ fontSize: 16, fontWeight: 800, color: subj.score >= 80 ? "#10B981" : "#F59E0B" }}>{subj.score}%</span>
                          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>Avg. Score</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mini ring */}
                  <div style={{ flexShrink: 0 }}>
                    <CircularRing percent={subj.progress} color={subj.color} size={72} />
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden", marginBottom: 16, position: "relative", zIndex: 1 }}>
                  <div style={{
                    height: "100%", width: `${subj.progress}%`,
                    background: `linear-gradient(90deg,${subj.color},${subj.color}99)`,
                    borderRadius: 100, boxShadow: `0 0 8px ${subj.color}60`,
                    transition: "width 0.6s ease",
                  }} />
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 10, position: "relative", zIndex: 1 }}>
                  <Link href={`/subject/${subj.id}/${activeClassNum}`}
                    style={{
                      flex: 1, padding: "13px", borderRadius: 13, fontWeight: 700, fontSize: 15,
                      background: `linear-gradient(135deg,${subj.color},${subj.color}CC)`,
                      color: "white", textDecoration: "none", textAlign: "center",
                      boxShadow: `0 4px 16px ${subj.color}35`, display: "block",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${subj.color}50`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${subj.color}35`; }}
                  >Continue →</Link>
                  <Link href={`/assessment/mcq/${subj.id}-ch1`}
                    style={{
                      padding: "13px 20px", borderRadius: 13, fontWeight: 700, fontSize: 14,
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.75)", textDecoration: "none", whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                  >🎯 Quick Test</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ASSESSMENTS TAB ── */}
        {activeTab === "assessments" && (
          <div>
            {/* Summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Total Tests Available", value: totalTests, icon: "📝", color: "#A78BFA" },
                { label: "Tests Completed", value: Math.round(totalTests * 0.32), icon: "✅", color: "#10B981" },
                { label: "Average Score", value: `${Math.round(subjects.reduce((s, sub) => s + sub.score, 0) / subjects.filter(s => s.score > 0).length || 0)}%`, icon: "🎯", color: "#F59E0B" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "22px 24px" }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{stat.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: stat.color, letterSpacing: "-0.5px" }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Assessment cards per subject */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {subjects.map((subj) => (
                <div key={subj.id} style={{
                  background: "rgba(255,255,255,0.035)", border: `1px solid rgba(255,255,255,0.08)`,
                  borderRadius: 20, padding: "24px 28px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", background: `${subj.color}20`, border: `1px solid ${subj.color}30`, flexShrink: 0 }}>{subj.icon}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{subj.name}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                        {subj.totalChapters * 4} tests &nbsp;·&nbsp; Avg score: {subj.score > 0 ? `${subj.score}%` : "Not started"}
                      </div>
                    </div>
                    {subj.score > 0 && (
                      <div style={{ marginLeft: "auto" }}>
                        <CircularRing percent={subj.score} color={subj.score >= 80 ? "#10B981" : subj.score >= 60 ? "#F59E0B" : "#EF4444"} size={60} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                    {[
                      { type: "MCQ Test", desc: "Multiple choice · 20 questions", icon: "🔵", href: `/assessment/mcq/${subj.id}-ch1` },
                      { type: "Theory Exam", desc: "Long answer · 5 questions", icon: "📝", href: `/assessment/theory/${subj.id}-ch1` },
                      { type: "Chapter Quiz", desc: "Quick 10-min revision", icon: "⚡", href: `/assessment/mcq/${subj.id}-ch1` },
                    ].map((t) => (
                      <Link key={t.type} href={t.href}
                        style={{
                          padding: "14px 16px", borderRadius: 14, textDecoration: "none", color: "white",
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = `${subj.color}14`; el.style.borderColor = `${subj.color}30`; el.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.transform = ""; }}
                      >
                        <div style={{ fontSize: 18, marginBottom: 8 }}>{t.icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t.type}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>{t.desc}</div>
                        <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: subj.color }}>Start →</div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AI SUGGESTION ── */}
        <div style={{
          marginTop: 28, padding: "24px 28px", borderRadius: 20,
          background: "linear-gradient(135deg,rgba(6,182,212,0.08),rgba(124,58,237,0.06))",
          border: "1px solid rgba(6,182,212,0.25)",
          display: "flex", alignItems: "center", gap: 18,
        }}>
          <div style={{ fontSize: 36 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>AI Study Recommendation</div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              Based on your performance, focus on <span style={{ color: "#06B6D4", fontWeight: 700 }}>{[...subjects].sort((a, b) => a.score - b.score)[0]?.name}</span> today. Your weakest area has a{" "}
              <span style={{ color: "#F59E0B", fontWeight: 700 }}>{[...subjects].sort((a, b) => a.progress - b.progress)[0]?.progress}% completion rate</span>.
              Suggested study time: <span style={{ color: "#A78BFA", fontWeight: 700 }}>2 hours</span>.
            </p>
          </div>
          <Link href="/dashboard" style={{
            padding: "11px 22px", borderRadius: 12, fontWeight: 700, fontSize: 14,
            background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "white", textDecoration: "none", whiteSpace: "nowrap",
          }}>View Plan →</Link>
        </div>
      </main>
    </div>
  );
}
