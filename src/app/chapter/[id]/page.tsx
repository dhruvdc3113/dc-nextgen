"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

const CHAPTER_CONTENT: Record<string, {
  title: string; subject: string; classNum: number; icon: string; color: string;
  summary: string; topics: TopicSection[]; formulas?: Formula[]; vocabulary?: VocabWord[];
  importantPoints: string[]; examTips: string[]; commonMistakes?: string[];
}> = {
  "physics-ch1": {
    title: "Kinematics", subject: "Physics", classNum: 11, icon: "⚡", color: "#EF4444",
    summary: "Kinematics is the branch of mechanics describing the motion of objects without considering the forces causing the motion. It deals with position, velocity, acceleration, and time relationships. This chapter forms the backbone of classical mechanics and is essential for understanding all subsequent physics topics.",
    topics: [
      {
        title: "Motion in a Straight Line",
        content: "When an object moves along a straight path, it undergoes rectilinear motion. The key quantities are: Position (x) — measured from a reference point; Displacement (Δx) — change in position with direction; Distance — total path length (scalar); Speed — distance/time (scalar); Velocity — displacement/time (vector).",
        subsections: [
          { heading: "Average vs Instantaneous Velocity", body: "Average velocity = Total displacement / Total time = Δx/Δt. Instantaneous velocity = lim(Δt→0) Δx/Δt = dx/dt. This is the slope of the position-time graph at any instant." },
          { heading: "Uniform vs Non-uniform Motion", body: "Uniform motion: equal distances in equal time intervals → constant velocity. Non-uniform motion: velocity changes over time → acceleration exists. The velocity-time graph's area gives displacement." },
        ],
      },
      {
        title: "Equations of Motion (Uniform Acceleration)",
        content: "For a body starting with initial velocity u, having uniform acceleration a, after time t:",
        subsections: [
          { heading: "First Equation: v = u + at", body: "Velocity after time t. Derived from definition of acceleration: a = (v-u)/t → v = u + at. This is linear in t; the v-t graph is a straight line with slope = a." },
          { heading: "Second Equation: s = ut + ½at²", body: "Displacement in time t. This is quadratic in t; represents area under v-t graph. For zero initial velocity (u=0): s = ½at²." },
          { heading: "Third Equation: v² = u² + 2as", body: "Velocity-displacement relationship (time-independent). Extremely useful when time is not given. Derived by eliminating t from the first two equations." },
          { heading: "Distance in nth second: Sₙ = u + a(2n-1)/2", body: "Distance covered specifically in the nth second. Note: This gives distance in one second only — not cumulative displacement." },
        ],
      },
      {
        title: "Projectile Motion",
        content: "Projectile motion is a 2D motion under gravity where horizontal velocity is constant and vertical motion is governed by gravity. Key insight: horizontal and vertical motions are independent.",
        subsections: [
          { heading: "Horizontal Component", body: "uₓ = u·cos θ (constant throughout flight since no horizontal force). Horizontal displacement: x = uₓt = u·cos θ · t" },
          { heading: "Vertical Component", body: "uᵧ = u·sin θ (decreases due to gravity). Vertical displacement: y = uᵧt - ½gt²" },
          { heading: "Key Results", body: "Time of flight: T = 2u·sin θ/g. Maximum height: H = u²sin²θ/2g. Range: R = u²sin 2θ/g. Maximum range at θ = 45°: Rₘₐₓ = u²/g" },
        ],
      },
      {
        title: "Relative Motion",
        content: "The motion of an object as observed from a moving frame of reference. Velocity of A relative to B: v_AB = v_A - v_B.",
        subsections: [
          { heading: "River-Boat Problems", body: "A boat crossing a river: Resultant velocity = √(v_boat² + v_river²). To cross in minimum time: boat must point perpendicular to river bank. To cross minimum distance: boat must angle upstream." },
          { heading: "Rain-Man Problems", body: "A person must tilt umbrella in the direction of relative velocity of rain with respect to man. If man runs with velocity v_m, rain appears to come from the direction the man is moving toward." },
        ],
      },
    ],
    formulas: [
      { name: "First Equation of Motion", formula: "v = u + at", description: "Final velocity after time t", variables: ["v: final velocity", "u: initial velocity", "a: acceleration", "t: time"] },
      { name: "Second Equation of Motion", formula: "s = ut + ½at²", description: "Displacement in time t", variables: ["s: displacement", "u: initial velocity", "a: acceleration", "t: time"] },
      { name: "Third Equation of Motion", formula: "v² = u² + 2as", description: "Velocity-displacement relation", variables: ["v: final velocity", "u: initial velocity", "a: acceleration", "s: displacement"] },
      { name: "Projectile Range", formula: "R = u²sin2θ / g", description: "Horizontal range of projectile", variables: ["u: initial speed", "θ: angle of projection", "g: gravitational acceleration"] },
      { name: "Max Height", formula: "H = u²sin²θ / 2g", description: "Maximum height in projectile", variables: ["u: initial speed", "θ: angle", "g: 9.8 m/s²"] },
      { name: "Time of Flight", formula: "T = 2u·sinθ / g", description: "Total time in the air", variables: ["u: initial speed", "θ: angle", "g: 9.8 m/s²"] },
    ],
    importantPoints: [
      "Displacement can be zero even when distance is non-zero (e.g., circular motion returning to start)",
      "Instantaneous speed = magnitude of instantaneous velocity",
      "For maximum range in projectile motion, angle = 45°",
      "Complementary angles (θ and 90°-θ) give the same range",
      "At maximum height, vertical velocity = 0 but horizontal velocity unchanged",
      "The path of a projectile is a parabola",
      "Acceleration due to gravity is always downward: g = 9.8 m/s² ≈ 10 m/s²",
      "In a v-t graph: slope = acceleration, area = displacement",
    ],
    examTips: [
      "HOTS: Often asked — derive equation of trajectory y = x·tanθ - gx²/2u²cos²θ",
      "Draw the v-t and s-t graphs for uniform acceleration — always asked",
      "Know the difference: average velocity and instantaneous velocity",
      "River-boat problems: minimum time → perpendicular crossing; minimum drift → angle upstream",
      "3-mark questions often ask for derivation of v² = u² + 2as",
    ],
    commonMistakes: [
      "Confusing distance with displacement",
      "Applying equations of motion to non-uniform acceleration",
      "Forgetting that horizontal velocity stays constant in projectile motion",
      "Using g = 9.8 when g = 10 is given (use what's given!)",
    ],
  },
  "english-ch1": {
    title: "The Last Lesson", subject: "English", classNum: 12, icon: "📖", color: "#A78BFA",
    summary: "\"The Last Lesson\" by Alphonse Daudet is a poignant story set in Alsace-Lorraine during the Franco-Prussian War (1870-71). After France's defeat, Prussia orders all schools in the region to teach German instead of French. On the day of the last French lesson, M. Hamel, the teacher, and the students realize the importance of their mother tongue. The story explores themes of patriotism, loss, linguistic identity, and the impact of imperialism on cultural identity.",
    topics: [
      {
        title: "Story Summary & Plot",
        content: "Franz, a young student who has been neglecting his studies, is on his way to school dreading the French grammar test. He notices unusual things — notice boards with news from Berlin, the blacksmith reading a notice, people crowding outside. When he enters school, he finds M. Hamel in his finest clothes. The school is unusually quiet with the entire village present.",
        subsections: [
          { heading: "The Shock", body: "M. Hamel announces that this is their last French lesson. Starting tomorrow, only German will be taught in Alsace and Lorraine. This news devastates both teacher and students. Franz immediately regrets all the time he wasted not learning French." },
          { heading: "M. Hamel's Last Lesson", body: "M. Hamel delivers his most beautiful lesson with patience and dedication. He tells the class: 'Hold fast to your language, for when a people are enslaved, as long as they hold fast to their language, it is as if they had the key to their prison.' He blames himself and the parents for neglecting French education." },
          { heading: "The Emotional Climax", body: "As the church clock strikes noon and the Prussian trumpets blow, M. Hamel is overcome with emotion. He writes 'Vive La France!' (Long Live France!) on the board, then makes a gesture indicating the lesson is over and dismisses the class." },
        ],
      },
      {
        title: "Character Analysis",
        content: "The story features three main characters who undergo significant development.",
        subsections: [
          { heading: "Franz", body: "A young, carefree student who is initially irresponsible about his studies. The announcement of the last French lesson acts as a catalyst — he undergoes a complete transformation. His perspective shifts from dreading lessons to desperately wanting to learn. Franz represents the common people who realize the value of their culture too late." },
          { heading: "M. Hamel", body: "A dedicated teacher who has taught French for 40 years. He wears his best French Sunday clothes for the last lesson — an act of patriotism. He takes responsibility for students' lack of learning, acknowledging he sometimes sent them to water flowers instead of studying. He represents the tragic loss felt by educators during occupation." },
          { heading: "Villagers of Alsace", body: "The village elders who attend the last lesson represent the entire community's grief. Their presence symbolizes how a whole community wakes up to the value of its cultural heritage only when it's about to be taken away." },
        ],
      },
      {
        title: "Themes & Symbolism",
        content: "The story operates on multiple thematic levels.",
        subsections: [
          { heading: "Language as Identity", body: "The central theme — French language is not just a means of communication but the identity of the Alsatian people. When language is taken away, cultural identity is threatened. Daudet argues that language is the key to a nation's freedom." },
          { heading: "Effect of Imperialism", body: "The story critiques the destruction of cultural identity through colonial or imperial occupation. The Prussian decree to teach only German is an act of cultural erasure — a tool of oppression beyond military conquest." },
          { heading: "Procrastination and Regret", body: "Franz's regret about not learning his language earlier is a universal human experience. The story warns against taking our cultural heritage for granted until it's too late." },
          { heading: "The Pigeons (Symbolism)", body: "When Franz hears the pigeons cooing on the roof and thinks they will make them sing in German too — this symbolizes the fear of even nature being subjugated by the occupiers." },
        ],
      },
    ],
    vocabulary: [
      { word: "Dread", meaning: "great fear or apprehension", usage: "Franz dreaded going to school" },
      { word: "Gazing", meaning: "looking steadily and intently", usage: "The blacksmith was gazing at the notice board" },
      { word: "Reproach", meaning: "express disapproval or disappointment", usage: "M. Hamel did not reproach Franz" },
      { word: "Bustle", meaning: "activity done in a hurried and noisy way", usage: "There was no bustle of students in the school" },
      { word: "Succession", meaning: "a number of things or events coming one after another", usage: "In succession, all the villages adopted German" },
      { word: "Seized", meaning: "took by force", usage: "The Germans had seized the schools" },
      { word: "Temptation", meaning: "desire to do something wrong", usage: "Franz resisted the temptation to bunk school" },
    ],
    importantPoints: [
      "Story is set in Alsace-Lorraine during the Franco-Prussian War of 1870",
      "M. Hamel wears his best French clothes as an act of patriotism",
      "Franz represents all those who realize the value of things too late",
      "The story is narrated from Franz's first-person perspective",
      "M. Hamel blames himself, parents, and the village for neglecting French",
      "'Vive La France!' = Long Live France — M. Hamel's emotional final words",
      "Pigeons symbolize nature being enslaved along with the people",
      "The title 'The Last Lesson' is deeply symbolic — last lesson of French language",
    ],
    examTips: [
      "Character sketch questions: always include quotes to support analysis",
      "The line 'When a people are enslaved...' is the most important quote",
      "Value-based question: relate the theme of language identity to modern contexts",
      "1-mark MCQ: Why did M. Hamel wear his best clothes?",
      "3-mark: Describe Franz's transformation in the lesson",
      "5-mark: Discuss the theme of linguistic identity in 'The Last Lesson'",
    ],
  },
  "maths-ch1": {
    title: "Sets & Relations", subject: "Maths", classNum: 11, icon: "∑", color: "#3B82F6",
    summary: "Sets form the foundation of modern mathematics. A set is a well-defined collection of objects. This chapter covers set notation, types of sets, set operations, Venn diagrams, and introduces relations as a bridge to functions. Mastering sets is essential for probability, algebra, and all higher mathematics.",
    topics: [
      {
        title: "Sets — Definition & Representation",
        content: "A set is a well-defined collection of distinct objects called elements or members. 'Well-defined' means there is no ambiguity in whether an object belongs to the set.",
        subsections: [
          { heading: "Roster Form (Tabular)", body: "Elements are listed within curly brackets separated by commas. Example: A = {1, 2, 3, 4, 5} or B = {a, e, i, o, u}. Repetition is not allowed; order doesn't matter." },
          { heading: "Set Builder Form (Rule Method)", body: "A = {x : x is a natural number less than 6} or A = {x | x ∈ ℕ, x < 6}. Read as 'the set of all x such that x satisfies the given condition.'" },
          { heading: "Types of Sets", body: "Empty Set (∅ or {}): no elements. Finite Set: definite number of elements. Infinite Set: unlimited elements. Singleton Set: exactly one element. Equal Sets: same elements. Equivalent Sets: same number of elements." },
        ],
      },
      {
        title: "Subsets & Power Sets",
        content: "Set A is a subset of B (A ⊆ B) if every element of A is also in B.",
        subsections: [
          { heading: "Subset Rules", body: "Every set is a subset of itself: A ⊆ A. Empty set is a subset of every set: ∅ ⊆ A. If A ⊆ B and B ⊆ A then A = B." },
          { heading: "Power Set", body: "P(A) = collection of all subsets of A. If |A| = n, then |P(A)| = 2ⁿ. Example: A = {1,2}, P(A) = {∅, {1}, {2}, {1,2}} — 4 = 2² subsets." },
          { heading: "Universal Set", body: "The set containing all elements under consideration, denoted U. All other sets in a discussion are subsets of U." },
        ],
      },
      {
        title: "Set Operations",
        content: "Operations on sets combine or compare sets to form new sets.",
        subsections: [
          { heading: "Union (A ∪ B)", body: "All elements in A or B or both. |A ∪ B| = |A| + |B| - |A ∩ B| (inclusion-exclusion principle). Properties: Commutative, Associative, A ∪ ∅ = A, A ∪ U = U." },
          { heading: "Intersection (A ∩ B)", body: "Elements common to both A and B. |A ∩ B| = elements in both sets. If A ∩ B = ∅, sets are called disjoint." },
          { heading: "Difference (A - B)", body: "Elements in A but not in B. A - B ≠ B - A (not commutative). |A - B| = |A| - |A ∩ B|." },
          { heading: "Complement (A')", body: "A' = U - A = all elements of U not in A. (A')' = A; A ∪ A' = U; A ∩ A' = ∅." },
        ],
      },
      {
        title: "Venn Diagrams",
        content: "Venn diagrams are visual representations of set relationships using overlapping circles inside a rectangle (universal set).",
        subsections: [
          { heading: "Interpreting Venn Diagrams", body: "Only A region: A - B. Only B region: B - A. Overlapping region: A ∩ B. Combined circle regions: A ∪ B. Outside both circles: (A ∪ B)' = A' ∩ B'." },
          { heading: "De Morgan's Laws", body: "(A ∪ B)' = A' ∩ B' and (A ∩ B)' = A' ∪ B'. These laws are extremely important for solving complement-based problems." },
        ],
      },
    ],
    formulas: [
      { name: "Cardinality of Union", formula: "|A ∪ B| = |A| + |B| − |A ∩ B|", description: "Number of elements in union (Inclusion-Exclusion Principle)", variables: ["|A|: number of elements in A", "|B|: number of elements in B", "|A ∩ B|: common elements"] },
      { name: "Power Set", formula: "|P(A)| = 2ⁿ", description: "Number of subsets when set has n elements", variables: ["n: number of elements in A"] },
      { name: "Three Sets", formula: "|A∪B∪C| = |A|+|B|+|C|−|A∩B|−|B∩C|−|A∩C|+|A∩B∩C|", description: "Inclusion-exclusion for three sets", variables: ["Apply systematically — add singles, subtract pairs, add triple intersection"] },
      { name: "Complement", formula: "|A'| = |U| − |A|", description: "Number of elements not in A", variables: ["|U|: total elements in universal set"] },
    ],
    importantPoints: [
      "Order and repetition do NOT matter in a set: {1,2,3} = {3,1,2} = {1,1,2,3}",
      "Power set of empty set: P(∅) = {∅} — has 1 element",
      "De Morgan's Laws: (A∪B)' = A'∩B'; (A∩B)' = A'∪B'",
      "Inclusion-Exclusion: crucial for word problems with 'how many students study both...'",
      "Every set is its own subset; empty set is subset of every set",
      "Equal sets have same elements; equivalent sets have same number of elements",
      "Commutative: A∪B = B∪A and A∩B = B∩A",
      "Distributive: A∩(B∪C) = (A∩B)∪(A∩C)",
    ],
    examTips: [
      "Word problems: draw a Venn diagram first — it prevents errors",
      "n(A∪B∪C) formula: memorize it — it appears in 3-5 mark questions",
      "De Morgan's Laws: frequently asked in MCQ and short answer",
      "Prove that A ⊆ B iff A ∩ B = A — a common 2-mark proof",
      "Empty set is both a subset of every set AND an element of the power set",
    ],
  },
};

