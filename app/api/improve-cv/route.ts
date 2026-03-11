import { NextRequest, NextResponse } from "next/server";
import { improveCV } from "@/services/cvImprover";
import { ImproveCVRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: ImproveCVRequest = await req.json();

    if (!body.parsedCV) {
      return NextResponse.json({ error: "Parsed CV is required" }, { status: 400 });
    }

    const improvedCV = await improveCV(body.parsedCV, body.jobDescription);

    return NextResponse.json({ success: true, improvedCV });
  } catch (error) {
    console.error("Error improving CV:", error);
    return NextResponse.json(
      { error: "Failed to improve CV. Please try again." },
      { status: 500 }
    );
  }
}
