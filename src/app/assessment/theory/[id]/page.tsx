"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { saveQuizResult } from "@/lib/progress";

const DIFFICULTY_LEVELS = [
  { id: "explorer", name: "Explorer Mode",   icon: "🌱", color: "#10B981", bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.3)",  desc: "Foundation level — core concepts and basic recall" },
  { id: "scholar",  name: "Scholar Quest",   icon: "📘", color: "#3B82F6", bg: "rgba(59,130,246,0.15)",  border: "rgba(59,130,246,0.3)",  desc: "Intermediate — analysis and moderate difficulty" },
  { id: "master",   name: "Master Journey",  icon: "⚔️", color: "#7C3AED", bg: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.3)", desc: "Advanced — HOTS and application-based questions" },
  { id: "brain",    name: "Brain Forge",     icon: "🧠", color: "#F59E0B", bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.3)",  desc: "Expert — board-exam pattern with full marks distribution" },
  { id: "titan",    name: "Titan Challenge", icon: "🔥", color: "#EF4444", bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.3)",   desc: "Championship — JEE/NEET/Olympiad standard" },
  { id: "legend",   name: "Legend Arena",   icon: "🌟", color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  border: "#F59E0B",               desc: "Ultimate challenge — unseen complex problems" },
] as const;

interface Section {
  name: string;
  instructions: string;
  questions: { no: number; marks: number; text: string }[];
}
interface AnswerItem { no: number; marks: number; answer: string; }
interface Paper {
  title: string;
  duration: number;
  marks: number;
  sections: Section[];
  answerKey: AnswerItem[];
}

type Phase = "select" | "loading" | "exam" | "score" | "answers";