interface TopicSection {
  title: string;
  content: string;
  subsections: { heading: string; body: string }[];
}
interface Formula {
  name: string;
  formula: string;
  description: string;
  variables: string[];
}
interface VocabWord {
  word: string;
  meaning: string;
  usage: string;
}

export default function ChapterPage() {
  const params = useParams();
  const id = params?.id as string;
  const [lightMode, setLightMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "formulas" | "vocab" | "tips">("content");
  const [expandedTopic, setExpandedTopic] = useState<number | null>(0);

  useEffect(() => {
    document.body.className = lightMode ? "light-mode" : "";
  }, [lightMode]);

  const content = CHAPTER_CONTENT[id] || CHAPTER_CONTENT["physics-ch1"];

  const tabs = [
    { id: "content", label: "📖 Content" },
    ...(content.formulas ? [{ id: "formulas", label: "📐 Formulas" }] : []),
    ...(content.vocabulary ? [{ id: "vocab", label: "📚 Vocabulary" }] : []),
    { id: "tips", label: "🎯 Exam Tips" },
  ] as { id: typeof activeTab; label: string }[];

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Navbar lightMode={lightMode} onToggleTheme={() => setLightMode((l) => !l)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-8">
        {/* Header */}
        <div
          className="glass-card p-7 relative overflow-hidden"
          style={{ border: `1px solid ${content.color}30` }}
        >
          <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at top right, ${content.color}, transparent 70%)` }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link> /
              <Link href={`/class/${content.classNum}`} className="hover:text-purple-400 transition-colors">Class {content.classNum}</Link> /
              <Link href={`/subject/${content.subject.toLowerCase()}/11`} className="hover:text-purple-400 transition-colors">{content.subject}</Link> /
              <span style={{ color: "var(--foreground)" }}>{content.title}</span>
            </div>
            <div className="flex items-start gap-5">
              <div className="text-5xl">{content.icon}</div>
              <div className="flex-1">
                <h1 className="text-3xl font-black mb-2">{content.title}</h1>
                <div className="flex flex-wrap gap-3 text-sm mb-4">
                  <span style={{ color: "var(--text-muted)" }}>{content.subject} · Class {content.classNum}</span>
                  <span style={{ color: content.color }}>● {content.topics.length} Topics</span>
                  {content.formulas && <span style={{ color: "#06B6D4" }}>📐 {content.formulas.length} Formulas</span>}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{content.summary}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link href={`/assessment/mcq/${id}`} className="btn-primary text-sm px-5 py-2.5 rounded-xl">
                🎯 Take MCQ Test
              </Link>
              <Link href={`/assessment/theory/${id}`} className="btn-secondary text-sm px-5 py-2.5 rounded-xl">
                📝 Theory Test
              </Link>
              <button className="btn-secondary text-sm px-5 py-2.5 rounded-xl">
                🃏 Flashcards
              </button>
              <button className="btn-secondary text-sm px-5 py-2.5 rounded-xl">
                🧠 Mind Map
              </button>
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
                  <div className="px-5 pb-5 animate-fade-in">
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
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <span>⭐</span> Important Points to Remember
              </h3>
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
            {content.commonMistakes && (
              <div className="glass-card p-6" style={{ border: "1px solid rgba(239,68,68,0.3)" }}>
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                  <span>⚠️</span> Common Mistakes to Avoid
                </h3>
                <div className="space-y-2">
                  {content.commonMistakes.map((m, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-red-400 flex-shrink-0">✗</span>
                      <span style={{ color: "var(--text-secondary)" }}>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FORMULAS TAB */}
        {activeTab === "formulas" && content.formulas && (
          <div className="space-y-4">
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
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">🎯 Exam Strategy & Tips</h3>
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
              <Link href={`/assessment/mcq/${id}`} className="flex-1 btn-primary text-center py-4 rounded-2xl text-sm font-bold">
                🎯 Start MCQ Assessment (50 Questions)
              </Link>
              <Link href={`/assessment/theory/${id}`} className="flex-1 btn-secondary text-center py-4 rounded-2xl text-sm font-bold">
                📝 Start Theory Test (80 Marks)
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
