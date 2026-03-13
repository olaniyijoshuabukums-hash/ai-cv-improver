import { ImprovedCV } from "@/types";

// ─── PDF ────────────────────────────────────────────────────────────────────

export async function exportToPDF(cv: ImprovedCV): Promise<Buffer> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_W = 595;  // A4 pt
  const PAGE_H = 842;
  const MARGIN = 50;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const EMERALD = rgb(0.1, 0.47, 0.29);
  const DARK = rgb(0.08, 0.08, 0.08);
  const MUTED = rgb(0.4, 0.4, 0.4);

  let page = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  function ensureSpace(needed: number) {
    if (y - needed < MARGIN) {
      page = doc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
  }

  function drawLine(text: string, opts: {
    bold?: boolean;
    size?: number;
    color?: ReturnType<typeof rgb>;
    indent?: number;
    lineGap?: number;
  } = {}) {
    const { bold = false, size = 11, color = DARK, indent = 0, lineGap = 4 } = opts;
    const f = bold ? boldFont : font;
    const words = text.split(" ");
    let line = "";
    const x = MARGIN + indent;
    const maxW = CONTENT_W - indent;

    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (f.widthOfTextAtSize(test, size) > maxW && line) {
        ensureSpace(size + lineGap);
        page.drawText(line, { x, y, size, font: f, color });
        y -= size + lineGap;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) {
      ensureSpace(size + lineGap);
      page.drawText(line, { x, y, size, font: f, color });
      y -= size + lineGap;
    }
  }

  function drawSectionHeading(title: string) {
    y -= 8;
    ensureSpace(22);
    page.drawText(title.toUpperCase(), {
      x: MARGIN, y, size: 8, font: boldFont, color: EMERALD,
    });
    y -= 12;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_W - MARGIN, y },
      thickness: 0.75,
      color: EMERALD,
    });
    y -= 10;
  }

  // ── Header ──
  if (cv.name) {
    drawLine(cv.name, { bold: true, size: 20, lineGap: 6 });
  }
  const contact = [cv.email, cv.phone].filter(Boolean).join("  |  ");
  if (contact) {
    drawLine(contact, { size: 10, color: MUTED, lineGap: 4 });
  }
  y -= 6;
  // Header rule
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_W - MARGIN, y },
    thickness: 1,
    color: rgb(0.87, 0.87, 0.87),
  });
  y -= 12;

  // ── Summary ──
  if (cv.summary) {
    drawSectionHeading("Professional Summary");
    drawLine(cv.summary, { size: 10, color: MUTED, lineGap: 5 });
    y -= 4;
  }

  // ── Experience ──
  if (cv.experience.length > 0) {
    drawSectionHeading("Experience");
    for (const job of cv.experience) {
      ensureSpace(30);
      // Role title
      drawLine(job.title, { bold: true, size: 11, lineGap: 3 });
      // Company / location / period
      const sub = [job.company, job.location].filter(Boolean).join(", ");
      const subLine = [sub, job.period].filter(Boolean).join("  ·  ");
      if (subLine) {
        drawLine(subLine, { size: 10, color: MUTED, lineGap: 4 });
      }
      // Bullets
      for (const bullet of job.bullets) {
        drawLine(`• ${bullet}`, { size: 10, indent: 10, lineGap: 4 });
      }
      y -= 8;
    }
  }

  // ── Skills ──
  if (cv.skills.length > 0) {
    drawSectionHeading("Skills");
    drawLine(cv.skills.join("  ·  "), { size: 10, color: MUTED, lineGap: 5 });
    y -= 4;
  }

  // ── Education ──
  if (cv.education.length > 0) {
    drawSectionHeading("Education");
    for (const edu of cv.education) {
      const line = [edu.degree, edu.institution].filter(Boolean).join(" — ");
      const withYear = edu.year ? `${line}  (${edu.year})` : line;
      drawLine(withYear, { size: 10, lineGap: 5 });
    }
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

// ─── DOCX ────────────────────────────────────────────────────────────────────

export async function exportToDOCX(cv: ImprovedCV): Promise<Buffer> {
  const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } =
    await import("docx");

  const EMERALD_HEX = "1A7A4A";

  function sectionHeading(title: string) {
    return new Paragraph({
      spacing: { before: 240, after: 80 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 4, color: EMERALD_HEX, space: 4 },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 18,
          color: EMERALD_HEX,
          characterSpacing: 40,
        }),
      ],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];

  // ── Header ──
  if (cv.name) {
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: cv.name, bold: true, size: 40 })],
      })
    );
  }
  const contact = [cv.email, cv.phone].filter(Boolean).join("  |  ");
  if (contact) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: contact, size: 20, color: "666666" })],
      })
    );
  }

  // ── Summary ──
  if (cv.summary) {
    children.push(sectionHeading("Professional Summary"));
    children.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: cv.summary, size: 20, italics: true, color: "444444" })],
      })
    );
  }

  // ── Experience ──
  if (cv.experience.length > 0) {
    children.push(sectionHeading("Experience"));
    for (const job of cv.experience) {
      // Role title
      children.push(
        new Paragraph({
          spacing: { before: 160, after: 40 },
          children: [
            new TextRun({ text: job.title, bold: true, size: 22 }),
            ...(job.company
              ? [new TextRun({ text: `  —  ${job.company}`, size: 22, color: "555555" })]
              : []),
          ],
        })
      );
      // Location / period
      const sub = [job.location, job.period].filter(Boolean).join("  ·  ");
      if (sub) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [new TextRun({ text: sub, size: 18, color: "777777" })],
          })
        );
      }
      // Bullets
      for (const bullet of job.bullets) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            indent: { left: 360 },
            children: [new TextRun({ text: `• ${bullet}`, size: 20 })],
          })
        );
      }
    }
  }

  // ── Skills ──
  if (cv.skills.length > 0) {
    children.push(sectionHeading("Skills"));
    children.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: cv.skills.join("  ·  "), size: 20, color: "444444" }),
        ],
      })
    );
  }

  // ── Education ──
  if (cv.education.length > 0) {
    children.push(sectionHeading("Education"));
    for (const edu of cv.education) {
      const degreeText = [edu.degree, edu.institution].filter(Boolean).join(" — ");
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: degreeText, size: 20 }),
            ...(edu.year
              ? [new TextRun({ text: `  (${edu.year})`, size: 20, color: "777777" })]
              : []),
          ],
        })
      );
    }
  }

  const docx = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(docx);
  return buffer;
}

// ─── Cover letter exports (plain text) ──────────────────────────────────────

export async function exportCoverLetterToPDF(content: string): Promise<Buffer> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let page = doc.addPage([595, 842]);
  const margin = 60;
  const maxWidth = 595 - margin * 2;
  let y = 842 - margin;

  const lines = content.split("\n");
  for (const rawLine of lines) {
    const words = rawLine.split(" ");
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, 11) > maxWidth && line) {
        if (y < margin) { page = doc.addPage([595, 842]); y = 842 - margin; }
        page.drawText(line, { x: margin, y, size: 11, font, color: rgb(0.08, 0.08, 0.08) });
        y -= 16;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) {
      if (y < margin) { page = doc.addPage([595, 842]); y = 842 - margin; }
      page.drawText(line, { x: margin, y, size: 11, font, color: rgb(0.08, 0.08, 0.08) });
    }
    y -= 16;
  }

  return Buffer.from(await doc.save());
}

export async function exportCoverLetterToDOCX(content: string): Promise<Buffer> {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  const paragraphs = content.split("\n").map(
    (text) => new Paragraph({ children: [new TextRun({ text, size: 22 })], spacing: { after: 160 } })
  );

  const docx = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });
  return Packer.toBuffer(docx);
}
