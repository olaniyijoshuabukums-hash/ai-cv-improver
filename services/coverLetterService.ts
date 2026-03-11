import { CoverLetter } from "@/types";
import { generateCoverLetter } from "./aiService";

export async function createCoverLetter(params: {
  cvText: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
}): Promise<CoverLetter> {
  const content = await generateCoverLetter(params);

  return {
    content,
    jobTitle: params.jobTitle,
    companyName: params.companyName,
  };
}
