export async function exportToPDF(content: string): Promise<Buffer> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const page = doc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const margin = 50;
  const maxWidth = width - margin * 2;
  let y = height - margin;

  const lineHeight = 16;
  const fontSize = 11;

  function drawText(
    text: string,
    options: { bold?: boolean; size?: number; color?: [number, number, number] } = {}
  ) {
    const { bold = false, size = fontSize, color = [0, 0, 0] } = options;
    const selectedFont = bold ? boldFont : font;

    // Word wrap
    const words = text.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = selectedFont.widthOfTextAtSize(testLine, size);

      if (testWidth > maxWidth && line) {
        page.drawText(line, {
          x: margin,
          y,
          size,
          font: selectedFont,
          color: rgb(color[0], color[1], color[2]),
        });
        y -= lineHeight;
        line = word;

        if (y < margin) {
          doc.addPage([595, 842]);
          y = height - margin;
        }
      } else {
        line = testLine;
      }
    }

    if (line) {
      page.drawText(line, {
        x: margin,
        y,
        size,
        font: selectedFont,
        color: rgb(color[0], color[1], color[2]),
      });
      y -= lineHeight;
    }
  }

  const paragraphs = content.split("\n").filter((p) => p.trim());
  for (const paragraph of paragraphs) {
    drawText(paragraph);
    y -= 4; // paragraph spacing
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

export async function exportToDOCX(content: string): Promise<Buffer> {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  const paragraphs = content.split("\n").filter((p) => p.trim());

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.map(
          (text) =>
            new Paragraph({
              children: [new TextRun({ text, size: 24 })],
              spacing: { after: 120 },
            })
        ),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
