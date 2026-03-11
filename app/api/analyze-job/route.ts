import { NextRequest, NextResponse } from "next/server";
import { analyzeJob } from "@/services/jobAnalyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobDescription, jobTitle, companyName } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeJob(jobDescription, jobTitle, companyName);

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Error analyzing job:", error);
    return NextResponse.json(
      { error: "Failed to analyze job description. Please try again." },
      { status: 500 }
    );
  }
}
