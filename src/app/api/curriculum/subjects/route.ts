import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function GET(req: NextRequest) {
  const classId = req.nextUrl.searchParams.get("classId") ?? "11";

  try {
    const prompt = `List all subjects taught in Class ${classId} under the Indian CBSE curriculum.
Return a JSON array only. Each element must have:
- id: lowercase hyphen-free slug (e.g. "physics", "maths", "english")
- name: full subject name as per NCERT
- icon: one relevant emoji
- color: a vivid hex color unique per subject
- description: 4-6 words describing the subject
- totalChapters: realistic integer (NCERT chapter count for this class)

Return ONLY the JSON array, no markdown, no explanation.`;

    const text = await callGemini(prompt);
    const subjects = JSON.parse(text);

    const colorMap: Record<string, string> = {
      physics: "#EF4444", chemistry: "#F59E0B", biology: "#10B981",
      maths: "#3B82F6", mathematics: "#3B82F6", english: "#A78BFA",
      "social science": "#F97316", sst: "#F97316", history: "#F97316",
      geography: "#14B8A6", science: "#06B6D4", hindi: "#EC4899",
      economics: "#14B8A6", accounts: "#8B5CF6", "computer science": "#6366F1",
      computer: "#6366F1", evs: "#10B981", gk: "#F59E0B",
    };

    const enriched = subjects.map((s: Record<string, unknown>) => ({
      ...s,
      color: s.color || colorMap[(s.id as string)?.toLowerCase()] || "#7C3AED",
      bgClass: `subject-${(s.id as string)?.toLowerCase().replace(/\s+/g, "")}`,
      progress: 0,
      chaptersCompleted: 0,
      score: 0,
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err), data: [] },
      { status: 500 }
    );
  }
}
