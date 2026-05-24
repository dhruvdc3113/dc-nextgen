import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function GET(req: NextRequest) {
  const subjectId = req.nextUrl.searchParams.get("subjectId") ?? "physics";
  const chapterId = req.nextUrl.searchParams.get("chapterId") ?? "ch1";
  const classId = req.nextUrl.searchParams.get("classId") ?? "11";
  const chapterName = req.nextUrl.searchParams.get("chapterName") ?? "";
  const subjectName = req.nextUrl.searchParams.get("subjectName") ?? subjectId;

  let wikiSummary = "";
  try {
    const searchTerm = encodeURIComponent(chapterName || `${subjectName} ${chapterId}`);
    const wikiRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`,
      { headers: { "User-Agent": "DCNextGen/1.0 (educational app)" } }
    );
    if (wikiRes.ok) {
      const wiki = await wikiRes.json();
      if (wiki.extract) wikiSummary = wiki.extract.slice(0, 400);
    }
  } catch {
    // Wikipedia is optional enrichment; ignore errors
  }

  const wikiNote = wikiSummary
    ? `\nReal-world context from Wikipedia: ${wikiSummary}\nUse this to enrich explanations where relevant.`
    : "";

  try {
    const prompt = `Create comprehensive NCERT-aligned study content for the chapter "${chapterName || chapterId}" in ${subjectName} Class ${classId} (CBSE curriculum).${wikiNote}

Return a JSON object only with this exact structure:
{
  "title": "chapter title",
  "subject": "${subjectName}",
  "classNum": ${classId},
  "icon": "one emoji",
  "color": "hex color for this subject",
  "summary": "2-3 sentence overview of the chapter",
  "topics": [
    {
      "title": "topic name",
      "content": "introductory paragraph (3-5 sentences)",
      "subsections": [
        { "heading": "subtopic heading", "body": "detailed explanation (3-5 sentences)" }
      ]
    }
  ],
  "formulas": [
    { "name": "formula name", "formula": "the formula", "description": "what it calculates", "variables": ["var: meaning"] }
  ],
  "vocabulary": [
    { "word": "term", "meaning": "definition", "usage": "example sentence" }
  ],
  "importantPoints": ["key point 1", "key point 2"],
  "examTips": ["tip 1", "tip 2"],
  "commonMistakes": ["mistake 1", "mistake 2"]
}

Include 3-5 topics with 2-3 subsections each. Include formulas only if the subject uses them (Physics, Chemistry, Maths). Include vocabulary only for languages/humanities. 6-10 important points, 4-6 exam tips, 3-5 common mistakes.
Return ONLY the JSON object, no markdown.`;

    const text = await callGemini(prompt);
    const content = JSON.parse(text);

    return NextResponse.json({ success: true, data: content });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err), data: null },
      { status: 500 }
    );
  }
}
