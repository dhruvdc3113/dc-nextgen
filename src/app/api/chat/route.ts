import { NextRequest, NextResponse } from "next/server";
import { callGeminiText } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { message, userClass, subjects } = await req.json() as {
    message: string;
    userClass?: number;
    subjects?: { name: string }[];
  };

  const subjectList = subjects?.map(s => s.name).join(", ") || "all subjects";
  const cls = userClass ?? 11;

  const prompt = `You are ARIA, an enthusiastic AI tutor for DC NextGen, India's AI-powered education platform for Classes 1–12.

Student: Class ${cls}, studying: ${subjectList}
Student message: "${message}"

Reply rules:
- Maximum 3 sentences, plain text only (no markdown, no bullet points, no asterisks)
- Be specific to the NCERT curriculum for Class ${cls}
- If they ask about a topic, give a brief clear explanation + one actionable tip
- Sound warm and encouraging, like a knowledgeable friend
- If they mention a subject, reference actual NCERT chapters or concepts
- End with a question or forward-looking statement to keep them engaged

Reply:`;

  try {
    const reply = await callGeminiText(prompt);
    return NextResponse.json({ success: true, reply: reply.trim() });
  } catch {
    return NextResponse.json({
      success: true,
      reply: "I'm having a quick think! Try asking me again — I'm best at NCERT concepts, problem-solving strategies, and exam tips for Class " + cls + ".",
    });
  }
}
