"use client";

import { useState } from "react";
import CVUploader from "@/components/CVUploader";
import JobDescriptionInput, { JobDetails } from "@/components/JobDescriptionInput";
import CoverLetterPanel from "@/components/CoverLetterPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParsedCV, CoverLetter } from "@/types";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";

export default function CoverLetterPage() {
  const [parsedCV, setParsedCV] = useState<ParsedCV | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastJobDetails, setLastJobDetails] = useState<JobDetails | null>(null);

  async function handleGenerate(jobDetails: JobDetails) {
    if (!parsedCV) {
      toast.error("Please upload your CV first");
      return;
    }

    setLastJobDetails(jobDetails);
    setIsGenerating(true);

    try {
      const result = await apiClient.generateCoverLetter({
        cvText: parsedCV.rawText,
        jobDescription: jobDetails.jobDescription,
        jobTitle: jobDetails.jobTitle,
        companyName: jobDetails.companyName,
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
    if (lastJobDetails) await handleGenerate(lastJobDetails);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Generate Cover Letter</h1>
        <p className="text-muted-foreground mt-1">
          Upload your CV and paste a job description — AI will write a
          personalized cover letter for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Step 1: Upload CV */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Upload Your CV</CardTitle>
          </CardHeader>
          <CardContent>
            <CVUploader onUploadSuccess={setParsedCV} />
            {parsedCV && (
              <p className="mt-2 text-sm text-green-600">CV ready</p>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Job details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Enter Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <JobDescriptionInput
              onSubmit={handleGenerate}
              isLoading={isGenerating || !parsedCV}
              submitLabel={
                !parsedCV
                  ? "Upload CV first"
                  : isGenerating
                  ? "Generating..."
                  : "Generate Cover Letter"
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Loading state */}
      {isGenerating && !coverLetter && (
        <div className="bg-white rounded-xl border border-border shadow-sm px-10 py-12 max-w-2xl space-y-4">
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Generating your cover letter…
          </p>
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-4/5" />
            <div className="h-3 bg-muted rounded w-full mt-4" />
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-full mt-4" />
            <div className="h-3 bg-muted rounded w-4/6" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
        </div>
      )}

      {/* Result */}
      {coverLetter && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Your Cover Letter</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Download, copy, or regenerate below.
            </p>
          </div>
          <CoverLetterPanel
            coverLetter={coverLetter}
            onRegenerate={handleRegenerate}
            isRegenerating={isGenerating}
          />
        </div>
      )}
    </div>
  );
}
