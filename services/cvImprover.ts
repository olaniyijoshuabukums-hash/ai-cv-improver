import { ParsedCV, ImprovedCV, ImprovedWorkExperience } from "@/types";
import { improveCV as improveBullet } from "./aiService";

export async function improveCV(
  parsedCV: ParsedCV,
  jobContext?: string
): Promise<ImprovedCV> {
  const improvedExperience: ImprovedWorkExperience[] = await Promise.all(
    parsedCV.experience.map(async (job) => {
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
