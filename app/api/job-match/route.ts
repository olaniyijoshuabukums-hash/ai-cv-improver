import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/services/aiService";
import { JobMatchResponse } from "@/types";

export async function POST(req: NextRequest): Promise<NextResponse<JobMatchResponse>> {
  try {
    const { cvText, jobDescription } = await req.json();

    if (!cvText || !jobDescription) {
      return NextResponse.json({ success: false, error: "CV text and job description are required" }, { status: 400 });
    }

    const raw = await generateCompletion({
      model: "claude-haiku-4-5",
      systemPrompt: "You are a career coach and recruiter. Analyse the match between a CV and job description objectively. Always respond with valid JSON, no markdown, no explanation.",
      userPrompt: `Score the match between this CV and job description.
Return ONLY valid JSON, no markdown, no explanation.
Provide EXACTLY 2 strengths and EXACTLY 2 gaps — no more, no fewer:
{
  "score": <number 0-100>,
  "label": <"Weak Match" | "Fair Match" | "Good Match" | "Strong Match">,
  "strengths": ["<one sentence>", "<one sentence>"],
  "gaps": ["<one sentence>", "<one sentence>"],
  "tip": "<one actionable sentence to improve the match>"
}

CV:
${cvText}

Job Description:
${jobDescription}`,
      maxTokens: 1024,
    });

    const jobMatch = JSON.parse(raw);

    return NextResponse.json({ success: true, jobMatch });
  } catch (err) {
    console.error("Job match error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to score job match" },
      { status: 500 }
    );
  }
}
