const API = process.env.NEXT_PUBLIC_API_URL ?? "https://dc-nextgen-api.vercel.app";

export interface Subject {
  id: string; name: string; icon: string; color: string;
  bgClass: string; description: string;
  progress: number; chaptersCompleted: number; totalChapters: number;
  score: number; totalTests: number;
}

export interface LeaderEntry {
  rank: number; name: string; class: string;
  score: number; streak: number; avatar: string; badge: string;
}

export interface UserProfile {
  name: string; email: string; class: number; avatar: string;
  xp: number; level: number; levelName: string;
  streak: number; rank: number;
  testsCompleted: number; hoursStudied: number; accuracy: number;
  chaptersCompleted: number;
}

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json.data ?? fallback;
  } catch {
    return fallback;
  }
}

export const fetchSubjects    = (classId: number) => get<Subject[]>(`/api/class/${classId}/subjects`, []);
export const fetchLeaderboard = ()                 => get<LeaderEntry[]>("/api/leaderboard", []);
export const fetchUserProfile = ()                 => get<UserProfile | null>("/api/user/profile", null);