export default function TheoryPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const id           = params?.id as string;

  // Parse URL: id = "physics-ch3", searchParams for context
  const parts       = (id ?? "").split("-");
  const chapterId   = parts.slice(-1)[0] ?? "ch1";
  const subjectId   = parts.slice(0, -1).join("-") || "physics";
  const classId     = searchParams?.get("classId")     ?? (typeof window !== "undefined" ? localStorage.getItem("userClass") ?? "11" : "11");
  const chapterName = searchParams?.get("chapterName") ?? "";
  const subjectName = searchParams?.get("subjectName") ?? subjectId;

  const [phase,             setPhase]             = useState<Phase>("select");
  const [selectedDiff,      setSelectedDiff]      = useState<string | null>(null);
  const [paper,             setPaper]             = useState<Paper | null>(null);
  const [loadError,         setLoadError]         = useState("");
  const [timeLeft,          setTimeLeft]          = useState(0);
  const [expandedAnswer,    setExpandedAnswer]    = useState<number | null>(null);
  const [selfScore,         setSelfScore]          = useState<number | null>(null);
  const [scoreSaved,        setScoreSaved]        = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const chapterLabel = chapterName
    || `${subjectName} — ${chapterId}`.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const loadPaper = useCallback(async (difficulty: string) => {
    setPhase("loading");
    setLoadError("");
    try {
      const params = new URLSearchParams({
        subjectId, classId, difficulty,
        ...(chapterName ? { chapterName } : {}),
        subjectName,
      });
      const res  = await fetch(`/api/assessment/theory?${params}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPaper(json.data);
        setPhase("exam");
        setTimeLeft((json.data.duration ?? 150) * 60);
      } else {
        setLoadError(json.error ?? "Failed to generate paper");
        setPhase("select");
      }
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : "Network error");
      setPhase("select");
    }
  }, [subjectId, classId, chapterName, subjectName]);

  // Timer
  useEffect(() => {
    if (phase !== "exam" || !paper) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); setPhase("score"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, paper]);

  const submitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("score");
  };

  const saveScore = () => {
    if (selfScore === null || !paper || scoreSaved) return;
    const pct = Math.round((selfScore / paper.marks) * 100);
    const totalQ = paper.sections.reduce((s, sec) => s + sec.questions.length, 0);
    saveQuizResult({
      date: new Date().toISOString(),
      subjectId, chapterId, classId,
      score: pct,
      questionsTotal: totalQ,
      questionsCorrect: Math.round(totalQ * pct / 100),
      type: "theory",
    });
    setScoreSaved(true);
    setPhase("answers");
  };

  const totalDuration = paper ? paper.duration * 60 : 1;
  const timerPct      = timeLeft / totalDuration;
  const timerColor    = timerPct > 0.5 ? "#10B981" : timerPct > 0.25 ? "#F59E0B" : "#EF4444";
  const mins          = Math.floor(timeLeft / 60);
  const secs          = timeLeft % 60;

  // ── SELECT ──────────────────────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className="min-h-screen grid-bg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <div className="text-center">
            <div className="text-5xl mb-4">📝</div>
            <h1 className="text-3xl font-black gradient-text mb-2">Theory Assessment</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {chapterLabel} · Class {classId} · AI-generated paper
            </p>
            {loadError && (
              <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                ⚠️ {loadError}
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIFFICULTY_LEVELS.map(lvl => (
              <button key={lvl.id} onClick={() => setSelectedDiff(lvl.id)}
                className="glass-card p-5 text-left transition-all"
                style={{
                  border: `2px solid ${selectedDiff === lvl.id ? lvl.color : "var(--card-border)"}`,
                  background: selectedDiff === lvl.id ? lvl.bg : "var(--card-bg)",
                  transform: selectedDiff === lvl.id ? "scale(1.02)" : "scale(1)",
                }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{lvl.icon}</div>
                  <div>
                    <div className="font-black text-sm" style={{ color: lvl.color }}>{lvl.name}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>AI-generated · Unique each time</div>
                  </div>
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{lvl.desc}</p>
                {selectedDiff === lvl.id && (
                  <div className="mt-3 text-xs font-bold" style={{ color: lvl.color }}>✓ Selected</div>
                )}
              </button>
            ))}
          </div>

          <div className="glass-card p-5" style={{ border: "1px solid rgba(245,158,11,0.25)" }}>
            <div className="font-bold text-yellow-400 mb-2">📌 How it works</div>
            <div className="space-y-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              <p>• Select difficulty → AI generates a unique 80-mark paper on <strong style={{ color: "var(--foreground)" }}>{chapterLabel}</strong></p>
              <p>• Solve answers in your notebook — the screen shows only questions</p>
              <p>• Timer runs 150 minutes. Submit early or wait for auto-submit</p>
              <p>• Compare with the AI answer key and enter your self-evaluated score</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href={`/subject/${subjectId}/${classId}`} className="flex-1 btn-secondary py-3 rounded-xl text-center">← Back</Link>
            <button onClick={() => selectedDiff && loadPaper(selectedDiff)}
              disabled={!selectedDiff}
              className="flex-1 btn-primary py-3 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed">
              Generate Paper 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center p-4" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <div className="glass-card max-w-md w-full p-10 text-center" style={{ border: "1px solid rgba(124,58,237,0.4)" }}>
          <div className="text-6xl mb-5">📝</div>
          <h2 className="text-2xl font-black mb-3 gradient-text">Generating Paper</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            AI is creating a unique 80-mark theory paper for<br />
            <span className="font-bold" style={{ color: "#A78BFA" }}>{chapterLabel}</span>
          </p>
          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: "#7C3AED", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>This takes 10–20 seconds…</p>
          <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-12px)}}`}</style>
        </div>
      </div>
    );
  }

  if (!paper) return null;

  // ── EXAM ──────────────────────────────────────────────────────────────────────
  if (phase === "exam") {
    const totalQ = paper.sections.reduce((s, sec) => s + sec.questions.length, 0);
    return (
      <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <div className="sticky top-0 z-50 border-b p-4 flex items-center justify-between"
          style={{ background: "rgba(5,5,15,0.95)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
          <div>
            <div className="font-black text-sm">{paper.title}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {totalQ} questions · {paper.marks} marks · Solve in notebook
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="font-black text-2xl" style={{ color: timerColor }}>
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>remaining</div>
            </div>
            <button onClick={submitExam} className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}>
              Submit →
            </button>
          </div>
        </div>

        <div className="h-1" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="h-full transition-all" style={{ width: `${timerPct * 100}%`, background: timerColor }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <div className="text-center border-b pb-6" style={{ borderColor: "var(--card-border)" }}>
            <div className="font-black text-2xl uppercase tracking-wide gradient-text">DC NextGen Academy</div>
            <div className="font-bold text-lg mt-1">{paper.title}</div>
            <div className="flex justify-center gap-8 mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <span>Time: {paper.duration} minutes</span>
              <span>Maximum Marks: {paper.marks}</span>
              <span>Class: {classId}</span>
            </div>
            <div className="mt-3 text-sm font-medium" style={{ color: "#A78BFA" }}>
              ✏️ Solve all answers in your notebook · Answers reveal after submission
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="font-bold mb-3">General Instructions:</div>
            <ol className="space-y-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              {["All questions are compulsory unless stated otherwise.",
                "Draw neat and labeled diagrams wherever necessary.",
                "Write complete derivations for proof-based questions.",
                "Show all calculations clearly with proper units.",
                "Write answers in the same sequence as the question paper.",
              ].map((t, i) => <li key={i}>{i + 1}. {t}</li>)}
            </ol>
          </div>

          {paper.sections.map((section, si) => (
            <div key={si} className="glass-card overflow-hidden">
              <div className="p-5 border-b" style={{ background: "rgba(124,58,237,0.1)", borderColor: "rgba(124,58,237,0.2)" }}>
                <div className="font-black text-lg">{section.name}</div>
                <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{section.instructions}</div>
              </div>
              <div className="p-5 space-y-5">
                {section.questions.map(q => (
                  <div key={q.no} className="flex gap-4">
                    <div className="font-black text-sm flex-shrink-0 w-8" style={{ color: "#A78BFA" }}>{q.no}.</div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{q.text}</p>
                    </div>
                    <div className="flex-shrink-0 font-bold text-sm px-2 py-0.5 rounded"
                      style={{ color: "#F59E0B", background: "rgba(245,158,11,0.1)" }}>
                      [{q.marks} mark{q.marks > 1 ? "s" : ""}]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── SCORE ENTRY ───────────────────────────────────────────────────────────────
  if (phase === "score") {
    const pct = selfScore !== null ? Math.round((selfScore / paper.marks) * 100) : null;
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center p-4"
        style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <div className="glass-card max-w-lg w-full p-8 space-y-6" style={{ border: "1px solid rgba(124,58,237,0.4)" }}>
          <div className="text-center">
            <div className="text-5xl mb-3">🏁</div>
            <h1 className="text-3xl font-black gradient-text mb-2">Time&apos;s Up!</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Check the answer key, evaluate your paper, then enter your score below
            </p>
          </div>

          <div className="glass-card p-5 space-y-4">
            <div className="font-black">Self-Evaluation</div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              Total marks: <strong style={{ color: "var(--foreground)" }}>{paper.marks}</strong>
            </div>
            <input
              type="number"
              min={0}
              max={paper.marks}
              value={selfScore ?? ""}
              onChange={e => setSelfScore(Math.max(0, Math.min(paper.marks, Number(e.target.value))))}
              placeholder={`Enter your score (0 – ${paper.marks})`}
              className="w-full rounded-xl p-3 text-center font-black text-2xl"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--foreground)", outline: "none" }}
            />
            {pct !== null && (
              <div className="text-center font-black text-xl" style={{ color: pct >= 70 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444" }}>
                {pct}% — {pct >= 70 ? "✅ Passed" : pct >= 50 ? "⚠️ Average" : "❌ Needs Revision"}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setPhase("answers")} className="flex-1 btn-secondary py-3 rounded-xl">
              Skip &amp; See Answers
            </button>
            <button onClick={saveScore} disabled={selfScore === null}
              className="flex-1 btn-primary py-3 rounded-xl font-bold disabled:opacity-40">
              Save Score &amp; See Key ✓
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ANSWER KEY ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center glass-card p-8">
          <div className="text-5xl mb-4">📋</div>
          <h1 className="text-3xl font-black gradient-text mb-2">Official Answer Key</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {paper.title} — {paper.marks} marks
          </p>
          {scoreSaved && (
            <div className="mt-4 inline-block px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: "rgba(16,185,129,0.2)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }}>
              ✅ Score saved to your profile
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-xl">Answer Key with Marking Scheme</h2>
            <div className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.2)", color: "#A78BFA" }}>
              {paper.answerKey.length} answers
            </div>
          </div>
          <div className="space-y-3">
            {paper.answerKey.map(ans => (
              <div key={ans.no} className="border rounded-xl overflow-hidden" style={{ borderColor: "var(--card-border)" }}>
                <button className="w-full p-4 flex items-center justify-between text-left"
                  onClick={() => setExpandedAnswer(expandedAnswer === ans.no ? null : ans.no)}
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex items-center gap-3">
                    <span className="font-black" style={{ color: "#A78BFA" }}>Q{ans.no}.</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>
                      {ans.marks} mark{ans.marks > 1 ? "s" : ""}
                    </span>
                  </div>
                  <span style={{ color: "var(--text-muted)" }}>{expandedAnswer === ans.no ? "▲" : "▼"}</span>
                </button>
                {expandedAnswer === ans.no && (
                  <div className="px-4 pb-4">
                    <div className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "var(--text-secondary)" }}>
                      {ans.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6" style={{ border: "1px solid rgba(124,58,237,0.3)" }}>
          <h3 className="font-black text-lg mb-4">💡 Examiner Tips</h3>
          <div className="space-y-2">
            {["Always start derivations from first principles — never skip steps.",
              "Label all diagram axes, forces, and quantities clearly.",
              "Always write SI units — missing units cost marks.",
              "For numericals: show Given, Formula, Substitution, Answer with unit.",
              "Case study: read the passage twice before answering."].map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl text-sm" style={{ background: "rgba(124,58,237,0.08)" }}>
                <span className="text-purple-400 flex-shrink-0">{i + 1}.</span>
                <span style={{ color: "var(--text-secondary)" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Link href={`/subject/${subjectId}/${classId}`} className="flex-1 btn-secondary py-3 rounded-xl text-center">
            ← Back to Subject
          </Link>
          <button onClick={() => { setPaper(null); setPhase("select"); setSelectedDiff(null); setSelfScore(null); setScoreSaved(false); setExpandedAnswer(null); }}
            className="flex-1 btn-primary py-3 rounded-xl">
            🔄 New Paper
          </button>
        </div>
      </div>
    </div>
  );
}
