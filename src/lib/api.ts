// All API calls now go through Next.js internal API routes powered by Gemini AI
// No more static data — everything is live

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgClass: string;
  description: string;
  progress: number;
  chaptersCompleted: number;
  totalChapters: number;
  score: number;
  totalTests?: number;
}

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  difficulty: string;
  estimatedTime: string;
  completed: boolean;
  score: number;
  topics: string[];
  aiRecommendation?: string | null;
}

export interface LeaderEntry {
  rank: number;
  name: string;
  class: string;
  score: number;
  streak: number;
  avatar: string;
  badge: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  avatarInitials: string;
  xp: number;
  level: number;
  levelName: string;
  streak: number;
  rank: number;
  testsCompleted: number;
  hoursStudied: number;
  accuracy: number;
  chaptersCompleted: number;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  type: "conceptual" | "logical" | "hots" | "application";
}

async function localGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return fallback;
    const json = await res.json();
    return json.data ?? fallback;
  } catch {
    return fallback;
  }
}

export function fetchSubjects(classId: number): Promise<Subject[]> {
  return localGet<Subject[]>(`/api/curriculum/subjects?classId=${classId}`, []);
}

export function fetchChapters(
  subjectId: string,
  classId: number,
  subjectName?: string
): Promise<Chapter[]> {
  const name = subjectName ? `&subjectName=${encodeURIComponent(subjectName)}` : "";
  return localGet<Chapter[]>(
    `/api/curriculum/chapters?subjectId=${subjectId}&classId=${classId}${name}`,
    []
  );
}

export function fetchLeaderboard(): Promise<LeaderEntry[]> {
  return localGet<LeaderEntry[]>("/api/leaderboard", []);
}

export function fetchUserProfile(): Promise<UserProfile | null> {
  return localGet<UserProfile | null>("/api/user/profile", null);
}

export function fetchMCQQuestions(
  subjectId: string,
  chapterId: string,
  classId: number,
  chapterName?: string,
  subjectName?: string,
  count = 20
): Promise<MCQQuestion[]> {
  const params = new URLSearchParams({
    subjectId,
    chapterId,
    classId: String(classId),
    count: String(count),
    ...(chapterName ? { chapterName } : {}),
    ...(subjectName ? { subjectName } : {}),
  });
  return localGet<MCQQuestion[]>(`/api/assessment/mcq?${params}`, []);
}
