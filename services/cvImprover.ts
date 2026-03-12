import { ParsedCV, ImprovedCV, ImprovedWorkExperience } from "@/types";
import { improveCV as improveBullet } from "./aiService";

// Section titles that aren't professional work experience and should be excluded
const NON_PROFESSIONAL_SECTIONS = [
  "hobbies",
  "interests",
  "declaration",
  "referee",
  "references",
  "personal statement",
  "personal profile",
  "activities",
  "volunteer",
  "church",
  "pastor",
];

function isProfessionalExperience(role: string): boolean {
  const lower = role.toLowerCase().trim();
  return !NON_PROFESSIONAL_SECTIONS.some((s) => lower.includes(s));
}

export async function improveCV(
  parsedCV: ParsedCV,
  jobContext?: string
): Promise<ImprovedCV> {
  const professionalExperience = parsedCV.experience.filter((job) =>
    isProfessionalExperience(job.role)
  );

  const improvedExperience: ImprovedWorkExperience[] = await Promise.all(
    professionalExperience.map(async (job) => {
      const improvedBullets = await Promise.all(
        job.bullets.map(async (bullet) => {
          try {
            const result = await improveBullet(bullet, jobContext);
            return {
              original: bullet,
              improved: result.improved,
              reason: result.reason,
            };
          } catch {
            return {
              original: bullet,
              improved: bullet,
              reason: "Could not improve this bullet",
            };
          }
        })
      );

      return {
        role: job.role,
        company: job.company,
        duration: job.duration,
        bullets: improvedBullets,
      };
    })
  );

  return {
    name: parsedCV.name,
    email: parsedCV.email,
    phone: parsedCV.phone,
    summary: parsedCV.summary,
    experience: improvedExperience,
    education: parsedCV.education,
    skills: parsedCV.skills,
  };
}
