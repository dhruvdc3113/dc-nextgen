"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { fetchLeaderboard, type LeaderEntry } from "@/lib/api";

const BADGE_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  Legend: { color: "white", bg: "linear-gradient(135deg,#F59E0B,#D97706)", border: "#F59E0B" },
  Titan: { color: "#EF4444", bg: "rgba(239,68,68,0.2)", border: "rgba(239,68,68,0.4)" },
  Master: { color: "#A78BFA", bg: "rgba(124,58,237,0.2)", border: "rgba(124,58,237,0.4)" },
  Brain: { color: "#F59E0B", bg: "rgba(245,158,11,0.2)", border: "rgba(245,158,11,0.4)" },
  Scholar: { color: "#60A5FA", bg: "rgba(59,130,246,0.2)", border: "rgba(59,130,246,0.4)" },
  Explorer: { color: "#10B981", bg: "rgba(16,185,129,0.2)", border: "rgba(16,185,129,0.4)" },
};

export default function LeaderboardPage() {
  const [lightMode, setLightMode] = useState(false);
  const [filter, setFilter] = useState<"national" | "class" | "subject">("national");
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("all");
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);

  useEffect(() => {
    document.body.className = lightMode ? "light-mode" : "";
  }, [lightMode]);

  useEffect(() => {
    fetchLeaderboard().then(setLeaderboard);
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Navbar lightMode={lightMode} onToggleTheme={() => setLightMode((l) => !l)} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="section-tag mx-auto mb-4">🏆 Rankings</div>
          <h1 className="text-3xl font-black mb-2 gradient-text">National Leaderboard</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Compete with learners across India · Updated every 24 hours
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex gap-2">
            {(["national", "class", "subject"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
                style={{
                  background: filter === f ? "rgba(124,58,237,0.3)" : "var(--card-bg)",
                  color: filter === f ? "#A78BFA" : "var(--text-muted)",
                  border: `1px solid ${filter === f ? "rgba(124,58,237,0.5)" : "var(--card-border)"}`,
                }}
              >
                {f === "national" ? "🌍 National" : f === "class" ? "📚 My Class" : "📖 By Subject"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["week", "month", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
                style={{
                  background: timeframe === t ? "rgba(6,182,212,0.3)" : "var(--card-bg)",
                  color: timeframe === t ? "#06B6D4" : "var(--text-muted)",
                  border: `1px solid ${timeframe === t ? "rgba(6,182,212,0.5)" : "var(--card-border)"}`,
                }}
              >
                {t === "week" ? "This Week" : t === "month" ? "This Month" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="glass-card p-8">
          <div className="flex items-end justify-center gap-4">
            {/* 2nd place */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-lg text-white"
                  style={{ background: "linear-gradient(135deg,#94A3B8,#64748B)" }}>
                  {top3[1]?.avatar}
                </div>
                <div className="absolute -top-2 -right-2 text-xl">🥈</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">{top3[1]?.name}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>Class {top3[1]?.class}</div>
                <div className="font-black text-sm" style={{ color: "#94A3B8" }}>{top3[1]?.score.toLocaleString()} XP</div>
              </div>
              <div className="w-24 h-20 rounded-t-xl flex items-center justify-center font-black text-2xl text-white"
                style={{ background: "linear-gradient(135deg,#94A3B8,#64748B)" }}>
                2
              </div>
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-2xl animate-float">👑</div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center font-black text-xl text-white glow-gold"
                  style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
                  {top3[0]?.avatar}
                </div>
                <div className="absolute -top-2 -right-2 text-2xl">🥇</div>
              </div>
              <div className="text-center">
                <div className="font-black">{top3[0]?.name}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>Class {top3[0]?.class}</div>
                <div className="font-black" style={{ color: "#F59E0B" }}>{top3[0]?.score.toLocaleString()} XP</div>
              </div>
              <div className="w-28 h-28 rounded-t-xl flex items-center justify-center font-black text-3xl text-white glow-gold"
                style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
                1
              </div>
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-lg text-white"
                  style={{ background: "linear-gradient(135deg,#B45309,#92400E)" }}>
                  {top3[2]?.avatar}
                </div>
                <div className="absolute -top-2 -right-2 text-xl">🥉</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">{top3[2]?.name}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>Class {top3[2]?.class}</div>
                <div className="font-black text-sm" style={{ color: "#B45309" }}>{top3[2]?.score.toLocaleString()} XP</div>
              </div>
              <div className="w-24 h-14 rounded-t-xl flex items-center justify-center font-black text-2xl text-white"
                style={{ background: "linear-gradient(135deg,#B45309,#92400E)" }}>
                3
              </div>
            </div>
          </div>
        </div>

        {/* Full Rankings */}
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--card-border)" }}>
            <h2 className="font-black">Full Rankings</h2>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{leaderboard.length} participants</div>
          </div>
          <div>
            {leaderboard.map((entry, i) => {
              const badge = BADGE_CONFIG[entry.badge] || BADGE_CONFIG.Explorer;
              const isYou = entry.name === "You";
              return (
                <div
                  key={i}
                  className="leaderboard-row flex items-center gap-4 p-4 border-b"
                  style={{
                    borderColor: "var(--card-border)",
                    background: isYou ? "rgba(124,58,237,0.1)" : "transparent",
                  }}
                >
                  <div className="w-10 text-center font-black"
                    style={{ color: entry.rank === 1 ? "#F59E0B" : entry.rank === 2 ? "#94A3B8" : entry.rank === 3 ? "#B45309" : "var(--text-muted)" }}>
                    {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                    style={{ background: isYou ? "linear-gradient(135deg,#7C3AED,#06B6D4)" : "linear-gradient(135deg,#374151,#6B7280)" }}
                  >
                    {entry.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">
                      {entry.name}{isYou && <span style={{ color: "#A78BFA" }}> (You)</span>}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Class {entry.class}</div>
                  </div>
                  <div className="text-center hidden sm:block">
                    <div className="font-black text-sm" style={{ color: "#F59E0B" }}>{entry.score.toLocaleString()}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>XP</div>
                  </div>
                  <div className="text-center hidden sm:block">
                    <div className="font-bold text-sm text-yellow-400">🔥 {entry.streak}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>streak</div>
                  </div>
                  <div
                    className="level-badge text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
                  >
                    {entry.badge}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Your rank card */}
        <div
          className="glass-card p-6 flex items-center gap-5"
          style={{ border: "1px solid rgba(124,58,237,0.4)" }}
        >
          <div className="text-4xl">🎯</div>
          <div className="flex-1">
            <div className="font-black text-lg">Your Current Rank: #8</div>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              You need <span className="font-bold" style={{ color: "#A78BFA" }}>1,540 more XP</span> to reach{" "}
              <span className="font-bold" style={{ color: "#F59E0B" }}>Shreya Nair (#6)</span>
            </p>
          </div>
          <Link href="/profile" className="btn-primary px-4 py-2 text-sm rounded-xl">
            View Profile
          </Link>
        </div>
      </main>
    </div>
  );
}
