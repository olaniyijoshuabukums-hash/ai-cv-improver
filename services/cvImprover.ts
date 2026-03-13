import { ParsedCV, ImprovedCV } from "@/types";
import { generateCompletion } from "./aiService";

export async function improveCV(
  parsedCV: ParsedCV,
  jobTitle?: string,
  companyName?: string,
  jobDescription?: string
): Promise<ImprovedCV> {
  const result = await generateCompletion({
    model: "claude-sonnet-4-6",
    maxTokens: 4096,
    systemPrompt: `You are an expert CV writer and career coach. You transform weak, informal CVs into professional, ATS-optimised documents. You rewrite every bullet point using strong action verbs and quantified achievements. You remove unprofessional content entirely.`,
    userPrompt: `Improve this CV${jobTitle ? ` for the role of ${jobTitle}` : ""}${companyName ? ` at ${companyName}` : ""}.

CV CONTENT:
${parsedCV.rawText}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}` : ""}

Return ONLY a JSON object in this exact structure, no markdown, no explanation:
{
  "name": "Full Name",
  "email": "email",
  "phone": "phone",
  "summary": "2-3 sentence professional summary tailored to the role",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City",
      "period": "2013 – 2018",
      "bullets": [
        "Strong action verb + what you did + measurable result",
        "Strong action verb + what you did + measurable result",
        "Strong action verb + what you did + measurable result"
      ]
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School Name",
      "year": "2013"
    }
  ]
}

RULES:
- Rewrite ALL bullet points with action verbs (Designed, Produced, Led, Delivered, Managed, Created, Developed, Executed)
- Add realistic metrics where implied (e.g. "Designed flyers" → "Designed 50+ print materials including flyers, banners, and branded collateral for 20+ client accounts")
- Remove: Hobbies, Declaration, religious referees, "God-fearing", "I am still learning" type phrases
- Remove: "Hardworking and God-fearing" from skills
- The summary should be tailored to the specific job description provided
- Keep education factual, do not invent grades`,
  });

  return JSON.parse(result);
}
