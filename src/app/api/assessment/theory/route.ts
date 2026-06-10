import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

const DIFFICULTY_LABELS: Record<string, string> = {
  explorer: "Foundation / Easy (CBSE basic recall)",
  scholar:  "Intermediate (CBSE standard application)",
  master:   "Advanced (CBSE Higher Order Thinking)",
  brain:    "Expert (Board exam full pattern)",
  titan:    "Championship (JEE / NEET standard)",
  legend:   "Ultimate (Olympiad / unseen complex)",
};

export async function GET(req: NextRequest) {
  const p           = new URL(req.url).searchParams;
  const subjectId   = p.get("subjectId")   ?? "physics";
  const classId     = p.get("classId")     ?? "11";
  const difficulty  = p.get("difficulty")  ?? "scholar";
  const chapterName = p.get("chapterName") ?? "";
  const subjectName = p.get("subjectName") ?? subjectId;

  const diffLabel = DIFFICULTY_LABELS[difficulty] ?? "Standard level";
  const topic     = chapterName || `${subjectName} — Class ${classId} core concepts`;

  const prompt = `You are an expert CBSE question-paper setter for Class ${classId} ${subjectName}.
Create a full theory exam paper on: "${topic}"
Difficulty: ${diffLabel}

Return ONLY valid JSON (no markdown, no backticks) with this exact schema:
{
  "title": "Theory Test — <chapter name>",
  "duration": 150,
  "marks": 80,
  "sections": [
    {
      "name": "Section A — Very Short Answer (1 Mark each)",
      "instructions": "Answer all questions. Each question carries 1 mark.",
      "questions": [
        { "no": 1, "marks": 1, "text": "<question>" },
        { "no": 2, "marks": 1, "text": "<question>" },
        { "no": 3, "marks": 1, "text": "<question>" },
        { "no": 4, "marks": 1, "text": "<question>" },
        { "no": 5, "marks": 1, "text": "<question>" },
        { "no": 6, "marks": 1, "text": "<question>" },
        { "no": 7, "marks": 1, "text": "<question>" },
        { "no": 8, "marks": 1, "text": "<question>" }
      ]
    },
    {
      "name": "Section B — Short Answer (2 Marks each)",
      "instructions": "Answer any 8 out of 10 questions. Each carries 2 marks.",
      "questions": [
        { "no": 9,  "marks": 2, "text": "<question>" },
        { "no": 10, "marks": 2, "text": "<question>" },
        { "no": 11, "marks": 2, "text": "<question>" },
        { "no": 12, "marks": 2, "text": "<question>" },
        { "no": 13, "marks": 2, "text": "<question>" },
        { "no": 14, "marks": 2, "text": "<question>" },
        { "no": 15, "marks": 2, "text": "<question>" },
        { "no": 16, "marks": 2, "text": "<question>" },
        { "no": 17, "marks": 2, "text": "<question>" },
        { "no": 18, "marks": 2, "text": "<question>" }
      ]
    },
    {
      "name": "Section C — Long Answer (5 Marks each)",
      "instructions": "Answer any 4 out of 5 questions. Each carries 5 marks.",
      "questions": [
        { "no": 19, "marks": 5, "text": "<question requiring derivation/proof/detailed explanation>" },
        { "no": 20, "marks": 5, "text": "<question>" },
        { "no": 21, "marks": 5, "text": "<question>" },
        { "no": 22, "marks": 5, "text": "<question>" },
        { "no": 23, "marks": 5, "text": "<question>" }
      ]
    },
    {
      "name": "Section D — Case Study (4 Marks)",
      "instructions": "Read the passage carefully and answer all parts (a)(b)(c)(d). Each sub-part carries 1 mark.",
      "questions": [
        { "no": 24, "marks": 4, "text": "<2-3 sentence real-world scenario related to the chapter>\\n\\n(a) <1-mark question>\\n(b) <1-mark question>\\n(c) <1-mark question>\\n(d) <1-mark question>" }
      ]
    }
  ],
  "answerKey": [
    { "no": 1,  "marks": 1, "answer": "<model answer>" },
    { "no": 2,  "marks": 1, "answer": "<model answer>" },
    { "no": 3,  "marks": 1, "answer": "<model answer>" },
    { "no": 4,  "marks": 1, "answer": "<model answer>" },
    { "no": 5,  "marks": 1, "answer": "<model answer>" },
    { "no": 6,  "marks": 1, "answer": "<model answer>" },
    { "no": 7,  "marks": 1, "answer": "<model answer>" },
    { "no": 8,  "marks": 1, "answer": "<model answer>" },
    { "no": 9,  "marks": 2, "answer": "<model answer>" },
    { "no": 10, "marks": 2, "answer": "<model answer>" },
    { "no": 11, "marks": 2, "answer": "<model answer>" },
    { "no": 12, "marks": 2, "answer": "<model answer>" },
    { "no": 13, "marks": 2, "answer": "<model answer>" },
    { "no": 14, "marks": 2, "answer": "<model answer>" },
    { "no": 15, "marks": 2, "answer": "<model answer>" },
    { "no": 16, "marks": 2, "answer": "<model answer>" },
    { "no": 17, "marks": 2, "answer": "<model answer>" },
    { "no": 18, "marks": 2, "answer": "<model answer>" },
    { "no": 19, "marks": 5, "answer": "<full model answer with steps>" },
    { "no": 20, "marks": 5, "answer": "<full model answer>" },
    { "no": 21, "marks": 5, "answer": "<full model answer>" },
    { "no": 22, "marks": 5, "answer": "<full model answer>" },
    { "no": 23, "marks": 5, "answer": "<full model answer>" },
    { "no": 24, "marks": 4, "answer": "(a) <answer> (b) <answer> (c) <answer> (d) <answer>" }
  ]
}

Important:
- Make all questions specific to "${topic}" — no generic placeholders
- Section A: definitions, SI units, one-liners, fill-in-the-blank style
- Section B: 2-step explanations, small numericals, comparisons
- Section C: full derivations, proofs, long explanations with diagrams instructions
- Section D: a real-world scenario with 4 conceptual sub-questions
- Answer key must be detailed enough to self-evaluate`;

  try {
    const raw = await callGemini(prompt);
    let paper: unknown;
    try {
      paper = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("No JSON in Gemini response");
      paper = JSON.parse(m[0]);
    }
    return NextResponse.json({ success: true, data: paper });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
