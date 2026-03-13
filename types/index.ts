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

export interface ImprovedWorkExperience {
  title: string;
  company: string;
  location?: string;
  period: string;
  bullets: string[];
}

export interface ImprovedCV {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience: ImprovedWorkExperience[];
  skills: string[];
  education: Education[];
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
  jobTitle?: string;
  companyName?: string;
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
  jobTitle?: string;
  companyName?: string;
}

export interface GenerateCoverLetterResponse {
  success: boolean;
  coverLetter?: CoverLetter;
  error?: string;
}

// Used by cover letter export (plain text content)
export interface ExportRequest {
  content: string;
  format: "pdf" | "docx";
  filename: string;
}

// Used by CV export (structured JSON)
export interface CVExportRequest {
  cv: ImprovedCV;
  format: "pdf" | "docx";
  filename: string;
}
