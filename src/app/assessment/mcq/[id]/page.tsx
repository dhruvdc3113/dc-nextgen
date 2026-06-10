"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { saveQuizResult } from "@/lib/progress";

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  type: "conceptual" | "logical" | "hots" | "application";
}

type Phase = "loading" | "intro" | "exam" | "review" | "results";

function TimerRing({ seconds, totalSeconds }: { seconds: number; totalSeconds: number }) {
  const pct = seconds / totalSeconds;
  const r = 36, circ = 2 * Math.PI * r, dash = pct * circ;
  const color = pct > 0.5 ? "#10B981" : pct > 0.25 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width="80" height="80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.5s linear, stroke 0.5s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black text-lg" style={{ color }}>
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default function MCQPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;

  const classId = searchParams?.get("classId") ?? "11";
  const chapterName = searchParams?.get("chapterName") ?? "";
  const subjectName = searchParams?.get("subjectName") ?? "";

  // Parse: e.g. "physics-ch1"
  const parts = (id ?? "").split("-");
  const chapterId = parts.slice(-1)[0] ?? "ch1";
  const subjectId = parts.slice(0, -1).join("-") || "physics";

  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [loadError, setLoadError] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(0);
  const [violations, setViolations] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [focusScore, setFocusScore] = useState(100);
  const [reviewIndex, setReviewIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPhysicsMath = subjectId.includes("physics") || subjectId.includes("maths") || subjectId.includes("chemistry") || subjectId.includes("biology");
  const questionTime = isPhysicsMath ? 30 : 20;

  // Load AI-generated questions
  useEffect(() => {
    const urlParams = new URLSearchParams({
      subjectId,
      chapterId,
      classId,
      count: "20",
      ...(chapterName ? { chapterName } : {}),
      ...(subjectName ? { subjectName } : {}),
    });

    fetch(`/api/assessment/mcq?${urlParams}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setQuestions(json.data);
          setAnswers(Array(json.data.length).fill(null));
          setPhase("intro");
        } else {
          setLoadError("Could not generate questions. Please try again.");
          setPhase("intro");
        }
      })
      .catch(() => {
        setLoadError("Network error while loading questions.");
        setPhase("intro");
      });
  }, [id]);

  const submitExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    setPhase("review");
    setReviewIndex(0);
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrent((c) => {
      if (c < questions.length - 1) {
        setTimeLeft(questionTime);
        return c + 1;
      }
      submitExam();
      return c;
    });
  }, [questions.length, questionTime, submitExam]);

  // Per-question timer
  useEffect(() => {
    if (phase !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { nextQuestion(); return questionTime; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, current, nextQuestion, questionTime]);

  // Total time
  useEffect(() => {
    if (phase !== "exam") return;
    totalTimerRef.current = setInterval(() => setTotalTime((t) => t + 1), 1000);
    return () => { if (totalTimerRef.current) clearInterval(totalTimerRef.current); };
  }, [phase]);

  // Anti-cheat: tab switch
  useEffect(() => {
    if (phase !== "exam") return;
    const handleVisibility = () => {
      if (document.hidden) {
        setViolations((v) => {
          const nv = v + 1;
          if (nv === 1) { setWarning("⚠️ Tab switch detected! First warning."); setFocusScore((f) => Math.max(0, f - 15)); }
          else if (nv === 2) { setWarning("⚠️ SECOND violation! Penalty applied."); setTimeLeft((t) => Math.max(0, t - 30)); setFocusScore((f) => Math.max(0, f - 25)); }
          else { setWarning("🚫 Third violation! Auto-submitting..."); setTimeout(submitExam, 2000); }
          return nv;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [phase, submitExam]);

  // Disable copy/paste during exam
  useEffect(() => {
    if (phase !== "exam") return;
    const noCtx = (e: MouseEvent) => e.preventDefault();
    const noCopy = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "a", "p", "s"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setWarning("⚠️ Shortcuts disabled during exam");
        setTimeout(() => setWarning(null), 2000);
      }
    };
    document.addEventListener("contextmenu", noCtx);
    document.addEventListener("keydown", noCopy);
    return () => { document.removeEventListener("contextmenu", noCtx); document.removeEventListener("keydown", noCopy); };
  }, [phase]);

  const handleAnswer = (optionIndex: number) => {
    setAnswers((prev) => { const n = [...prev]; n[current] = optionIndex; return n; });
    setTimeout(nextQuestion, 400);
  };

  const score = answers.reduce((acc: number, a, i) => acc + (a !== null && a === questions[i]?.correctAnswer ? 1 : 0), 0);
  const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = accuracy >= 70;
  const weakTopics = [...new Set(
    questions.filter((_, i) => answers[i] !== null && answers[i] !== questions[i]?.correctAnswer).map((q) => q.topic)
  )].slice(0, 3);

  const chapterLabel = chapterName || `${subjectId} ${chapterId}`.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // ── LOADING ──
  if (phase === "loading") {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center p-4" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <div className="glass-card max-w-md w-full p-10 text-center" style={{ border: "1px solid rgba(124,58,237,0.4)" }}>
          <div className="text-6xl mb-5">🤖</div>
          <h2 className="text-2xl font-black mb-3 gradient-text">Generating Questions</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            AI is creating {20} personalized MCQs for<br />
            <span className="font-bold" style={{ color: "#A78BFA" }}>{chapterLabel}</span>
          </p>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  background: "#7C3AED",
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-12px)} }`}</style>
        </div>
      </div>
    );
  }

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center p-4" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <div className="glass-card max-w-2xl w-full p-8" style={{ border: "1px solid rgba(124,58,237,0.4)" }}>
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-black mb-2 gradient-text">AI MCQ Assessment</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{chapterLabel}</p>
            {loadError && (
              <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                ⚠️ {loadError} — Questions may be limited.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: "❓", label: "Questions", value: `${questions.length} MCQs` },
              { icon: "🤖", label: "Source", value: "AI Generated" },
              { icon: "⏱", label: "Time/Question", value: isPhysicsMath ? "30 seconds" : "20 seconds" },
              { icon: "✅", label: "Passing Score", value: "70%" },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl text-center" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-black" style={{ color: "#A78BFA" }}>{s.value}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mb-8 p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <h3 className="font-bold text-sm mb-2 text-red-400">🔒 Exam Rules</h3>
            <div className="space-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              {["Tab switching triggers violations", "3 violations = auto-submit", "Right-click disabled during exam", "Timer auto-advances on timeout"].map((r, i) => (
                <div key={i} className="flex gap-2"><span className="text-red-400">•</span>{r}</div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/" className="flex-1 btn-secondary text-center py-3 rounded-xl">← Back</Link>
            <button
              onClick={() => { if (questions.length > 0) { setPhase("exam"); setTimeLeft(questionTime); } }}
              disabled={questions.length === 0}
              className="flex-1 btn-primary py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {questions.length > 0 ? "Start Exam 🚀" : "No questions available"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── EXAM ──
  if (phase === "exam") {
    const q = questions[current];
    if (!q) return null;
    const progress = ((current + 1) / questions.length) * 100;

    return (
      <div className="exam-overlay" style={{ background: "var(--background)", color: "var(--foreground)" }} onContextMenu={(e) => e.preventDefault()}>
        {warning && (
          <div className="fixed top-0 left-0 right-0 z-[9999] p-4 text-center font-bold text-sm" style={{ background: violations >= 3 ? "#EF4444" : "#D97706", color: "white" }}>
            {warning}
          </div>
        )}

        <div className="sticky top-0 z-50 p-4 flex items-center justify-between border-b" style={{ background: "rgba(5,5,15,0.95)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
          <div className="flex-1 max-w-md">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
              <span>Question {current + 1} of {questions.length}</span>
              <span>{score} correct</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
          <TimerRing seconds={timeLeft} totalSeconds={questionTime} />
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Focus Score</div>
            <div className="font-black text-lg" style={{ color: focusScore >= 80 ? "#10B981" : focusScore >= 50 ? "#F59E0B" : "#EF4444" }}>{focusScore}%</div>
            <div className="text-xs" style={{ color: violations === 0 ? "#10B981" : "#EF4444" }}>⚠️ {violations}/3</div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="glass-card p-7 mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(124,58,237,0.2)", color: "#A78BFA" }}>{q.topic}</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold capitalize" style={{
                background: q.difficulty === "easy" ? "rgba(16,185,129,0.2)" : q.difficulty === "medium" ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)",
                color: q.difficulty === "easy" ? "#10B981" : q.difficulty === "medium" ? "#F59E0B" : "#EF4444",
              }}>{q.difficulty} · {q.type}</span>
            </div>
            <p className="text-xl font-semibold leading-relaxed select-none">{q.question}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all font-medium select-none"
                style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.2)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0" style={{ background: "rgba(124,58,237,0.2)", color: "#A78BFA" }}>
                  {["A", "B", "C", "D"][i]}
                </div>
                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button onClick={() => setAnswers((a) => { const n = [...a]; n[current] = null; return n; })} className="btn-secondary px-4 py-2 text-sm rounded-xl">Skip</button>
            <div className="text-xs text-center" style={{ color: "var(--text-muted)" }}>Answer to auto-advance · Or wait for timer</div>
            <button onClick={submitExam} className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}>Submit Early</button>
          </div>
        </div>
      </div>
    );
  }

  // ── REVIEW ──
  if (phase === "review") {
    const q = questions[reviewIndex];
    if (!q) return null;
    const userAnswer = answers[reviewIndex];
    const isCorrect = userAnswer === q.correctAnswer;

    return (
      <div className="min-h-screen grid-bg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-2xl">📋 Detailed Review</h2>
            <button onClick={() => setPhase("results")} className="btn-primary px-4 py-2 text-sm rounded-xl">See Results →</button>
          </div>

          <div className="flex gap-1 flex-wrap">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setReviewIndex(i)}
                className="w-7 h-7 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: i === reviewIndex ? "rgba(124,58,237,0.5)" : answers[i] === questions[i]?.correctAnswer ? "rgba(16,185,129,0.3)" : answers[i] !== null ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.05)",
                  color: i === reviewIndex ? "#A78BFA" : answers[i] === questions[i]?.correctAnswer ? "#10B981" : answers[i] !== null ? "#EF4444" : "var(--text-muted)",
                }}>{i + 1}</button>
            ))}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-black text-base">Q{reviewIndex + 1}.</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)", color: isCorrect ? "#10B981" : "#EF4444" }}>
                {isCorrect ? "✓ Correct" : "✗ Wrong"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(124,58,237,0.2)", color: "#A78BFA" }}>{q.topic}</span>
            </div>
            <p className="font-semibold mb-5">{q.question}</p>
            <div className="space-y-2 mb-5">
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl text-sm"
                  style={{
                    background: i === q.correctAnswer ? "rgba(16,185,129,0.15)" : i === userAnswer && !isCorrect ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === q.correctAnswer ? "rgba(16,185,129,0.4)" : i === userAnswer && !isCorrect ? "rgba(239,68,68,0.4)" : "var(--card-border)"}`,
                  }}>
                  <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: i === q.correctAnswer ? "#10B981" : i === userAnswer && !isCorrect ? "#EF4444" : "rgba(255,255,255,0.1)", color: "white" }}>
                    {i === q.correctAnswer ? "✓" : i === userAnswer && !isCorrect ? "✗" : ["A", "B", "C", "D"][i]}
                  </span>
                  <span style={{ color: i === q.correctAnswer ? "#10B981" : "var(--foreground)" }}>{opt}</span>
                  {i === userAnswer && i !== q.correctAnswer && <span className="ml-auto text-xs" style={{ color: "#EF4444" }}>Your answer</span>}
                  {i === q.correctAnswer && <span className="ml-auto text-xs" style={{ color: "#10B981" }}>Correct</span>}
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <div className="font-bold text-sm mb-2" style={{ color: "#A78BFA" }}>💡 Explanation</div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{q.explanation}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setReviewIndex((r) => Math.max(0, r - 1))} disabled={reviewIndex === 0} className="flex-1 btn-secondary py-3 rounded-xl disabled:opacity-50">← Previous</button>
            {reviewIndex < questions.length - 1 ? (
              <button onClick={() => setReviewIndex((r) => r + 1)} className="flex-1 btn-primary py-3 rounded-xl">Next →</button>
            ) : (
              <button onClick={() => {
                saveQuizResult({
                  date: new Date().toISOString(),
                  subjectId, chapterId, classId,
                  score: accuracy,
                  questionsTotal: questions.length,
                  questionsCorrect: score,
                  type: "mcq",
                });
                setPhase("results");
              }} className="flex-1 btn-primary py-3 rounded-xl">See Results 🏆</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="max-w-2xl w-full space-y-6">
        <div className="glass-card p-8 text-center" style={{ border: `1px solid ${passed ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}` }}>
          <div className="text-6xl mb-4">{passed ? "🏆" : "📚"}</div>
          <h1 className="text-4xl font-black mb-2 gradient-text">{accuracy}%</h1>
          <div className="inline-block px-4 py-2 rounded-full font-bold text-sm mb-6" style={{ background: passed ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)", color: passed ? "#10B981" : "#EF4444" }}>
            {passed ? "✓ PASSED" : "✗ Below Passing Grade"}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Correct", value: score, color: "#10B981" },
              { label: "Wrong", value: questions.length - score - answers.filter((a) => a === null).length, color: "#EF4444" },
              { label: "Skipped", value: answers.filter((a) => a === null).length, color: "#F59E0B" },
              { label: "Focus", value: `${focusScore}%`, color: "#06B6D4" },
            ].map((stat, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="font-black text-2xl" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-left space-y-3 mb-6">
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${accuracy}%` }} /></div>
            <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
              <span>Time: {Math.floor(totalTime / 60)}m {totalTime % 60}s</span>
              <span>Avg: {questions.length > 0 ? Math.round(totalTime / questions.length) : 0}s/question</span>
            </div>
          </div>

          {weakTopics.length > 0 && (
            <div className="p-4 rounded-xl text-left mb-6" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <div className="font-bold text-sm mb-2 text-yellow-400">⚠️ Weak Areas — Need Revision</div>
              <div className="flex flex-wrap gap-2">
                {weakTopics.map((topic, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs" style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>{topic}</span>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl text-left" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div className="font-bold text-sm mb-2" style={{ color: "#A78BFA" }}>🤖 AI Recommendation</div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {passed
                ? `Excellent! You scored ${accuracy}%. Ready for the next chapter. ${weakTopics[0] ? `Strengthen ${weakTopics[0]} for exam excellence.` : ""}`
                : `You need more practice. Revisit ${weakTopics.join(", ") || "the chapter"} and retry. Spend 30 more minutes on theory first.`}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => { setPhase("review"); setReviewIndex(0); }} className="flex-1 btn-secondary py-3 rounded-xl">📋 Review Answers</button>
          <Link href="/" className="flex-1 btn-secondary py-3 rounded-xl text-center">🏠 Home</Link>
          <button
            onClick={() => { setPhase("loading"); setAnswers([]); setCurrent(0); setViolations(0); setFocusScore(100); setTotalTime(0); setQuestions([]); window.location.reload(); }}
            className="flex-1 btn-primary py-3 rounded-xl"
          >🔄 Retake</button>
        </div>
      </div>
    </div>
  );
}
