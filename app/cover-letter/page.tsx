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

      {/* Result */}
      {coverLetter && (
        <Card>
          <CardContent className="pt-6">
            <CoverLetterPanel
              coverLetter={coverLetter}
              onRegenerate={handleRegenerate}
              isRegenerating={isGenerating}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
