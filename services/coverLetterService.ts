import { CoverLetter } from "@/types";
import { generateCoverLetter } from "./aiService";

export async function createCoverLetter(params: {
  cvText: string;
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
}): Promise<CoverLetter> {
  const content = await generateCoverLetter({
    cvText: params.cvText,
    jobDescription: params.jobDescription,
    jobTitle: params.jobTitle ?? "",
    companyName: params.companyName ?? "",
  });

  return {
    content,
    jobTitle: params.jobTitle ?? "",
    companyName: params.companyName ?? "",
  };
}
