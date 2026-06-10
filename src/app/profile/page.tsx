"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { ACHIEVEMENTS } from "@/lib/data";
import { fetchSubjects, type Subject } from "@/lib/api";
import { computeStats, getQuizResults, buildHeatmap } from "@/lib/progress";

export default function ProfilePage() {
  const [lightMode,  setLightMode]  = useState(false);
  const [activeTab,  setActiveTab]  = useState<"overview" | "journey" | "achievements" | "skills">("overview");
  const [subjects,   setSubjects]   = useState<Subject[]>([]);
  const [userClass,  setUserClass]  = useState(11);
  const [stats,      setStats]      = useState<ReturnType<typeof computeStats> | null>(null);
  const [heatmap,    setHeatmap]    = useState<{ date: string; level: 0|1|2|3|4 }[]>([]);
  const { data: session } = useSession();

  const user       = session?.user;
  const userName   = user?.name  ?? "DC NextGen Scholar";
  const userEmail  = user?.email ?? "";
  const userImage  = user?.image ?? null;
  const initials   = userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    const cls = parseInt(localStorage.getItem("userClass") ?? "11");
    setUserClass(cls);
    fetchSubjects(cls).then(setSubjects);
    const st = computeStats();
    setStats(st);
    setHeatmap(buildHeatmap());
  }, []);

  useEffect(() => { document.body.className = lightMode ? "light-mode" : ""; }, [lightMode]);

  const quizResults  = typeof window !== "undefined" ? getQuizResults() : [];
  const recentTests  = quizResults.slice(-5).reverse();
  const st           = stats;

  // Subject performance from quiz history
  const subjectPerf: Record<string, { scores: number[]; name: string }> = {};
  for (const r of quizResults) {
    if (!subjectPerf[r.subjectId]) subjectPerf[r.subjectId] = { scores: [], name: r.subjectId };
    subjectPerf[r.subjectId].scores.push(r.score);
  }
  // Merge with loaded subjects
  subjects.forEach(s => {
    if (!subjectPerf[s.id]) subjectPerf[s.id] = { scores: [], name: s.name };
    else subjectPerf[s.id].name = s.name;
  });

  const heatmapWeeks: typeof heatmap[] = [];
  for (let w = 0; w < 26; w++) heatmapWeeks.push(heatmap.slice(w * 7, w * 7 + 7));

  const overviewStats = [
    { label: "Tests Completed", value: st?.testsCompleted ? String(st.testsCompleted) : "0",     icon: "📝", color: "#A78BFA" },
    { label: "Average Score",   value: st?.accuracy       ? `${st.accuracy}%`          : "—",    icon: "🎯", color: "#06B6D4" },
    { label: "Day Streak",      value: st?.streak         ? `${st.streak}d`             : "0d",   icon: "🔥", color: "#F59E0B" },
    { label: "Study Hours",     value: st?.studyHours     ? `${st.studyHours}h`         : "0h",   icon: "⏱", color: "#10B981" },
  ];

  // Skill tree derived from quiz results
  const mcqResults     = quizResults.filter(r => r.type === "mcq");
  const theoryResults  = quizResults.filter(r => r.type === "theory");
  const avgMCQ         = mcqResults.length ? Math.round(mcqResults.reduce((s, r) => s + r.score, 0) / mcqResults.length) : 0;
  const avgTheory      = theoryResults.length ? Math.round(theoryResults.reduce((s, r) => s + r.score, 0) / theoryResults.length) : 0;
  const totalQ         = quizResults.reduce((s, r) => s + r.questionsTotal, 0);
  const correctQ       = quizResults.reduce((s, r) => s + r.questionsCorrect, 0);
  const speedAccuracy  = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;

  const SKILL_TREE = [
    { name: "MCQ Performance",       value: avgMCQ,       color: "#A78BFA" },
    { name: "Theory Writing",        value: avgTheory,     color: "#3B82F6" },
    { name: "Speed & Accuracy",      value: speedAccuracy, color: "#06B6D4" },
    { name: "Consistency (Streak)",  value: Math.min(st?.streak ? st.streak * 7 : 0, 100), color: "#10B981" },
    { name: "Subject Coverage",      value: Math.min(Object.keys(subjectPerf).filter(k => subjectPerf[k].scores.length > 0).length * 15, 100), color: "#F59E0B" },
    { name: "Overall Progress",      value: st?.xpProgress ?? 0, color: "#EF4444" },
  ];

  // Journey milestones based on real activity
  const MILESTONES = [
    { event: "Joined DC NextGen",              done: true,                               icon: "🚀", color: "#7C3AED" },
    { event: "First quiz completed",           done: quizResults.length >= 1,            icon: "📝", color: "#3B82F6" },
    { event: "5 quizzes completed",           done: quizResults.length >= 5,            icon: "🎯", color: "#10B981" },
    { event: "First perfect score (100%)",    done: quizResults.some(r => r.score === 100), icon: "💯", color: "#F59E0B" },
    { event: "3-day streak achieved",         done: (st?.streak ?? 0) >= 3,             icon: "🔥", color: "#EF4444" },
    { event: "7-day streak achieved",         done: (st?.streak ?? 0) >= 7,             icon: "⚡", color: "#F59E0B" },
    { event: "Level 3 reached",               done: (st?.level ?? 0) >= 3,              icon: "🧠", color: "#A78BFA" },
    { event: "Level 5 reached",               done: (st?.level ?? 0) >= 5,              icon: "🏆", color: "#06B6D4" },
    { event: "20 quizzes completed",          done: quizResults.length >= 20,           icon: "🌟", color: "#F59E0B" },
    { event: "Grand Master level",            done: (st?.level ?? 0) >= 10,             icon: "👑", color: "#F59E0B" },
  ];

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Navbar lightMode={lightMode} onToggleTheme={() => setLightMode(l => !l)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-8">

        {/* Profile Card */}
        <div className="glass-card p-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(6,182,212,0.1))", border: "1px solid rgba(124,58,237,0.3)" }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle,#7C3AED,transparent)", transform: "translate(50%,-50%)" }} />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-3xl text-white glow-primary overflow-hidden"
                style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)" }}>
                {userImage
                  ? <Image src={userImage} alt={userName} width={96} height={96} className="object-cover w-full h-full" />
                  : initials}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white"
                style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
                {st?.level ?? 1}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black mb-0.5">{userName}</h1>
              <div className="text-sm mb-3" style={{ color: "#A78BFA" }}>
                Class {userClass} · {userEmail || "Student"} · {st?.levelName ?? "Beginner"}
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                {[
                  { icon: "⚡", label: `${(st?.xp ?? 0).toLocaleString()} XP`,    color: "#A78BFA" },
                  { icon: "🔥", label: `${st?.streak ?? 0} Day Streak`,            color: "#F59E0B" },
                  { icon: "📝", label: `${st?.testsCompleted ?? 0} Tests`,         color: "#10B981" },
                  { icon: "🎯", label: `${st?.accuracy ?? 0}% Accuracy`,           color: "#06B6D4" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.08)", color: s.color }}>
                    <span>{s.icon}</span>
                    <span className="font-bold text-xs">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="xp-bar w-32 mb-1">
                <div className="xp-fill" style={{ width: `${st?.xpProgress ?? 0}%` }} />
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Level {st?.level ?? 1} → {(st?.level ?? 1) + 1}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#A78BFA" }}>
                {(st?.xpForNext ?? 500) - (st?.xp ?? 0) > 0
                  ? `${((st?.xpForNext ?? 500) - (st?.xp ?? 0)).toLocaleString()} XP to next level`
                  : "Max level reached!"}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: "overview",      label: "📊 Overview" },
            { id: "journey",       label: "🗺️ Journey" },
            { id: "achievements",  label: "🏅 Achievements" },
            { id: "skills",        label: "🎯 Skills" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
              style={{
                background: activeTab === tab.id ? "linear-gradient(135deg,#7C3AED,#5B21B6)" : "var(--card-bg)",
                color:  activeTab === tab.id ? "white" : "var(--text-muted)",
                border: `1px solid ${activeTab === tab.id ? "rgba(124,58,237,0.5)" : "var(--card-border)"}`,
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {overviewStats.map((s, i) => (
                <div key={i} className="glass-card p-5 text-center">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-black text-2xl" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Subject Performance */}
            <div className="glass-card p-6">
              <h3 className="font-black text-lg mb-5">Subject Performance</h3>
              {subjects.length === 0 ? (
                <div className="text-center py-6" style={{ color: "var(--text-muted)" }}>Loading subjects…</div>
              ) : (
                <div className="space-y-4">
                  {subjects.map(subj => {
                    const perf = subjectPerf[subj.id];
                    const avg  = perf && perf.scores.length > 0 ? Math.round(perf.scores.reduce((s, n) => s + n, 0) / perf.scores.length) : 0;
                    return (
                      <div key={subj.id} className="flex items-center gap-4">
                        <div className="text-xl w-8 flex-shrink-0">{subj.icon}</div>
                        <div className="font-medium text-sm w-28 flex-shrink-0">{subj.name}</div>
                        <div className="flex-1 progress-bar">
                          <div className="progress-fill" style={{ width: `${avg}%`, background: `linear-gradient(90deg,${subj.color},${subj.color}88)` }} />
                        </div>
                        <div className="text-sm font-bold w-12 text-right" style={{ color: subj.color }}>{avg > 0 ? `${avg}%` : "—"}</div>
                        <div className="text-xs w-16 text-right" style={{ color: "var(--text-muted)" }}>
                          {perf && perf.scores.length > 0 ? `${perf.scores.length} test${perf.scores.length > 1 ? "s" : ""}` : "No tests"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h3 className="font-black text-lg mb-5">Recent Test History</h3>
              {recentTests.length === 0 ? (
                <div className="text-center py-6 space-y-3" style={{ color: "var(--text-muted)" }}>
                  <div className="text-4xl">📝</div>
                  <div>No tests yet — take your first quiz to see results here!</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTests.map((r, i) => {
                    const subj = subjects.find(s => s.id === r.subjectId);
                    const label = subj?.name ?? r.subjectId;
                    const scoreColor = r.score >= 80 ? "#10B981" : r.score >= 60 ? "#F59E0B" : "#EF4444";
                    const dateStr = new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                    return (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--card-border)" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: r.type === "mcq" ? "rgba(124,58,237,0.2)" : "rgba(6,182,212,0.2)" }}>
                          {r.type === "mcq" ? "🎯" : "📝"}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{r.type === "mcq" ? "MCQ Test" : "Theory Paper"}</div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {label} · {r.chapterId} · {r.questionsCorrect}/{r.questionsTotal} correct
                          </div>
                        </div>
                        <div className="text-sm font-black" style={{ color: scoreColor }}>{r.score}%</div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{dateStr}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Activity Heatmap */}
            <div className="glass-card p-6">
              <h3 className="font-black text-lg mb-5">Study Activity — Last 26 Weeks</h3>
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
            </div>
          </div>
        )}

        {/* ── JOURNEY ── */}
        {activeTab === "journey" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-black text-lg mb-6">🗺️ Your Learning Journey</h3>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ background: "rgba(124,58,237,0.3)" }} />
                <div className="space-y-6">
                  {MILESTONES.map((m, i) => (
                    <div key={i} className="relative flex gap-5 pl-12">
                      <div className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{
                          background: m.done ? `${m.color}30` : "rgba(255,255,255,0.05)",
                          border: `2px solid ${m.done ? m.color : "rgba(255,255,255,0.1)"}`,
                          opacity: m.done ? 1 : 0.5,
                        }}>
                        {m.icon}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="font-bold text-sm mb-0.5"
                          style={{ color: m.done ? "var(--foreground)" : "var(--text-muted)" }}>
                          {m.event}
                        </div>
                        {!m.done && <div className="text-xs mt-1" style={{ color: m.color }}>🔒 Not yet unlocked</div>}
                      </div>
                      {m.done && <div className="text-green-400 text-sm">✓</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-6 text-center">
              <h3 className="font-black text-lg mb-5">📊 Overall Completion</h3>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {[
                  { label: "Journey Progress", value: Math.round((MILESTONES.filter(m => m.done).length / MILESTONES.length) * 100), color: "#7C3AED" },
                  { label: "XP Progress",      value: st?.xpProgress ?? 0,                                                            color: "#06B6D4" },
                  { label: "Test Accuracy",    value: st?.accuracy   ?? 0,                                                            color: "#10B981" },
                ].map((item, i) => {
                  const r = 40, circ = 2 * Math.PI * r, dash = (item.value / 100) * circ;
                  return (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <circle cx="50" cy="50" r={r} fill="none" stroke={item.color} strokeWidth="8"
                          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
                        <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" fontSize="16"
                          fontWeight="bold" fill={item.color} transform="rotate(90,50,50)">
                          {item.value}%
                        </text>
                      </svg>
                      <div className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>{item.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── ACHIEVEMENTS ── */}
        {activeTab === "achievements" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-black text-xl">Achievements</div>
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {ACHIEVEMENTS.filter(a => a.unlocked).length} / {ACHIEVEMENTS.length} unlocked
                </div>
              </div>
              <div className="xp-bar w-32">
                <div className="xp-fill" style={{ width: `${(ACHIEVEMENTS.filter(a => a.unlocked).length / ACHIEVEMENTS.length) * 100}%` }} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map(ach => (
                <div key={ach.id} className="glass-card p-5 relative overflow-hidden"
                  style={{
                    border: `1px solid ${ach.unlocked ? ach.rarity === "legendary" ? "rgba(245,158,11,0.5)" : ach.rarity === "epic" ? "rgba(124,58,237,0.4)" : ach.rarity === "rare" ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
                    opacity: ach.unlocked ? 1 : 0.5,
                  }}>
                  {ach.unlocked && (
                    <div className="absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl-xl"
                      style={{ background: ach.rarity === "legendary" ? "#F59E0B" : ach.rarity === "epic" ? "#7C3AED" : ach.rarity === "rare" ? "#3B82F6" : "rgba(255,255,255,0.1)", color: "white" }}>
                      {ach.rarity}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: ach.unlocked ? ach.rarity === "legendary" ? "linear-gradient(135deg,#F59E0B,#D97706)" : ach.rarity === "epic" ? "linear-gradient(135deg,#7C3AED,#A78BFA)" : ach.rarity === "rare" ? "linear-gradient(135deg,#3B82F6,#06B6D4)" : "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", filter: ach.unlocked ? "none" : "grayscale(100%)" }}>
                      {ach.unlocked ? ach.icon : "🔒"}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-sm">{ach.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{ach.description}</div>
                      <div className="text-xs mt-1 font-bold" style={{ color: ach.unlocked ? "#F59E0B" : "var(--text-muted)" }}>
                        {ach.unlocked ? `+${ach.xp} XP earned` : `${ach.xp} XP locked`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-black text-lg mb-6">🎯 Skill Analysis — Based on Your Tests</h3>
              <div className="space-y-5">
                {SKILL_TREE.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="font-black" style={{ color: skill.color }}>{skill.value}%</span>
                    </div>
                    <div className="progress-bar h-3">
                      <div className="h-full rounded-full"
                        style={{ width: `${skill.value}%`, background: `linear-gradient(90deg,${skill.color},${skill.color}88)`, transition: "width 1.5s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
              {quizResults.length === 0 && (
                <div className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  Take quizzes to populate your skill analysis!
                </div>
              )}
            </div>

            <div className="glass-card p-6" style={{ border: "1px solid rgba(6,182,212,0.3)" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl animate-float">🤖</span>
                <div className="font-black">AI-Powered Skill Insights</div>
              </div>
              <div className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                {quizResults.length === 0 ? (
                  <p>Complete some quizzes and theory tests to get personalized skill insights!</p>
                ) : (
                  <>
                    {avgMCQ > 0 && (
                      <p><span className="font-bold" style={{ color: "#10B981" }}>MCQ Strength:</span> {avgMCQ}% average — {avgMCQ >= 80 ? "Excellent recall and application!" : avgMCQ >= 60 ? "Good progress, keep practicing conceptual questions." : "Focus on understanding concepts before attempting MCQs."}</p>
                    )}
                    {avgTheory > 0 && (
                      <p><span className="font-bold" style={{ color: "#F59E0B" }}>Theory Writing:</span> {avgTheory}% average — {avgTheory >= 70 ? "Strong answer writing skills!" : "Practice structured answers: Definition → Explanation → Example."}</p>
                    )}
                    <p><span className="font-bold" style={{ color: "#06B6D4" }}>Suggested Plan:</span> {st?.streak ? `${st.streak}-day streak is great! ` : "Build a daily study habit. "}Focus on {Object.entries(subjectPerf).filter(([,v]) => v.scores.length > 0).sort((a, b) => {
                      const avgA = a[1].scores.reduce((s, n) => s + n, 0) / a[1].scores.length;
                      const avgB = b[1].scores.reduce((s, n) => s + n, 0) / b[1].scores.length;
                      return avgA - avgB;
                    })[0]?.[1]?.name ?? "your weakest subject"} for improvement.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
