"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ACHIEVEMENTS, LEADERBOARD_DATA, HEATMAP_DATA, MOTIVATIONAL_QUOTES, getSubjectsForClass,
} from "@/lib/data";

const STATS = [
  { label: "Chapters Mastered", value: 47, icon: "📚", color: "#A78BFA", bg: "rgba(124,58,237,0.14)", trend: "+3 this week", bar: 78 },
  { label: "Avg. Score", value: 84, icon: "🎯", color: "#06B6D4", bg: "rgba(6,182,212,0.14)", suffix: "%", trend: "+5% vs last week", bar: 84 },
  { label: "Day Streak", value: 12, icon: "🔥", color: "#F59E0B", bg: "rgba(245,158,11,0.14)", trend: "Personal best!", bar: 100 },
  { label: "Total XP", value: 11750, icon: "⚡", color: "#10B981", bg: "rgba(16,185,129,0.14)", trend: "+840 earned today", bar: 68 },
];

const RECENT = [
  { name: "Kinematics", subject: "Physics", progress: 100, score: 75, time: "2h ago", icon: "⚡", color: "#EF4444" },
  { name: "Chemical Bonding", subject: "Chemistry", progress: 60, score: 0, time: "Yesterday", icon: "🧪", color: "#F59E0B" },
  { name: "The Last Lesson", subject: "English", progress: 100, score: 90, time: "2 days ago", icon: "📖", color: "#A78BFA" },
  { name: "Sets & Relations", subject: "Maths", progress: 100, score: 95, time: "3 days ago", icon: "∑", color: "#3B82F6" },
];

const MISSIONS = [
  { title: "Complete 2 MCQ Tests", xp: 200, progress: 1, total: 2, icon: "🎯" },
  { title: "Study for 30 minutes", xp: 150, progress: 28, total: 30, unit: "min", icon: "⏱" },
  { title: "Review 1 Full Chapter", xp: 100, progress: 1, total: 1, icon: "📚" },
];

