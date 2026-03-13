import { NextRequest, NextResponse } from "next/server";
import { createCoverLetter } from "@/services/coverLetterService";
import { GenerateCoverLetterRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateCoverLetterRequest = await req.json();
    const { cvText, jobDescription, jobTitle, companyName } = body;

    if (!cvText || !jobDescription) {
      return NextResponse.json(
        { error: "cvText and jobDescription are required" },
        { status: 400 }
      );
    }

    const coverLetter = await createCoverLetter({
      cvText,
      jobDescription,
      jobTitle,
      companyName,
    });

    return NextResponse.json({ success: true, coverLetter });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter. Please try again." },
      { status: 500 }
    );
  }
}
