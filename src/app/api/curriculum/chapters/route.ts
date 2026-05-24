import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function GET(req: NextRequest) {
  const subjectId = req.nextUrl.searchParams.get("subjectId") ?? "physics";
  const classId = req.nextUrl.searchParams.get("classId") ?? "11";
  const subjectName = req.nextUrl.searchParams.get("subjectName") ?? subjectId;

  try {
    const prompt = `List all chapters in the NCERT textbook for ${subjectName} Class ${classId} (CBSE curriculum).
Return a JSON array only. Each element must have:
- id: "ch1", "ch2", etc.
- name: exact NCERT chapter name
- estimatedTime: study hours as string like "3h", "4h 30m"
- difficulty: exactly one of "Explorer Mode", "Scholar Quest", "Master Journey", "Brain Forge", "Titan Challenge"
  (Explorer=easy, Scholar=medium-easy, Master=medium, Brain=hard, Titan=hardest)
- topics: array of 4-6 key topic strings covered in the chapter
- completed: false
- score: 0

Return ONLY the JSON array, no markdown, no explanation.`;

    const text = await callGemini(prompt);
    const chapters = JSON.parse(text);

    const enriched = chapters.map((ch: Record<string, unknown>, i: number) => ({
      ...ch,
      id: ch.id || `ch${i + 1}`,
      subjectId,
      aiRecommendation: null,
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err), data: [] },
      { status: 500 }
    );
  }
}
