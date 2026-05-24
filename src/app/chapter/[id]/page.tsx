"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Subsection { heading: string; body: string }
interface TopicSection { title: string; content: string; subsections: Subsection[] }
interface Formula { name: string; formula: string; description: string; variables: string[] }
interface VocabWord { word: string; meaning: string; usage: string }

interface ChapterContent {
  title: string;
  subject: string;
  classNum: number;
  icon: string;
  color: string;
  summary: string;
  topics: TopicSection[];
  formulas?: Formula[];
  vocabulary?: VocabWord[];
  importantPoints: string[];
  examTips: string[];
  commonMistakes?: string[];
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card p-8">
        <div className="flex gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-1/2 rounded bg-white/10" />
            <div className="h-4 w-1/3 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-3/4 rounded bg-white/10" />
          </div>
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card p-5">
          <div className="h-5 w-1/3 rounded bg-white/10 mb-3" />
          <div className="h-4 w-full rounded bg-white/10 mb-2" />
          <div className="h-4 w-5/6 rounded bg-white/10" />
        </div>
      ))}
      <div className="text-center py-4 text-sm" style={{ color: "var(--text-muted)" }}>
        🤖 AI is generating your chapter content...
      </div>
    </div>
  );
}

export default function ChapterPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const [lightMode, setLightMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "formulas" | "vocab" | "tips">("content");
  const [expandedTopic, setExpandedTopic] = useState<number | null>(0);
  const [content, setContent] = useState<ChapterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Parse route: e.g. "physics-ch1"
  const parts = (id ?? "").split("-");
  const chapterId = parts.slice(-1)[0] ?? "ch1";          // last segment
  const subjectId = parts.slice(0, -1).join("-") || "physics";

  const classId = searchParams?.get("classId") ?? localStorage.getItem("userClass") ?? "11";
  const chapterName = searchParams?.get("chapterName") ?? "";
  const subjectName = searchParams?.get("subjectName") ?? subjectId;

  useEffect(() => {
    document.body.className = lightMode ? "light-mode" : "";
  }, [lightMode]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      subjectId,
      chapterId,
      classId,
      ...(chapterName ? { chapterName } : {}),
      ...(subjectName ? { subjectName } : {}),
    });

    fetch(`/api/curriculum/content?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          setContent(json.data);
        } else {
          setError("Failed to load content. Please try again.");
        }
      })
      .catch(() => setError("Network error. Please check your connection."))
      .finally(() => setLoading(false));
  }, [id]);

  const tabs = content
    ? [
        { id: "content" as const, label: "📖 Content" },
        ...(content.formulas?.length ? [{ id: "formulas" as const, label: "📐 Formulas" }] : []),
        ...(content.vocabulary?.length ? [{ id: "vocab" as const, label: "📚 Vocabulary" }] : []),
        { id: "tips" as const, label: "🎯 Exam Tips" },
      ]
    : [];

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Navbar lightMode={lightMode} onToggleTheme={() => setLightMode((l) => !l)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm flex-wrap" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link> /
          <Link href={`/class/class-${classId}`} className="hover:text-purple-400 transition-colors">Class {classId}</Link> /
          <Link href={`/subject/${subjectId}/${classId}`} className="hover:text-purple-400 transition-colors">{subjectName}</Link> /
          <span style={{ color: "var(--foreground)" }}>{content?.title ?? (chapterName || chapterId)}</span>
        </div>

        {loading && <Skeleton />}

        {error && (
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <div className="font-bold text-lg mb-2">Could not load chapter</div>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary px-6 py-2 rounded-xl">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && content && (
          <>
            {/* Header */}
            <div
              className="glass-card p-7 relative overflow-hidden"
              style={{ border: `1px solid ${content.color}30` }}
            >
              <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at top right, ${content.color}, transparent 70%)` }} />
              <div className="relative z-10">
                <div className="flex items-start gap-5">
                  <div className="text-5xl">{content.icon}</div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-black mb-2">{content.title}</h1>
                    <div className="flex flex-wrap gap-3 text-sm mb-4">
                      <span style={{ color: "var(--text-muted)" }}>{content.subject} · Class {content.classNum}</span>
                      <span style={{ color: content.color }}>● {content.topics.length} Topics</span>
                      {content.formulas?.length ? <span style={{ color: "#06B6D4" }}>📐 {content.formulas.length} Formulas</span> : null}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.summary}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-5">
                  <Link
                    href={`/assessment/mcq/${id}?classId=${classId}&chapterName=${encodeURIComponent(content.title)}&subjectName=${encodeURIComponent(content.subject)}`}
                    className="btn-primary text-sm px-5 py-2.5 rounded-xl"
                  >
                    🎯 Take MCQ Test
                  </Link>
                  <Link href={`/assessment/theory/${id}`} className="btn-secondary text-sm px-5 py-2.5 rounded-xl">
                    📝 Theory Test
                  </Link>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

            {/* CONTENT TAB */}
            {activeTab === "content" && (
              <div className="space-y-4">
                {content.topics.map((topic, i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <button
                      className="w-full p-5 text-left flex items-center justify-between"
                      onClick={() => setExpandedTopic(expandedTopic === i ? null : i)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                          style={{ background: `linear-gradient(135deg,${content.color},${content.color}88)` }}
                        >
                          {i + 1}
                        </div>
                        <span className="font-black text-base">{topic.title}</span>
                      </div>
                      <span className="text-lg" style={{ color: "var(--text-muted)" }}>
                        {expandedTopic === i ? "▲" : "▼"}
                      </span>
                    </button>
                    {expandedTopic === i && (
                      <div className="px-5 pb-5">
                        <p className="text-sm mb-5 leading-relaxed p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", color: "var(--text-secondary)" }}>
                          {topic.content}
                        </p>
                        <div className="space-y-4">
                          {topic.subsections.map((sub, si) => (
                            <div key={si} className="pl-4 border-l-2" style={{ borderColor: `${content.color}60` }}>
                              <h4 className="font-bold text-sm mb-2" style={{ color: content.color }}>{sub.heading}</h4>
                              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{sub.body}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Important Points */}
                <div className="glass-card p-6" style={{ border: "1px solid rgba(245,158,11,0.3)" }}>
                  <h3 className="font-black text-lg mb-4 flex items-center gap-2">⭐ Important Points to Remember</h3>
                  <div className="space-y-2">
                    {content.importantPoints.map((pt, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="text-yellow-400 flex-shrink-0">→</span>
                        <span style={{ color: "var(--text-secondary)" }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Mistakes */}
                {content.commonMistakes?.length ? (
                  <div className="glass-card p-6" style={{ border: "1px solid rgba(239,68,68,0.3)" }}>
                    <h3 className="font-black text-lg mb-4 flex items-center gap-2">⚠️ Common Mistakes to Avoid</h3>
                    <div className="space-y-2">
                      {content.commonMistakes.map((m, i) => (
                        <div key={i} className="flex gap-3 text-sm">
                          <span className="text-red-400 flex-shrink-0">✗</span>
                          <span style={{ color: "var(--text-secondary)" }}>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* FORMULAS TAB */}
            {activeTab === "formulas" && content.formulas && (
              <div className="grid sm:grid-cols-2 gap-4">
                {content.formulas.map((f, i) => (
                  <div key={i} className="glass-card p-5" style={{ border: `1px solid ${content.color}20` }}>
                    <div className="font-bold text-sm mb-2">{f.name}</div>
                    <div
                      className="text-center py-3 px-4 rounded-xl text-xl font-black mb-3 font-mono"
                      style={{ background: `${content.color}15`, color: content.color }}
                    >
                      {f.formula}
                    </div>
                    <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{f.description}</p>
                    <div className="space-y-1">
                      {f.variables.map((v, vi) => (
                        <div key={vi} className="text-xs flex gap-2">
                          <span className="text-purple-400">•</span>
                          <span style={{ color: "var(--text-secondary)" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VOCABULARY TAB */}
            {activeTab === "vocab" && content.vocabulary && (
              <div className="space-y-3">
                {content.vocabulary.map((v, i) => (
                  <div key={i} className="glass-card p-4 flex gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white flex-shrink-0"
                      style={{ background: `${content.color}80` }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-black" style={{ color: content.color }}>{v.word}</div>
                      <div className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{v.meaning}</div>
                      <div className="text-xs mt-1 italic" style={{ color: "var(--text-muted)" }}>
                        &ldquo;{v.usage}&rdquo;
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EXAM TIPS TAB */}
            {activeTab === "tips" && (
              <div className="space-y-4">
                <div className="glass-card p-6" style={{ border: "1px solid rgba(124,58,237,0.3)" }}>
                  <h3 className="font-black text-lg mb-4">🎯 Exam Strategy & Tips</h3>
                  <div className="space-y-3">
                    {content.examTips.map((tip, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: "rgba(124,58,237,0.1)" }}>
                        <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/assessment/mcq/${id}?classId=${classId}&chapterName=${encodeURIComponent(content.title)}&subjectName=${encodeURIComponent(content.subject)}`}
                    className="flex-1 btn-primary text-center py-4 rounded-2xl text-sm font-bold"
                  >
                    🎯 Start MCQ Assessment
                  </Link>
                  <Link href={`/assessment/theory/${id}`} className="flex-1 btn-secondary text-center py-4 rounded-2xl text-sm font-bold">
                    📝 Start Theory Test
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
