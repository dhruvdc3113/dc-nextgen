"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const DIFFICULTY_LEVELS = [
  { id: "explorer", name: "Explorer Mode", icon: "🌱", color: "#10B981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", desc: "Foundation level — core concepts and basic application" },
  { id: "scholar", name: "Scholar Quest", icon: "📘", color: "#3B82F6", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", desc: "Intermediate level — analysis and moderate difficulty" },
  { id: "master", name: "Master Journey", icon: "⚔️", color: "#7C3AED", bg: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.3)", desc: "Advanced level — HOTS and application-based questions" },
  { id: "brain", name: "Brain Forge", icon: "🧠", color: "#F59E0B", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", desc: "Expert level — board-exam pattern with full marks distribution" },
  { id: "titan", name: "Titan Challenge", icon: "🔥", color: "#EF4444", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", desc: "Championship level — JEE/NEET/Olympiad standard" },
  { id: "legend", name: "Legend Arena", icon: "🌟", color: "#F59E0B", bg: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(245,158,11,0.1))", border: "#F59E0B", desc: "Ultimate challenge — unseen complex problems" },
] as const;

const THEORY_PAPERS: Record<string, {
  title: string;
  duration: number;
  marks: number;
  sections: Section[];
  answerKey: AnswerItem[];
}[]> = {
  default: [
    {
      title: "Theory Test 1 — Kinematics & Laws of Motion",
      duration: 150,
      marks: 80,
      sections: [
        {
          name: "Section A — Very Short Answer (1 Mark each)",
          instructions: "Answer all questions. Each question carries 1 mark.",
          questions: [
            { no: 1, marks: 1, text: "Define instantaneous velocity." },
            { no: 2, marks: 1, text: "State Newton's First Law of Motion." },
            { no: 3, marks: 1, text: "What is the SI unit of acceleration?" },
            { no: 4, marks: 1, text: "A body is projected horizontally. What is the horizontal acceleration?" },
            { no: 5, marks: 1, text: "At what angle of projection is the range maximum?" },
            { no: 6, marks: 1, text: "Write the third equation of motion." },
            { no: 7, marks: 1, text: "What does the slope of a velocity-time graph represent?" },
            { no: 8, marks: 1, text: "Define inertia." },
          ],
        },
        {
          name: "Section B — Short Answer (2 Marks each)",
          instructions: "Answer any 8 out of 10 questions. Each carries 2 marks.",
          questions: [
            { no: 9, marks: 2, text: "Distinguish between distance and displacement with examples." },
            { no: 10, marks: 2, text: "Derive the equation v = u + at using the velocity-time graph." },
            { no: 11, marks: 2, text: "A ball is thrown vertically upward with velocity 20 m/s. Find: (i) maximum height, (ii) time to reach maximum height. (g = 10 m/s²)" },
            { no: 12, marks: 2, text: "State and explain Newton's Third Law of Motion with two examples." },
            { no: 13, marks: 2, text: "What is meant by 'apparent weight'? When does an object appear weightless in a lift?" },
            { no: 14, marks: 2, text: "A car of mass 1000 kg accelerates from rest to 20 m/s in 10 s. Find the net force on the car." },
            { no: 15, marks: 2, text: "What is the difference between kinetic friction and static friction? Which is larger?" },
            { no: 16, marks: 2, text: "A stone is dropped from a height of 80 m. Find the time taken to reach the ground and its velocity on impact. (g = 10 m/s²)" },
            { no: 17, marks: 2, text: "Define the coefficient of friction. Write its SI unit." },
            { no: 18, marks: 2, text: "Explain with a diagram the concept of relative velocity." },
          ],
        },
        {
          name: "Section C — Long Answer (5 Marks each)",
          instructions: "Answer any 4 out of 5 questions. Each carries 5 marks.",
          questions: [
            { no: 19, marks: 5, text: "Derive the three equations of motion for uniform acceleration using the graphical method. Explain each graph clearly." },
            { no: 20, marks: 5, text: "Explain projectile motion. Derive expressions for: (a) time of flight, (b) maximum height, (c) horizontal range. Under what condition is range maximum?" },
            { no: 21, marks: 5, text: "State and prove the law of conservation of linear momentum. Give three real-life applications." },
            { no: 22, marks: 5, text: "Define the angle of friction and angle of repose. Show that both are equal. Explain the use of this concept in solving inclined plane problems." },
            { no: 23, marks: 5, text: "What is circular motion? Define centripetal force. Derive the formula for centripetal acceleration. Give three examples of circular motion in daily life." },
          ],
        },
        {
          name: "Section D — Case Study (4 Marks)",
          instructions: "Read the passage carefully and answer the questions that follow.",
          questions: [
            {
              no: 24, marks: 4,
              text: `A rocket is launched vertically. During the first minute, it accelerates uniformly from rest to 500 m/s. It then travels at constant velocity for the next 2 minutes. Finally, the fuel is cut off and it moves under gravity alone.\n\n(a) Calculate the acceleration during the first minute. (1 mark)\n(b) Find the distance covered during the first minute. (1 mark)\n(c) Find the distance covered at constant velocity. (1 mark)\n(d) What happens to the rocket when fuel is cut off? Explain using Newton's Laws. (1 mark)`,
            },
          ],
        },
      ],
      answerKey: [
        { no: 1, marks: 1, answer: "Instantaneous velocity is the velocity of a particle at a specific instant of time. Mathematically, v = lim(Δt→0) Δx/Δt = dx/dt." },
        { no: 2, marks: 1, answer: "Newton's First Law (Law of Inertia): A body continues to remain in its state of rest or uniform motion in a straight line unless acted upon by a net external force." },
        { no: 3, marks: 1, answer: "SI unit of acceleration is m/s² (metre per second squared)." },
        { no: 4, marks: 1, answer: "In horizontal projectile motion, horizontal acceleration = 0 (no horizontal force acts, assuming air resistance is neglected)." },
        { no: 5, marks: 1, answer: "Maximum range occurs at angle of projection θ = 45°. Rmax = u²/g." },
        { no: 6, marks: 1, answer: "Third equation of motion: v² = u² + 2as, where v = final velocity, u = initial velocity, a = acceleration, s = displacement." },
        { no: 7, marks: 1, answer: "The slope of a velocity-time (v-t) graph represents acceleration. Slope = Δv/Δt = acceleration." },
        { no: 8, marks: 1, answer: "Inertia is the property of a body by virtue of which it resists any change in its state of rest or uniform motion. It is directly proportional to mass." },
        { no: 9, marks: 2, answer: "Distance: total path length covered; scalar; always positive. Example: A person walking 4 km East then 3 km West covers distance = 7 km. Displacement: shortest path from initial to final position; vector; can be negative. Example: Same person's displacement = 1 km East." },
        { no: 10, marks: 2, answer: "Graphically, a body starts with velocity u and reaches v in time t. The v-t graph is a straight line. Slope = acceleration a = (v-u)/t. Therefore: v - u = at → v = u + at. (Full marks require the graph with proper labeling of axes, u, v, t, and the derivation steps.)" },
        { no: 11, marks: 2, answer: "(i) At max height, final velocity = 0. Using v² = u² - 2gh: 0 = 20² - 2(10)h → h = 400/20 = 20 m. (ii) Using v = u - gt: 0 = 20 - 10t → t = 2 s." },
        { no: 19, marks: 5, answer: "Complete graphical derivation required: (1) v = u + at: Area calculation from v-t graph; (2) s = ut + ½at²: Trapezoid area interpretation; (3) v² = u² + 2as: Derived by eliminating t. Each derivation must include graph, working, and conclusion." },
        { no: 20, marks: 5, answer: "Projectile motion: 2D motion where horizontal velocity is constant and vertical motion follows gravity. Time of flight T = 2u·sinθ/g (derive using y=0 condition). Max height H = u²sin²θ/2g (derive using v²=u²-2gy). Range R = u²sin2θ/g (derive using R=u·cosθ·T). Maximum R when θ=45°, since sin2θ=1." },
      ],
    },
  ],
};

interface Section {
  name: string;
  instructions: string;
  questions: { no: number; marks: number; text: string }[];
}
interface AnswerItem {
  no: number;
  marks: number;
  answer: string;
}

type Phase = "select" | "exam" | "answers";

export default function TheoryPage() {
  const params = useParams();
  const id = params?.id as string;
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [expandedAnswer, setExpandedAnswer] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const paper = (THEORY_PAPERS[id] || THEORY_PAPERS.default)[0];

  const startExam = useCallback(() => {
    setTimeLeft(paper.duration * 60);
    setPhase("exam");
  }, [paper.duration]);

  useEffect(() => {
    if (phase !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("answers");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalDurationSeconds = paper.duration * 60;
  const pct = timeLeft / totalDurationSeconds;
  const timerColor = pct > 0.5 ? "#10B981" : pct > 0.25 ? "#F59E0B" : "#EF4444";

  // DIFFICULTY SELECT
  if (phase === "select") {
    return (
      <div className="min-h-screen grid-bg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <div className="text-center">
            <div className="text-5xl mb-4">📝</div>
            <h1 className="text-3xl font-black gradient-text mb-2">Theory Assessment</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Select a difficulty level to begin your theory test
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIFFICULTY_LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedDifficulty(lvl.id)}
                className="glass-card p-5 text-left transition-all"
                style={{
                  border: `2px solid ${selectedDifficulty === lvl.id ? lvl.color : "var(--card-border)"}`,
                  background: selectedDifficulty === lvl.id ? lvl.bg : "var(--card-bg)",
                  transform: selectedDifficulty === lvl.id ? "scale(1.02)" : "scale(1)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{lvl.icon}</div>
                  <div>
                    <div className="font-black text-sm" style={{ color: lvl.color }}>{lvl.name}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>10–15 tests available</div>
                  </div>
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{lvl.desc}</p>
                {selectedDifficulty === lvl.id && (
                  <div className="mt-3 text-xs font-bold flex items-center gap-1" style={{ color: lvl.color }}>
                    ✓ Selected
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Paper info */}
          <div className="glass-card p-6">
            <h3 className="font-black text-lg mb-4">{paper.title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {[
                { label: "Total Marks", value: `${paper.marks}`, icon: "📊" },
                { label: "Duration", value: `${paper.duration} mins`, icon: "⏱" },
                { label: "Sections", value: `${paper.sections.length}`, icon: "📋" },
                { label: "Questions", value: paper.sections.reduce((s, sec) => s + sec.questions.length, 0).toString(), icon: "❓" },
              ].map((stat, i) => (
                <div key={i} className="text-center p-3 rounded-xl" style={{ background: "rgba(124,58,237,0.1)" }}>
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="font-black" style={{ color: "#A78BFA" }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <div className="font-bold text-yellow-400 mb-1">📌 Instructions</div>
              <div className="space-y-1" style={{ color: "var(--text-secondary)" }}>
                <p>• Solve the paper in your notebook — only the question paper is shown here.</p>
                <p>• Timer runs for {paper.duration} minutes. Answer key reveals automatically after time.</p>
                <p>• Read all instructions carefully before starting each section.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/" className="flex-1 btn-secondary py-3 rounded-xl text-center">← Back</Link>
            <button
              onClick={startExam}
              disabled={!selectedDifficulty}
              className="flex-1 btn-primary py-3 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Test 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EXAM PAPER SCREEN
  if (phase === "exam") {
    return (
      <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        {/* Sticky timer */}
        <div
          className="sticky top-0 z-50 border-b p-4 flex items-center justify-between"
          style={{ background: "rgba(5,5,15,0.95)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
        >
          <div>
            <div className="font-black text-sm">{paper.title}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Total Marks: {paper.marks} · Solve in notebook
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="font-black text-2xl" style={{ color: timerColor }}>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>remaining</div>
            </div>
            <button
              onClick={() => setPhase("answers")}
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}
            >
              Submit →
            </button>
          </div>
        </div>

        {/* Timer progress bar */}
        <div className="h-1" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="h-full transition-all" style={{ width: `${pct * 100}%`, background: timerColor }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Paper header */}
          <div className="text-center border-b pb-6" style={{ borderColor: "var(--card-border)" }}>
            <div className="font-black text-2xl uppercase tracking-wide gradient-text">DC NextGen Academy</div>
            <div className="font-bold text-lg mt-1">{paper.title}</div>
            <div className="flex justify-center gap-8 mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <span>Time: {paper.duration} minutes</span>
              <span>Maximum Marks: {paper.marks}</span>
            </div>
            <div className="mt-3 text-sm font-medium" style={{ color: "#A78BFA" }}>
              ✏️ Solve all answers in your notebook · Answers reveal after time ends
            </div>
          </div>

          {/* General Instructions */}
          <div className="glass-card p-5">
            <div className="font-bold mb-3">General Instructions:</div>
            <ol className="space-y-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>1. All questions are compulsory unless stated otherwise.</li>
              <li>2. Draw neat and labeled diagrams wherever necessary.</li>
              <li>3. Write complete derivations for proof-based questions.</li>
              <li>4. Show all calculations clearly with proper units.</li>
              <li>5. Write answers in the same sequence as the question paper.</li>
            </ol>
          </div>

          {/* Sections */}
          {paper.sections.map((section, si) => (
            <div key={si} className="glass-card overflow-hidden">
              <div
                className="p-5 border-b"
                style={{ background: "rgba(124,58,237,0.1)", borderColor: "rgba(124,58,237,0.2)" }}
              >
                <div className="font-black text-lg">{section.name}</div>
                <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{section.instructions}</div>
              </div>
              <div className="p-5 space-y-5">
                {section.questions.map((q) => (
                  <div key={q.no} className="flex gap-4">
                    <div className="font-black text-sm flex-shrink-0 w-8" style={{ color: "#A78BFA" }}>
                      {q.no}.
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{q.text}</p>
                    </div>
                    <div
                      className="flex-shrink-0 font-bold text-sm px-2 py-0.5 rounded"
                      style={{ color: "#F59E0B", background: "rgba(245,158,11,0.1)" }}
                    >
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

  // ANSWER KEY SCREEN
  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center glass-card p-8">
          <div className="text-5xl mb-4">🏁</div>
          <h1 className="text-3xl font-black gradient-text mb-2">Time&apos;s Up!</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Compare your answers with the official answer key below
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 rounded-xl" style={{ background: "rgba(124,58,237,0.2)", color: "#A78BFA" }}>
              Total Marks: {paper.marks}
            </div>
            <div className="px-4 py-2 rounded-xl" style={{ background: "rgba(16,185,129,0.2)", color: "#10B981" }}>
              Self-evaluate your paper
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-xl">📋 Official Answer Key</h2>
            <div className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.2)", color: "#A78BFA" }}>
              Marking Scheme Included
            </div>
          </div>
          <div className="space-y-4">
            {paper.answerKey.map((ans) => (
              <div key={ans.no} className="border rounded-xl overflow-hidden" style={{ borderColor: "var(--card-border)" }}>
                <button
                  className="w-full p-4 flex items-center justify-between text-left"
                  onClick={() => setExpandedAnswer(expandedAnswer === ans.no ? null : ans.no)}
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black" style={{ color: "#A78BFA" }}>Q{ans.no}.</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}
                    >
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

        {/* Examiner Tips */}
        <div className="glass-card p-6" style={{ border: "1px solid rgba(124,58,237,0.3)" }}>
          <h3 className="font-black text-lg mb-4">💡 Examiner Tips</h3>
          <div className="space-y-2">
            {[
              "Derivations: Always start from first principles — don't skip steps.",
              "Diagrams: Label all axes, forces, and important quantities clearly.",
              "Units: Always write SI units — missing units costs marks.",
              "For numerical: Show given data, formula used, substitution, and final answer with unit.",
              "Case study: Read the passage carefully — all answers are in or related to the passage.",
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl text-sm" style={{ background: "rgba(124,58,237,0.08)" }}>
                <span className="text-purple-400 flex-shrink-0">{i + 1}.</span>
                <span style={{ color: "var(--text-secondary)" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/" className="flex-1 btn-secondary py-3 rounded-xl text-center">🏠 Home</Link>
          <button onClick={() => setPhase("select")} className="flex-1 btn-primary py-3 rounded-xl">
            🔄 Try Another Level
          </button>
        </div>
      </div>
    </div>
  );
}
