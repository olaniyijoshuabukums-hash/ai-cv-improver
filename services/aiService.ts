import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CompletionOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function generateCompletion(
  options: CompletionOptions
): Promise<string> {
  const {
    systemPrompt,
    userPrompt,
    model = "gpt-4.1",
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  const response = await openai.chat.completions.create({
    model,
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from AI");

  return content;
}

export async function improveCV(bullet: string, jobContext?: string): Promise<{
  improved: string;
  reason: string;
}> {
  const contextNote = jobContext
    ? `\nContext: Tailor this bullet for a role with the following description:\n${jobContext}`
    : "";

  const result = await generateCompletion({
    systemPrompt: `You are a senior CV writer and career coach who specialises in writing high-impact, achievement-focused bullet points. Always respond with valid JSON.`,
    userPrompt: `Rewrite the following CV bullet point to be more impactful and professional.

Rules:
- MUST start with a strong past-tense action verb (e.g. "Designed", "Led", "Delivered", "Built", "Managed", "Launched", "Reduced", "Increased", "Produced", "Coordinated", "Developed", "Implemented", "Streamlined", "Generated")
- Add measurable impact where plausible — use realistic numbers, sizes, or timeframes (e.g. "50+ clients", "team of 6", "within 2 weeks"). Do NOT invent specific percentages or revenue figures.
- Improve specificity and clarity
- Keep to 20–30 words
- Do not start with "I" or use first person${contextNote}

Bullet: "${bullet}"

Respond with JSON: { "improved": "...", "reason": "one sentence explaining the key improvement" }`,
    maxTokens: 300,
  });

  return JSON.parse(result);
}

export async function analyzeJobDescription(
  jobDescription: string
): Promise<{
  skills: string[];
  keywords: string[];
  responsibilities: string[];
}> {
  const result = await generateCompletion({
    systemPrompt: `You are an expert job analyst. Extract structured information from job descriptions. Always respond with valid JSON.`,
    userPrompt: `Analyze the following job description and extract:
1. Required and preferred skills
2. Important keywords for ATS optimization
3. Key responsibilities

Job Description:
${jobDescription}

Respond with JSON: { "skills": [...], "keywords": [...], "responsibilities": [...] }`,
    maxTokens: 800,
  });

  return JSON.parse(result);
}

export async function generateCoverLetter(params: {
  cvText: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
}): Promise<string> {
  const result = await generateCompletion({
    systemPrompt: `You are a professional career coach who writes compelling, personalized cover letters. Always respond with valid JSON.`,
    userPrompt: `Generate a personalized cover letter for the following candidate.

Candidate's CV:
${params.cvText}

Job Title: ${params.jobTitle}
Company: ${params.companyName}
Job Description:
${params.jobDescription}

Requirements:
- Professional tone
- 200–350 words
- Highlight the candidate's most relevant achievements
- Reference the company name naturally
- Do not repeat the CV verbatim — synthesize and connect experience to the role

Respond with JSON: { "coverLetter": "..." }`,
    maxTokens: 1000,
    temperature: 0.8,
  });

  const parsed = JSON.parse(result);
  return parsed.coverLetter;
}
