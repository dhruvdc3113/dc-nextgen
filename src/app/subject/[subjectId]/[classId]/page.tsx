"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { fetchSubjects, fetchChapters, type Subject, type Chapter } from "@/lib/api";

const DIFF_COLORS: Record<string, string> = {
  "Explorer Mode": "#10B981",
  "Scholar Quest": "#3B82F6",
  "Master Journey": "#7C3AED",
  "Brain Forge": "#F59E0B",
  "Titan Challenge": "#EF4444",
  "Legend Arena": "#F59E0B",
};
const DIFF_BG: Record<string, string> = {
  "Explorer Mode": "rgba(16,185,129,0.15)",
  "Scholar Quest": "rgba(59,130,246,0.15)",
  "Master Journey": "rgba(124,58,237,0.15)",
  "Brain Forge": "rgba(245,158,11,0.15)",
  "Titan Challenge": "rgba(239,68,68,0.15)",
  "Legend Arena": "rgba(245,158,11,0.1)",
};

function SkeletonRow() {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-white/10" />
          <div className="h-3 w-1/3 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params?.subjectId as string;
  const classId = parseInt(params?.classId as string) || 11;
  const [lightMode, setLightMode] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(true);

  useEffect(() => {
    document.body.className = lightMode ? "light-mode" : "";
  }, [lightMode]);

  useEffect(() => {
    setLoadingSubjects(true);
    fetchSubjects(classId).then((data) => {
      setSubjects(data);
      setLoadingSubjects(false);
    });
  }, [classId]);

  useEffect(() => {
    if (!subjectId) return;
    setLoadingChapters(true);
    const subject = subjects.find((s) => s.id === subjectId);
    fetchChapters(subjectId, classId, subject?.name).then((data) => {
      setChapters(data);
      setLoadingChapters(false);
    });
  }, [subjectId, classId, subjects]);

  const subject = subjects.find((s) => s.id === subjectId) || subjects[0];

  const filtered = chapters.filter((ch) => {
    const matchSearch =
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchFilter =
      filter === "all" || (filter === "completed" ? ch.completed : !ch.completed);
    return matchSearch && matchFilter;
  });

  const completedCount = chapters.filter((c) => c.completed).length;
  const avgScore = chapters.filter((c) => c.score > 0).reduce((s, c, _, a) => s + c.score / a.length, 0);

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Navbar lightMode={lightMode} onToggleTheme={() => setLightMode((l) => !l)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/class/class-${classId}`} className="hover:text-purple-400 transition-colors">Class {classId}</Link>
          <span>/</span>
          <span style={{ color: "var(--foreground)" }}>{subject?.name ?? subjectId}</span>
        </div>

        {/* Subject Header */}
        {loadingSubjects ? (
          <div className="glass-card p-8 animate-pulse">
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-7 w-1/2 rounded bg-white/10" />
                <div className="h-4 w-1/3 rounded bg-white/10" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="glass-card p-8 relative overflow-hidden"
            style={{ border: `1px solid ${subject?.color ?? "#7C3AED"}30` }}
          >
            <div
              className="absolute inset-0 opacity-10 rounded-2xl"
              style={{ background: `radial-gradient(ellipse at top right, ${subject?.color ?? "#7C3AED"}, transparent 70%)` }}
            />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                style={{
                  background: `${subject?.color ?? "#7C3AED"}20`,
                  border: `2px solid ${subject?.color ?? "#7C3AED"}40`,
                }}
              >
                {subject?.icon ?? "📚"}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-black mb-1">{subject?.name ?? subjectId}</h1>
                <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
                  {subject?.description} · Class {classId}
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: "Chapters", value: `${completedCount}/${chapters.length}`, color: subject?.color ?? "#7C3AED" },
                    { label: "Topics", value: chapters.reduce((s, c) => s + (c.topics?.length ?? 0), 0), color: "#F59E0B" },
                    { label: "Avg Score", value: avgScore > 0 ? `${Math.round(avgScore)}%` : "N/A", color: "#10B981" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="font-black text-xl" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/assessment/mcq/${subjectId}-ch1?classId=${classId}`}
                  className="btn-primary px-4 py-2 text-sm rounded-xl"
                >
                  🎯 Quick Test
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters or topics..."
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
          />
          <div className="flex gap-2">
            {(["all", "completed", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all"
                style={{
                  background: filter === f ? "rgba(124,58,237,0.3)" : "var(--card-bg)",
                  color: filter === f ? "#A78BFA" : "var(--text-muted)",
                  border: `1px solid ${filter === f ? "rgba(124,58,237,0.5)" : "var(--card-border)"}`,
                }}
              >
                {f === "all" ? "All" : f === "completed" ? "✅ Done" : "⏳ Pending"}
              </button>
            ))}
          </div>
        </div>

        {/* Chapter Grid */}
        {loadingChapters ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            <div className="text-center py-4 text-sm" style={{ color: "var(--text-muted)" }}>
              🤖 AI is loading chapters for {subject?.name ?? subjectId}...
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ch, i) => (
              <div
                key={ch.id}
                className="glass-card p-5 cursor-pointer"
                style={{
                  borderLeft: `3px solid ${ch.completed ? "#10B981" : DIFF_COLORS[ch.difficulty] || "#7C3AED"}`,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Chapter number */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0"
                    style={{
                      background: ch.completed ? "rgba(16,185,129,0.2)" : "rgba(124,58,237,0.2)",
                      color: ch.completed ? "#10B981" : "#A78BFA",
                    }}
                  >
                    {ch.completed ? "✓" : i + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-black text-base">{ch.name}</h3>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: DIFF_BG[ch.difficulty] ?? "rgba(124,58,237,0.15)", color: DIFF_COLORS[ch.difficulty] ?? "#A78BFA" }}
                      >
                        {ch.difficulty}
                      </span>
                      {ch.completed && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                          Completed
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                      <span>⏱ {ch.estimatedTime}</span>
                      <span>📋 {ch.topics?.length ?? 0} topics</span>
                      {ch.score > 0 && (
                        <span style={{ color: ch.score >= 80 ? "#10B981" : ch.score >= 60 ? "#F59E0B" : "#EF4444" }}>
                          🎯 Score: {ch.score}%
                        </span>
                      )}
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1.5">
                      {(ch.topics ?? []).slice(0, 4).map((topic, ti) => (
                        <span
                          key={ti}
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
                        >
                          {topic}
                        </span>
                      ))}
                      {(ch.topics?.length ?? 0) > 4 && (
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          +{ch.topics.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/chapter/${subjectId}-${ch.id}?classId=${classId}&chapterName=${encodeURIComponent(ch.name)}&subjectName=${encodeURIComponent(subject?.name ?? subjectId)}`}
                      className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: ch.completed ? "rgba(16,185,129,0.3)" : "linear-gradient(135deg,#7C3AED,#5B21B6)" }}
                    >
                      {ch.completed ? "Revise" : "Study"}
                    </Link>
                    <Link
                      href={`/assessment/mcq/${subjectId}-${ch.id}?classId=${classId}&chapterName=${encodeURIComponent(ch.name)}&subjectName=${encodeURIComponent(subject?.name ?? subjectId)}`}
                      className="px-3 py-2 rounded-xl text-sm font-bold transition-all"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                    >
                      🎯
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && !loadingChapters && (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <div className="font-bold text-lg mb-2">No chapters found</div>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
