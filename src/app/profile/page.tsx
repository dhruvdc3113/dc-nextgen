"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { ACHIEVEMENTS } from "@/lib/data";
import { fetchSubjects, type Subject } from "@/lib/api";

const JOURNEY_MILESTONES = [
  { date: "Jan 2025", event: "Joined DC NextGen", icon: "🚀", color: "#7C3AED", completed: true },
  { date: "Jan 2025", event: "Completed first chapter", icon: "📚", color: "#3B82F6", completed: true },
  { date: "Feb 2025", event: "First MCQ perfect score", icon: "💯", color: "#10B981", completed: true },
  { date: "Feb 2025", event: "Reached Brain Forge Level", icon: "🧠", color: "#F59E0B", completed: true },
  { date: "Mar 2025", event: "7-day streak achieved", icon: "🔥", color: "#EF4444", completed: true },
  { date: "Apr 2025", event: "12-day streak (current)", icon: "⚡", color: "#F59E0B", completed: true },
  { date: "May 2025", event: "Titan Challenge unlock", icon: "🏆", color: "#94A3B8", completed: false },
  { date: "Jun 2025", event: "Chapter Master Badge", icon: "🌟", color: "#94A3B8", completed: false },
];

const SKILL_TREE = [
  { name: "Conceptual Understanding", value: 82, color: "#A78BFA" },
  { name: "Problem Solving", value: 74, color: "#3B82F6" },
  { name: "Application & HOTS", value: 65, color: "#06B6D4" },
  { name: "Speed & Accuracy", value: 78, color: "#10B981" },
  { name: "Theory Writing", value: 70, color: "#F59E0B" },
  { name: "Memory & Retention", value: 85, color: "#EF4444" },
];

