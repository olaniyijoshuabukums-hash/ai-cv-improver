import { NextRequest, NextResponse } from "next/server";
import { exportToPDF, exportToDOCX } from "@/services/exportService";
import { ExportRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: ExportRequest = await req.json();
    const { content, format, filename } = body;

    if (!content || !format) {
      return NextResponse.json(
        { error: "Content and format are required" },
        { status: 400 }
      );
    }

    if (format === "pdf") {
      const buffer = await exportToPDF(content);
      return new NextResponse(buffer.buffer as ArrayBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename || "document"}.pdf"`,
        },
      });
    }

    if (format === "docx") {
      const buffer = await exportToDOCX(content);
      return new NextResponse(buffer.buffer as ArrayBuffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${filename || "document"}.docx"`,
        },
      });
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
  } catch (error) {
    console.error("Error exporting document:", error);
    return NextResponse.json(
      { error: "Failed to export document. Please try again." },
      { status: 500 }
    );
  }
}
