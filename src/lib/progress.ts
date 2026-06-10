// localStorage-based progress tracking — no database required

export interface QuizResult {
  date: string;        // ISO string
  subjectId: string;
  chapterId: string;
  classId: string;
  score: number;       // 0–100 (accuracy %)
  questionsTotal: number;
  questionsCorrect: number;
  type: "mcq" | "theory";
}

const KEY_QUIZ     = "dc_quiz_results";
const KEY_ACTIVITY = "dc_activity_days";
const KEY_JOIN     = "dc_join_date";

// XP needed to reach each level (index 0 = not used, index 1 = level 1 start)
const LEVEL_XP = [0, 0, 500, 1500, 3000, 5000, 8000, 12000, 17500, 25000, 35000];
const LEVEL_NAMES = ["", "Beginner", "Learner", "Explorer", "Scholar", "Brain", "Master", "Brain Forge", "Titan", "Legend", "Grand Master"];

function isBrowser() { return typeof window !== "undefined"; }
function todayStr()  { return new Date().toISOString().slice(0, 10); }

// ── Read ─────────────────────────────────────────────────────────────────────

export function getQuizResults(): QuizResult[] {
  if (!isBrowser()) return [];
  try { return JSON.parse(localStorage.getItem(KEY_QUIZ) ?? "[]"); }
  catch { return []; }
}

export function getActivityDays(): string[] {
  if (!isBrowser()) return [];
  try { return JSON.parse(localStorage.getItem(KEY_ACTIVITY) ?? "[]"); }
  catch { return []; }
}

// ── Write ─────────────────────────────────────────────────────────────────────

export function saveQuizResult(r: QuizResult): void {
  if (!isBrowser()) return;
  const results = getQuizResults();
  results.push(r);
  localStorage.setItem(KEY_QUIZ, JSON.stringify(results));
  recordActivity();
}

export function recordActivity(): void {
  if (!isBrowser()) return;
  const td = todayStr();
  const days = getActivityDays();
  if (!days.includes(td)) {
    days.push(td);
    localStorage.setItem(KEY_ACTIVITY, JSON.stringify(days));
  }
  if (!localStorage.getItem(KEY_JOIN)) {
    localStorage.setItem(KEY_JOIN, td);
  }
}

// ── Compute ───────────────────────────────────────────────────────────────────

export function computeStats() {
  const results  = getQuizResults();
  const days     = getActivityDays().sort();

  // XP: 50 base + 1.5× accuracy per quiz, +50 bonus for perfect
  let xp = 0;
  for (const r of results) {
    xp += 50 + Math.round(r.score * 1.5);
    if (r.score === 100) xp += 50;
  }

  // Level (1–10)
  let level = 1;
  for (let i = LEVEL_XP.length - 1; i >= 1; i--) {
    if (xp >= LEVEL_XP[i]) { level = i; break; }
  }
  level = Math.min(level, 10);
  const levelName     = LEVEL_NAMES[level] ?? "Grand Master";
  const xpForCurrent  = LEVEL_XP[level] ?? 0;
  const xpForNext     = LEVEL_XP[level + 1] ?? xpForCurrent + 5000;
  const xpProgress    = xpForNext > xpForCurrent
    ? Math.round(((xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100)
    : 100;

  // Streak: consecutive days up to today
  let streak = 0;
  const checkDate = new Date();
  while (true) {
    const ds = checkDate.toISOString().slice(0, 10);
    if (!days.includes(ds)) break;
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Accuracy & test count
  const testsCompleted  = results.length;
  const totalCorrect    = results.reduce((s, r) => s + r.questionsCorrect, 0);
  const totalQuestions  = results.reduce((s, r) => s + r.questionsTotal, 0);
  const accuracy        = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Per-subject scores map
  const subjectScores: Record<string, number[]> = {};
  for (const r of results) {
    if (!subjectScores[r.subjectId]) subjectScores[r.subjectId] = [];
    subjectScores[r.subjectId].push(r.score);
  }

  // Estimated study hours (avg 15 min per quiz + activity days × 30 min)
  const studyHours = Math.round((results.length * 0.25 + days.length * 0.5) * 10) / 10;

  return {
    xp,
    level,
    levelName,
    xpForNext,
    xpForCurrent,
    xpProgress,
    streak,
    testsCompleted,
    accuracy,
    subjectScores,
    activeDays: days.length,
    studyHours,
    joinDate: (isBrowser() ? localStorage.getItem(KEY_JOIN) : null) ?? todayStr(),
  };
}

export function getSubjectProgress(subjectId: string): number {
  const results = getQuizResults().filter(r => r.subjectId === subjectId);
  if (results.length === 0) return 0;
  return Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
}

// Heatmap: last 26 weeks of activity (182 days)
export function buildHeatmap(): { date: string; level: 0 | 1 | 2 | 3 | 4 }[] {
  const days = new Set(getActivityDays());
  const quizByDay: Record<string, number> = {};
  for (const r of getQuizResults()) {
    const d = r.date.slice(0, 10);
    quizByDay[d] = (quizByDay[d] ?? 0) + 1;
  }

  const result = [];
  const start = new Date();
  start.setDate(start.getDate() - 181); // 26 weeks back

  for (let i = 0; i < 182; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const ds = d.toISOString().slice(0, 10);
    const quizzes = quizByDay[ds] ?? 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (days.has(ds)) {
      level = quizzes === 0 ? 1 : quizzes === 1 ? 2 : quizzes === 2 ? 3 : 4;
    }
    result.push({ date: ds, level });
  }
  return result;
}
