import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface CompletionOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  maxTokens?: number;
}

export async function generateCompletion(
  options: CompletionOptions
): Promise<string> {
  const {
    systemPrompt,
    userPrompt,
    model = "claude-haiku-4-5",
    maxTokens = 4096,
  } = options;

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  for (const block of response.content) {
    if (block.type === "text") {
      return block.text;
    }
  }

  throw new Error("No text content in AI response");
}

export async function improveCV(
  bullet: string,
  jobContext?: string
): Promise<{ improved: string; reason: string }> {
  const contextNote = jobContext
    ? `\nContext: Tailor this bullet for a role with the following description:\n${jobContext}`
    : "";

  const result = await generateCompletion({
    model: "claude-haiku-4-5",
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
    maxTokens: 1024,
  });

  return JSON.parse(result);
}

export async function analyzeJobDescription(jobDescription: string): Promise<{
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
    maxTokens: 2048,
  });

  return JSON.parse(result);
}

export async function generateCoverLetter(params: {
  cvText: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
}): Promise<string> {
  const jobContext = [
    params.jobTitle && `Job Title: ${params.jobTitle}`,
    params.companyName && `Company: ${params.companyName}`,
  ]
    .filter(Boolean)
    .join("\n");

  const result = await generateCompletion({
    model: "claude-sonnet-4-6",
    systemPrompt: `You are a professional cover letter writer who creates compelling, personalized cover letters. Always respond with valid JSON.`,
    userPrompt: `Write a compelling, personalized cover letter for the candidate below.

Candidate CV:
${params.cvText}

${jobContext}
Job Description:
${params.jobDescription}

Instructions:
- Structure as exactly 4 paragraphs separated by blank lines:
  1. Opening: a strong hook that names the role and shows genuine enthusiasm — do NOT start with "I am writing to apply" or any variation of it
  2. Body paragraph 1: highlight the candidate's most relevant experience and achievements from their CV, connecting them directly to the role requirements
  3. Body paragraph 2: match specific skills to the job description and convey authentic enthusiasm for the company/role
  4. Closing: confident call to action expressing eagerness to discuss further
- Tone: professional but warm — avoid stiff corporate language
- Length: 250–350 words across the 4 paragraphs
- Reference the company name naturally if provided
- Do not repeat the CV verbatim — synthesize and connect experience to the role

Respond with JSON: { "coverLetter": "..." }`,
    maxTokens: 2048,
  });

  const parsed = JSON.parse(result);
  return parsed.coverLetter;
}
