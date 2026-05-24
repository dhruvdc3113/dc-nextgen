import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function GET(req: NextRequest) {
  const subjectId = req.nextUrl.searchParams.get("subjectId") ?? "physics";
  const chapterId = req.nextUrl.searchParams.get("chapterId") ?? "ch1";
  const classId = req.nextUrl.searchParams.get("classId") ?? "11";
  const chapterName = req.nextUrl.searchParams.get("chapterName") ?? chapterId;
  const subjectName = req.nextUrl.searchParams.get("subjectName") ?? subjectId;
  const count = parseInt(req.nextUrl.searchParams.get("count") ?? "20");

  try {
    const prompt = `Generate ${count} multiple-choice questions for the NCERT chapter "${chapterName}" from ${subjectName} Class ${classId} (CBSE curriculum).

Return a JSON array only. Each element must have:
- question: the question text (no numbering)
- options: array of exactly 4 answer choices (no "A)", "B)" prefixes)
- correctAnswer: index 0-3 of the correct option
- explanation: 2-3 sentence explanation of why the answer is correct
- topic: specific topic within the chapter this question covers
- difficulty: exactly one of "easy", "medium", "hard"
- type: exactly one of "conceptual", "application", "logical", "hots"

Distribution: ${Math.round(count * 0.4)} easy, ${Math.round(count * 0.4)} medium, ${Math.round(count * 0.2)} hard.
Cover all major topics of the chapter. Include HOTS questions for exam preparation.
Questions must be accurate and based on NCERT content.

Return ONLY the JSON array, no markdown, no explanation.`;

    const text = await callGemini(prompt);
    const questions = JSON.parse(text);

    const enriched = questions.map((q: Record<string, unknown>, i: number) => ({
      ...q,
      id: `q${i + 1}`,
      subjectId,
      chapterId,
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err), data: [] },
      { status: 500 }
    );
  }
}
