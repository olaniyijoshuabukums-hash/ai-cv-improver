import { NextRequest, NextResponse } from "next/server";
import {
  exportToPDF,
  exportToDOCX,
  exportCoverLetterToPDF,
  exportCoverLetterToDOCX,
} from "@/services/exportService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { format, filename } = body;

    if (!format) {
      return NextResponse.json({ error: "Format is required" }, { status: 400 });
    }

    let buffer: Buffer;

    // Structured CV export
    if (body.cv) {
      buffer = format === "pdf"
        ? await exportToPDF(body.cv)
        : await exportToDOCX(body.cv);
    }
    // Plain text export (cover letter)
    else if (body.content) {
      buffer = format === "pdf"
        ? await exportCoverLetterToPDF(body.content)
        : await exportCoverLetterToDOCX(body.content);
    }
    else {
      return NextResponse.json({ error: "cv or content is required" }, { status: 400 });
    }

    const contentType =
      format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return new NextResponse(buffer.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename || "document"}.${format}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting document:", error);
    return NextResponse.json(
      { error: "Failed to export document. Please try again." },
      { status: 500 }
    );
  }
}
