export interface ParsedCV {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  rawText: string;
}

export interface WorkExperience {
  role: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface ImprovedBullet {
  original: string;
  improved: string;
  reason: string;
}

export interface ImprovedCV {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience: ImprovedWorkExperience[];
  education: Education[];
  skills: string[];
}

export interface ImprovedWorkExperience {
  role: string;
  company: string;
  duration: string;
  bullets: ImprovedBullet[];
}

export interface JobAnalysis {
  skills: string[];
  keywords: string[];
  responsibilities: string[];
  jobTitle?: string;
  companyName?: string;
}

export interface CoverLetter {
  content: string;
  jobTitle: string;
  companyName: string;
}

export interface CVUploadResponse {
  success: boolean;
  parsedCV?: ParsedCV;
  error?: string;
}

export interface ImproveCVRequest {
  parsedCV: ParsedCV;
  jobDescription?: string;
}

export interface ImproveCVResponse {
  success: boolean;
  improvedCV?: ImprovedCV;
  error?: string;
}

export interface GenerateCoverLetterRequest {
  cvText: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
}

export interface GenerateCoverLetterResponse {
  success: boolean;
  coverLetter?: CoverLetter;
  error?: string;
}

export interface ExportRequest {
  content: string;
  format: "pdf" | "docx";
  filename: string;
}
