"use client";

import { useState } from "react";
import CVUploader from "@/components/CVUploader";
import CoverLetterPanel from "@/components/CoverLetterPanel";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ParsedCV, CoverLetter } from "@/types";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { FileText } from "lucide-react";

export default function CoverLetterPage() {
  const [parsedCV, setParsedCV] = useState<ParsedCV | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  async function handleGenerate() {
    if (!parsedCV) return;
    setIsGenerating(true);

    try {
      const result = await apiClient.generateCoverLetter({
        cvText: parsedCV.rawText,
        jobDescription: jobDescription.trim(),
        jobTitle: jobTitle.trim() || undefined,
        companyName: companyName.trim() || undefined,
      });

      if (result.success && result.coverLetter) {
        setCoverLetter(result.coverLetter);
        toast.success("Cover letter generated!");
      } else {
        toast.error(result.error || "Failed to generate cover letter");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate cover letter");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleRegenerate() {
    await handleGenerate();
  }

  const canSubmit = !!parsedCV && jobDescription.trim().length > 0 && !isGenerating;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Generate Cover Letter</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Upload your CV, paste the job description, and let AI write a
          personalized cover letter for you.
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* ── Left panel ── */}
        <div className="w-full md:w-2/5 md:sticky md:top-[72px] md:max-h-[calc(100vh-88px)] md:overflow-y-auto space-y-4">

          {/* Card: Upload + job details */}
          <div className="bg-white border border-border rounded-xl p-5 space-y-6">

            {/* 1. Upload */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                Step 1
              </p>
              <h2 className="text-sm font-semibold">Upload Your CV</h2>
              <CVUploader onUploadSuccess={setParsedCV} />
              {parsedCV && (
                <p className="text-xs text-emerald-700 font-medium">
                  ✓ CV ready · {parsedCV.experience.length} roles detected
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* 2. Job details */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                  Step 2
                </p>
                <h2 className="text-sm font-semibold mt-0.5">Enter Job Details</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="jobTitle" className="text-xs">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Product Manager"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-xs">Company</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g. Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="jobDescription" className="text-xs">
                  Job Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description here — the AI will tailor your cover letter to this role..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="resize-none"
                  style={{ minHeight: "300px" }}
                />
              </div>
            </div>
          </div>

          {/* 3. Action button */}
          <Button
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="w-full h-11 text-sm font-medium"
          >
            {!parsedCV
              ? "Upload CV first"
              : !jobDescription.trim()
              ? "Add a job description"
              : isGenerating
              ? "Generating your cover letter…"
              : "Generate Cover Letter"}
          </Button>
        </div>

        {/* ── Right panel ── */}
        <div className="w-full md:w-3/5 min-h-[500px]">

          {/* Empty state */}
          {!isGenerating && !coverLetter && (
            <div className="flex flex-col items-center justify-center h-full min-h-[480px] text-center rounded-xl border-2 border-dashed border-border p-12">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Your cover letter will appear here</p>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">
                Upload your CV, add the job description, and click{" "}
                <span className="font-medium">Generate Cover Letter</span> to get started
              </p>
            </div>
          )}

          {/* Loading skeleton */}
          {isGenerating && (
            <div className="bg-white rounded-xl border border-border shadow-sm px-10 py-12 space-y-5">
              <p className="text-sm font-medium text-muted-foreground animate-pulse">
                Writing your cover letter…
              </p>
              <div className="space-y-3 animate-pulse">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="h-3 bg-muted rounded w-4/5" />
                <div className="h-3 bg-muted rounded w-full mt-6" />
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="h-3 bg-muted rounded w-4/5" />
                <div className="h-3 bg-muted rounded w-full mt-6" />
                <div className="h-3 bg-muted rounded w-4/6" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          )}

          {/* Results */}
          {coverLetter && !isGenerating && (
            <CoverLetterPanel
              coverLetter={coverLetter}
              onRegenerate={handleRegenerate}
              isRegenerating={isGenerating}
            />
          )}
        </div>
      </div>
    </div>
  );
}