export default function ProfilePage() {
  const [lightMode, setLightMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "journey" | "achievements" | "skills">("overview");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [userClass, setUserClass] = useState(11);
  const { data: session } = useSession();

  const user = session?.user;
  const userName = user?.name ?? "DC NextGen Scholar";
  const userEmail = user?.email ?? "";
  const userImage = user?.image ?? null;
  const initials = userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    const cls = parseInt(localStorage.getItem("userClass") ?? "11");
    setUserClass(cls);
    fetchSubjects(cls).then(setSubjects);
  }, []);

  useEffect(() => {
    document.body.className = lightMode ? "light-mode" : "";
  }, [lightMode]);

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Navbar lightMode={lightMode} onToggleTheme={() => setLightMode((l) => !l)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-8">
        {/* Profile Card */}
        <div
          className="glass-card p-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(6,182,212,0.1))", border: "1px solid rgba(124,58,237,0.3)" }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle,#7C3AED,transparent)", transform: "translate(50%,-50%)" }} />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-3xl text-white glow-primary overflow-hidden"
                style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)" }}
              >
                {userImage ? (
                  <Image src={userImage} alt={userName} width={96} height={96} className="object-cover w-full h-full" />
                ) : initials}
              </div>
              <div
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white"
                style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}
              >
                7
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black mb-0.5">{userName}</h1>
              <div className="text-sm mb-3" style={{ color: "#A78BFA" }}>Class {userClass} · {userEmail || "Student"}</div>
              <div className="flex flex-wrap gap-3 text-sm">
                {[
                  { icon: "⚡", label: "11,750 XP", color: "#A78BFA" },
                  { icon: "🔥", label: "12 Day Streak", color: "#F59E0B" },
                  { icon: "🏆", label: "Rank #8", color: "#10B981" },
                  { icon: "📚", label: "47 Chapters", color: "#06B6D4" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.08)", color: stat.color }}>
                    <span>{stat.icon}</span>
                    <span className="font-bold text-xs">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="xp-bar w-32 mb-1">
                <div className="xp-fill" style={{ width: "68%" }} />
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>Level 7 → 8</div>
              <div className="text-xs mt-0.5" style={{ color: "#A78BFA" }}>5,750 XP needed</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "journey", label: "🗺️ Learning Journey" },
            { id: "achievements", label: "🏅 Achievements" },
            { id: "skills", label: "🎯 Skill Tree" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
              style={{
                background: activeTab === tab.id ? "linear-gradient(135deg,#7C3AED,#5B21B6)" : "var(--card-bg)",
                color: activeTab === tab.id ? "white" : "var(--text-muted)",
                border: `1px solid ${activeTab === tab.id ? "rgba(124,58,237,0.5)" : "var(--card-border)"}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Tests Completed", value: "38", icon: "📝", color: "#A78BFA" },
                { label: "Average Score", value: "84%", icon: "🎯", color: "#06B6D4" },
                { label: "Perfect Scores", value: "4", icon: "💯", color: "#F59E0B" },
                { label: "Study Hours", value: "127h", icon: "⏱", color: "#10B981" },
              ].map((s, i) => (
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
              <div className="space-y-4">
                {subjects.map((subj) => (
                  <div key={subj.id} className="flex items-center gap-4">
                    <div className="text-xl w-8 flex-shrink-0">{subj.icon}</div>
                    <div className="font-medium text-sm w-28 flex-shrink-0">{subj.name}</div>
                    <div className="flex-1 progress-bar">
                      <div className="progress-fill" style={{ width: `${subj.progress}%`, background: `linear-gradient(90deg,${subj.color},${subj.color}88)` }} />
                    </div>
                    <div className="text-sm font-bold w-10 text-right" style={{ color: subj.color }}>{subj.progress}%</div>
                    <div className="text-xs w-10 text-right font-bold"
                      style={{ color: subj.score >= 80 ? "#10B981" : subj.score >= 60 ? "#F59E0B" : "#EF4444" }}>
                      {subj.score > 0 ? `${subj.score}%` : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h3 className="font-black text-lg mb-5">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: "Completed MCQ", detail: "Kinematics · 75% accuracy", time: "2h ago", icon: "🎯", color: "#10B981" },
                  { action: "Started Chapter", detail: "Chemical Bonding · 60% done", time: "Yesterday", icon: "📖", color: "#3B82F6" },
                  { action: "Earned Badge", detail: "Night Owl · +75 XP", time: "2 days ago", icon: "🦉", color: "#F59E0B" },
                  { action: "Theory Test", detail: "Kinematics · Explorer Mode", time: "3 days ago", icon: "📝", color: "#7C3AED" },
                  { action: "Streak Milestone", detail: "10-day streak achieved", time: "4 days ago", icon: "🔥", color: "#EF4444" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--card-border)" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${a.color}20` }}>
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{a.action}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{a.detail}</div>
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* JOURNEY */}
        {activeTab === "journey" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-black text-lg mb-6">🗺️ Your Learning Journey</h3>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ background: "rgba(124,58,237,0.3)" }} />
                <div className="space-y-6">
                  {JOURNEY_MILESTONES.map((milestone, i) => (
                    <div key={i} className="relative flex gap-5 pl-12">
                      <div
                        className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{
                          background: milestone.completed ? `${milestone.color}30` : "rgba(255,255,255,0.05)",
                          border: `2px solid ${milestone.completed ? milestone.color : "rgba(255,255,255,0.1)"}`,
                          opacity: milestone.completed ? 1 : 0.5,
                        }}
                      >
                        {milestone.icon}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="font-bold text-sm mb-0.5"
                          style={{ color: milestone.completed ? "var(--foreground)" : "var(--text-muted)" }}>
                          {milestone.event}
                        </div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{milestone.date}</div>
                        {!milestone.completed && (
                          <div className="text-xs mt-1" style={{ color: milestone.color }}>🔒 Not yet unlocked</div>
                        )}
                      </div>
                      {milestone.completed && (
                        <div className="text-green-400 text-sm">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Completion wheel */}
            <div className="glass-card p-6 text-center">
              <h3 className="font-black text-lg mb-5">📊 Overall Completion</h3>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {[
                  { label: "Journey Progress", value: 62, color: "#7C3AED" },
                  { label: "Chapter Mastery", value: 47, color: "#06B6D4" },
                  { label: "Assessment Coverage", value: 38, color: "#10B981" },
                ].map((item, i) => {
                  const r = 40, circ = 2 * Math.PI * r;
                  const dash = (item.value / 100) * circ;
                  return (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <circle cx="50" cy="50" r={r} fill="none" stroke={item.color} strokeWidth="8"
                          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
                        <text x="50" y="50" dominantBaseline="middle" textAnchor="middle"
                          fontSize="16" fontWeight="bold" fill={item.color} transform="rotate(90,50,50)">
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

        {/* ACHIEVEMENTS */}
        {activeTab === "achievements" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-black text-xl">Achievements</div>
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {ACHIEVEMENTS.filter((a) => a.unlocked).length} / {ACHIEVEMENTS.length} unlocked
                </div>
              </div>
              <div className="xp-bar w-32">
                <div className="xp-fill" style={{ width: `${(ACHIEVEMENTS.filter((a) => a.unlocked).length / ACHIEVEMENTS.length) * 100}%` }} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((ach) => (
                <div
                  key={ach.id}
                  className="glass-card p-5 relative overflow-hidden"
                  style={{
                    border: `1px solid ${ach.unlocked ?
                      ach.rarity === "legendary" ? "rgba(245,158,11,0.5)" :
                      ach.rarity === "epic" ? "rgba(124,58,237,0.4)" :
                      ach.rarity === "rare" ? "rgba(59,130,246,0.3)" :
                      "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
                    opacity: ach.unlocked ? 1 : 0.5,
                  }}
                >
                  {ach.unlocked && (
                    <div className="absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl-xl"
                      style={{
                        background: ach.rarity === "legendary" ? "#F59E0B" :
                          ach.rarity === "epic" ? "#7C3AED" :
                          ach.rarity === "rare" ? "#3B82F6" : "rgba(255,255,255,0.1)",
                        color: "white",
                      }}>
                      {ach.rarity}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{
                        background: ach.unlocked ?
                          ach.rarity === "legendary" ? "linear-gradient(135deg,#F59E0B,#D97706)" :
                          ach.rarity === "epic" ? "linear-gradient(135deg,#7C3AED,#A78BFA)" :
                          ach.rarity === "rare" ? "linear-gradient(135deg,#3B82F6,#06B6D4)" :
                          "rgba(255,255,255,0.1)"
                          : "rgba(255,255,255,0.05)",
                        filter: ach.unlocked ? "none" : "grayscale(100%)",
                      }}
                    >
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

        {/* SKILLS */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-black text-lg mb-6">🎯 Skill Analysis</h3>
              <div className="space-y-5">
                {SKILL_TREE.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="font-black" style={{ color: skill.color }}>{skill.value}%</span>
                    </div>
                    <div className="progress-bar h-3">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${skill.value}%`,
                          background: `linear-gradient(90deg,${skill.color},${skill.color}88)`,
                          transition: "width 1.5s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="glass-card p-6" style={{ border: "1px solid rgba(6,182,212,0.3)" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl animate-float">🤖</span>
                <div className="font-black">AI-Powered Skill Analysis</div>
              </div>
              <div className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                <p>
                  <span className="font-bold" style={{ color: "#10B981" }}>Strongest Skill:</span> Memory & Retention (85%) — You excel at remembering formulas and definitions. Leverage this by reviewing flashcards before tests.
                </p>
                <p>
                  <span className="font-bold" style={{ color: "#F59E0B" }}>Focus Area:</span> Application & HOTS (65%) — Practice applying concepts to real-world problems. Try NCERT Exemplar and previous year questions.
                </p>
                <p>
                  <span className="font-bold" style={{ color: "#06B6D4" }}>Suggested Plan:</span> 30 min daily on application problems + 20 min revision of weak chapters.
                </p>
              </div>
            </div>

            {/* Personalized Topper Roadmap */}
            <div className="glass-card p-6" style={{ border: "1px solid rgba(245,158,11,0.3)" }}>
              <h3 className="font-black text-lg mb-4">🗺️ Topper Roadmap</h3>
              <div className="space-y-3">
                {[
                  { step: "1", action: "Master Chemical Bonding (weakest chapter)", priority: "HIGH", due: "This week" },
                  { step: "2", action: "Complete 100 application-based problems", priority: "HIGH", due: "Next 2 weeks" },
                  { step: "3", action: "Revise all Maths formulas with flashcards", priority: "MEDIUM", due: "This month" },
                  { step: "4", action: "Attempt 10 full theory papers", priority: "MEDIUM", due: "Next month" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--card-border)" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.action}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Due: {item.due}</div>
                    </div>
                    <div
                      className="text-xs font-bold px-2 py-0.5 rounded-full h-fit"
                      style={{
                        background: item.priority === "HIGH" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)",
                        color: item.priority === "HIGH" ? "#EF4444" : "#F59E0B",
                      }}
                    >
                      {item.priority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