function AnimatedCounter({ end, duration = 1800 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function LevelRing() {
  const r = 66, circ = 2 * Math.PI * r, fill = circ * 0.68;
  return (
    <div style={{ position: "relative", width: 170, height: 170, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="170" height="170" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx="85" cy="85" r={r} fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="10" />
        <circle cx="85" cy="85" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={`${fill} ${circ - fill}`}
          transform="rotate(-90 85 85)" />
      </svg>
      <div style={{ position: "absolute", inset: 24, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg,#A78BFA,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>7</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#A78BFA", marginTop: 4 }}>Brain Forge</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>LEVEL</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [lightMode, setLightMode] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [aiInput, setAiInput] = useState("");
  const [aiMsgs, setAiMsgs] = useState([{ role: "ai", text: "Hello! I'm ARIA, your AI Tutor. Ask me anything — concepts, problems, study plans! 🎓" }]);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const subjects = getSubjectsForClass(11);

  useEffect(() => { document.body.className = lightMode ? "light-mode" : ""; }, [lightMode]);
  useEffect(() => {
    const iv = setInterval(() => setQuoteIdx(i => (i + 1) % MOTIVATIONAL_QUOTES.length), 6000);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [aiMsgs, isTyping]);

  const sendAI = () => {
    if (!aiInput.trim()) return;
    const msg = aiInput.trim();
    setAiMsgs(m => [...m, { role: "user", text: msg }]);
    setAiInput(""); setIsTyping(true);
    setTimeout(() => {
      const r = msg.toLowerCase();
      let reply = "Great question! Let me help you understand this better. Which chapter are you working on?";
      if (r.includes("physics")) reply = "Physics needs strong conceptual clarity. Focus on the 'why' before formulas. Want me to explain a specific topic?";
      else if (r.includes("maths") || r.includes("math")) reply = "Mathematics is about patterns! Practice 10 problems daily — want step-by-step help on a problem?";
      else if (r.includes("chemistry")) reply = "Chemistry connects to real-world phenomena. Visualize molecular structures. Which chapter is giving you trouble?";
      else if (r.includes("help")) reply = "I can help with: 📚 Concepts, 🧮 Problem solving, 📝 Study plans, 🎯 Exam strategies, 💡 Mnemonics!";
      else if (r.includes("quiz") || r.includes("test")) reply = "Head to Assessments! I've noticed weak spots in Kinematics — want me to create a targeted quiz?";
      setIsTyping(false);
      setAiMsgs(m => [...m, { role: "ai", text: reply }]);
    }, 1400);
  };

  const heatmapWeeks: typeof HEATMAP_DATA[] = [];
  for (let w = 0; w < 26; w++) heatmapWeeks.push(HEATMAP_DATA.slice(w * 7, w * 7 + 7));
  const quote = MOTIVATIONAL_QUOTES[quoteIdx];

  const S = (style: React.CSSProperties) => style;
  const card = S({ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, transition: "all 0.25s ease" });

  return (
    <div style={{ background: "var(--background)", color: "var(--foreground)", minHeight: "100vh" }}>
      {/* Aurora */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -200, left: -150, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,#7C3AED,transparent 70%)", opacity: 0.1, filter: "blur(90px)" }} />
        <div style={{ position: "absolute", top: "20%", right: -120, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,#06B6D4,transparent 70%)", opacity: 0.08, filter: "blur(90px)" }} />
      </div>

      <Navbar lightMode={lightMode} onToggleTheme={() => setLightMode(l => !l)} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "96px 24px 80px" }}>

        {/* ══ HERO BANNER ══ */}
        <section style={{
          ...card,
          background: "linear-gradient(135deg,rgba(124,58,237,0.18),rgba(6,182,212,0.08))",
          border: "1px solid rgba(124,58,237,0.22)",
          padding: "48px 52px", marginBottom: 28, position: "relative", overflow: "hidden",
          display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,#7C3AED,transparent 70%)", opacity: 0.2, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 100, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", fontSize: 11, fontWeight: 700, color: "#A78BFA", marginBottom: 18, letterSpacing: "0.02em" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", display: "inline-block", boxShadow: "0 0 8px #4ADE80" }} />
              AI-Powered Learning Active
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, marginBottom: 14, letterSpacing: "-1.5px" }}>
              Welcome back, <span style={{ background: "linear-gradient(135deg,#A78BFA,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Scholar! ✨</span>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, maxWidth: 520, marginBottom: 32 }}>
              You&apos;re on a <span style={{ color: "#F59E0B", fontWeight: 700 }}>🔥 12-day streak</span> and ranked <span style={{ color: "#A78BFA", fontWeight: 800 }}>#8 Nationally</span>. 3 missions remaining today!
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/class/class-11" style={{ padding: "12px 32px", borderRadius: 14, fontWeight: 700, fontSize: 15, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "white", textDecoration: "none", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>▶ Continue Learning</Link>
              <Link href="/assessment/mcq/physics-ch3" style={{ padding: "12px 28px", borderRadius: 14, fontWeight: 700, fontSize: 15, background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.35)", color: "#06B6D4", textDecoration: "none" }}>🎯 Take Assessment</Link>
              <Link href="/leaderboard" style={{ padding: "12px 28px", borderRadius: 14, fontWeight: 700, fontSize: 15, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", textDecoration: "none" }}>🏆 Leaderboard</Link>
            </div>
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <LevelRing />
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>11,750 / 17,500 XP</div>
              <div style={{ width: 170, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "68%", background: "linear-gradient(90deg,#7C3AED,#06B6D4)", borderRadius: 100 }} />
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS STRIP ══ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ ...card, padding: "22px 24px", cursor: "default" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.3)`; el.style.borderColor = `${s.color}30`; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; el.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.5px" }}>
                  <AnimatedCounter end={s.value} />{s.suffix || ""}
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: s.bg }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>{s.label}</div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ height: "100%", width: `${s.bar}%`, background: `linear-gradient(90deg,${s.color},${s.color}88)`, borderRadius: 100 }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{s.trend}</div>
            </div>
          ))}
        </div>

        {/* ══ MAIN 2-COL GRID ══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>

          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Continue Learning */}
            <div style={{ ...card, padding: "28px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800 }}>Continue Learning</h2>
                <Link href="/class/class-11" style={{ fontSize: 13, color: "#A78BFA", textDecoration: "none", fontWeight: 600 }}>View All →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {RECENT.map((ch) => (
                  <div key={ch.name} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14, borderLeft: `3px solid ${ch.color}`, transition: "all 0.2s", cursor: "pointer",
                  }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = `${ch.color}0D`; el.style.borderColor = `${ch.color}30`; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.03)"; el.style.borderColor = "rgba(255,255,255,0.06)"; }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: `${ch.color}20`, flexShrink: 0 }}>{ch.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{ch.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{ch.subject} · {ch.time}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {ch.score > 0 && <div style={{ fontSize: 15, fontWeight: 800, color: ch.score >= 80 ? "#10B981" : "#F59E0B" }}>{ch.score}%</div>}
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{ch.progress}% done</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Heatmap */}
            <div style={{ ...card, padding: "28px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800 }}>Study Activity</h2>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Last 6 months</div>
              </div>
              <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
                {heatmapWeeks.map((week, wi) => (
                  <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {week.map((day, di) => (
                      <div key={di} title={day.date} style={{
                        width: 13, height: 13, borderRadius: 3,
                        background: day.level === 0 ? "rgba(255,255,255,0.05)"
                          : day.level === 1 ? "rgba(124,58,237,0.25)"
                          : day.level === 2 ? "rgba(124,58,237,0.45)"
                          : day.level === 3 ? "rgba(124,58,237,0.65)"
                          : "#7C3AED",
                      }} />
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 28, marginTop: 20 }}>
                {[["12", "Longest Streak"], ["18", "Active Days"], ["47h", "Total Study"]].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#A78BFA" }}>{v}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects Quick Access */}
            <div style={{ ...card, padding: "28px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800 }}>My Subjects — Class 11</h2>
                <Link href="/class/class-11" style={{ fontSize: 13, color: "#A78BFA", textDecoration: "none", fontWeight: 600 }}>Full View →</Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {subjects.slice(0, 6).map((s) => (
                  <Link key={s.id} href={`/subject/${s.id}/11`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      padding: "18px 16px", background: "rgba(255,255,255,0.03)", border: `1px solid ${s.color}20`,
                      borderRadius: 14, transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", cursor: "pointer",
                    }}
                      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-6px) scale(1.02)"; el.style.background = `${s.color}12`; el.style.borderColor = `${s.color}40`; el.style.boxShadow = `0 16px 40px ${s.color}20`; }}
                      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.background = "rgba(255,255,255,0.03)"; el.style.borderColor = `${s.color}20`; el.style.boxShadow = ""; }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{s.name}</div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden", marginBottom: 6 }}>
                        <div style={{ height: "100%", width: `${s.progress}%`, background: `linear-gradient(90deg,${s.color},${s.color}88)`, borderRadius: 100 }} />
                      </div>
                      <div style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.progress}%</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ARIA AI Tutor */}
            <div style={{ ...card, padding: "28px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🤖</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, background: "linear-gradient(135deg,#A78BFA,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ARIA AI Tutor</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Always available · Powered by Claude</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Physics", "Maths", "Chemistry"].map((s) => (
                    <button key={s} onClick={() => setAiInput(`Explain ${s} for me`)}
                      style={{ padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#A78BFA", cursor: "pointer" }}
                    >{s}</button>
                  ))}
                </div>
              </div>
              <div ref={chatRef} style={{ height: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 14, paddingRight: 4 }}>
                {aiMsgs.map((m, i) => (
                  <div key={i} style={{
                    maxWidth: "85%", padding: "11px 15px", borderRadius: m.role === "ai" ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
                    alignSelf: m.role === "ai" ? "flex-start" : "flex-end",
                    background: m.role === "ai" ? "rgba(124,58,237,0.1)" : "rgba(6,182,212,0.12)",
                    border: m.role === "ai" ? "1px solid rgba(124,58,237,0.2)" : "1px solid rgba(6,182,212,0.2)",
                    fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.85)",
                  }}>
                    {m.role === "ai" && <div style={{ fontSize: 10, fontWeight: 700, color: "#A78BFA", marginBottom: 4 }}>ARIA ✦</div>}
                    {m.text}
                  </div>
                ))}
                {isTyping && (
                  <div style={{ maxWidth: "85%", padding: "11px 15px", borderRadius: "18px 18px 18px 4px", alignSelf: "flex-start", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#A78BFA", marginBottom: 4 }}>ARIA ✦</div>
                    <span style={{ fontSize: 18, letterSpacing: 4 }}>···</span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendAI()}
                  placeholder="Ask ARIA anything..."
                  style={{ flex: 1, padding: "11px 16px", borderRadius: 12, fontSize: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }}
                />
                <button onClick={sendAI}
                  style={{ padding: "11px 20px", borderRadius: 12, fontWeight: 700, fontSize: 14, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "white", border: "none", cursor: "pointer" }}
                >Ask ✦</button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Daily Missions */}
            <div style={{ ...card, padding: "24px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>Daily Missions</h2>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B" }}>450 XP total</div>
              </div>
              {MISSIONS.map((m) => {
                const pct = Math.round((m.progress / m.total) * 100);
                const done = pct >= 100;
                return (
                  <div key={m.title} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16 }}>{m.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: done ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.85)", textDecoration: done ? "line-through" : "none" }}>{m.title}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, background: "linear-gradient(90deg,#F59E0B,#FCD34D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>+{m.xp} XP</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: done ? "linear-gradient(90deg,#10B981,#34D399)" : "linear-gradient(90deg,#7C3AED,#A78BFA)", borderRadius: 100, transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4, textAlign: "right" }}>{m.progress}/{m.total}{m.unit ? ` ${m.unit}` : ""}</div>
                  </div>
                );
              })}
            </div>

            {/* Streak Tracker */}
            <div style={{ ...card, padding: "24px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>Streak Tracker</h2>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#F59E0B" }}>🔥 12</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 16 }}>
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 6, fontWeight: 600 }}>{d}</div>
                    <div style={{
                      width: "100%", aspectRatio: "1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                      background: i < 5 ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.04)",
                      border: i < 5 ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.07)",
                      fontSize: 14,
                    }}>{i < 5 ? "🔥" : ""}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>Keep going! Best streak: 12 days</div>
            </div>

            {/* Quote card */}
            <div style={{ ...card, padding: "22px 22px", background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(6,182,212,0.06))", border: "1px solid rgba(124,58,237,0.18)" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>💡</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, fontStyle: "italic", marginBottom: 10 }}>"{quote.quote}"</p>
              <div style={{ fontSize: 12, color: "#A78BFA", fontWeight: 600 }}>— {quote.author}</div>
            </div>

            {/* Leaderboard preview */}
            <div style={{ ...card, padding: "24px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>Leaderboard</h2>
                <Link href="/leaderboard" style={{ fontSize: 12, color: "#A78BFA", textDecoration: "none", fontWeight: 600 }}>Full Board →</Link>
              </div>
              {LEADERBOARD_DATA.slice(0, 5).map((u, i) => (
                <div key={u.rank} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, marginBottom: 6,
                  background: u.name === "You" ? "rgba(124,58,237,0.12)" : i < 3 ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
                  border: u.name === "You" ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                }}>
                  <div style={{ width: 22, fontWeight: 800, fontSize: 14, color: u.rank === 1 ? "#F59E0B" : u.rank === 2 ? "rgba(255,255,255,0.6)" : u.rank === 3 ? "#CD7F32" : "rgba(255,255,255,0.3)", textAlign: "center" }}>
                    {u.rank <= 3 ? ["🥇", "🥈", "🥉"][u.rank - 1] : `#${u.rank}`}
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: u.name === "You" ? "linear-gradient(135deg,#7C3AED,#5B21B6)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white" }}>{u.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: u.name === "You" ? "#A78BFA" : "rgba(255,255,255,0.85)" }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Class {u.class}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>{u.score.toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Achievements preview */}
            <div style={{ ...card, padding: "24px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>Achievements</h2>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length} unlocked</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                {ACHIEVEMENTS.slice(0, 8).map((a) => (
                  <div key={a.id} title={a.title}
                    style={{
                      padding: "12px 8px", borderRadius: 12, textAlign: "center",
                      background: a.unlocked ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                      border: a.unlocked
                        ? a.rarity === "legendary" ? "1px solid rgba(245,158,11,0.4)"
                          : a.rarity === "epic" ? "1px solid rgba(124,58,237,0.35)"
                          : "1px solid rgba(255,255,255,0.1)"
                        : "1px solid rgba(255,255,255,0.04)",
                      opacity: a.unlocked ? 1 : 0.4, cursor: "default",
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 5, filter: a.unlocked ? "none" : "grayscale(100%)" }}>{a.icon}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", lineHeight: 1.3 }}>{a.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
