import { ParsedCV, WorkExperience, Education } from "@/types";

export async function parseCV(
  buffer: Buffer,
  mimeType: string
): Promise<ParsedCV> {
  let rawText = "";

  if (mimeType === "application/pdf") {
    rawText = await parsePDF(buffer);
  } else if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    rawText = await parseDOCX(buffer);
  } else if (mimeType === "text/plain") {
    rawText = buffer.toString("utf-8");
  } else {
    throw new Error("Unsupported file type");
  }

  return extractStructure(rawText);
}

async function parsePDF(buffer: Buffer): Promise<string> {
  // pdf-parse exports differently across ESM/CJS — handle both
  const mod = await import("pdf-parse");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fn: (buf: Buffer) => Promise<{ text: string }> = (mod as any).default ?? mod;
  const data = await fn(buffer);
  return data.text;
}

async function parseDOCX(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function extractStructure(text: string): ParsedCV {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,})/);

  // Heuristic: first non-empty line is likely the candidate name
  const name = lines[0] || undefined;

  // Simple section detection — heuristic-based
  const experience: WorkExperience[] = [];
  const education: Education[] = [];
  const skills: string[] = [];

  let currentSection = "";
  let currentRole: WorkExperience | null = null;
  let currentEdu: Education | null = null;

  const sectionHeaders: Record<string, string> = {
    experience: "experience",
    "work experience": "experience",
    "professional experience": "experience",
    employment: "experience",
    education: "education",
    qualifications: "education",
    skills: "skills",
    "technical skills": "skills",
    "key skills": "skills",
    competencies: "skills",
  };

  for (const line of lines) {
    const lower = line.toLowerCase().replace(/[^a-z\s]/g, "").trim();

    if (sectionHeaders[lower] !== undefined) {
      if (currentRole) {
        experience.push(currentRole);
        currentRole = null;
      }
      if (currentEdu) {
        education.push(currentEdu);
        currentEdu = null;
      }
      currentSection = sectionHeaders[lower];
      continue;
    }

    if (currentSection === "experience") {
      // Lines starting with - or • are bullet points
      if (/^[-•*]/.test(line)) {
        const bullet = line.replace(/^[-•*]\s*/, "").trim();
        if (currentRole) currentRole.bullets.push(bullet);
      } else {
        // New role entry — push existing
        if (currentRole) experience.push(currentRole);
        currentRole = {
          role: line,
          company: "",
          duration: "",
          bullets: [],
        };
      }
    }

    if (currentSection === "education") {
      if (currentEdu) {
        education.push(currentEdu);
      }
      currentEdu = { degree: line, institution: "", year: "" };
    }

    if (currentSection === "skills") {
      const extracted = line
        .split(/[,|•·]/)
        .map((s) => s.trim())
        .filter(Boolean);
      skills.push(...extracted);
    }
  }

  if (currentRole) experience.push(currentRole);
  if (currentEdu) education.push(currentEdu);

  return {
    name,
    email: emailMatch?.[0],
    phone: phoneMatch?.[1]?.trim(),
    experience,
    education,
    skills,
    rawText: text,
  };
}
