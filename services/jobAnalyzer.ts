import { JobAnalysis } from "@/types";
import { analyzeJobDescription } from "./aiService";

export async function analyzeJob(
  jobDescription: string,
  jobTitle?: string,
  companyName?: string
): Promise<JobAnalysis> {
  const analysis = await analyzeJobDescription(jobDescription);

  return {
    ...analysis,
    jobTitle,
    companyName,
  };
}
