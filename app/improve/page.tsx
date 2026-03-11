"use client";

import { useState } from "react";
import CVUploader from "@/components/CVUploader";
import JobDescriptionInput, { JobDetails } from "@/components/JobDescriptionInput";
import CVImprovementPanel from "@/components/CVImprovementPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParsedCV, ImprovedCV } from "@/types";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";

export default function ImprovePage() {
  const [parsedCV, setParsedCV] = useState<ParsedCV | null>(null);
  const [improvedCV, setImprovedCV] = useState<ImprovedCV | null>(null);
  const [isImproving, setIsImproving] = useState(false);

  async function handleImprove(jobDetails?: JobDetails) {
    if (!parsedCV) return;
    setIsImproving(true);

    try {
      const result = await apiClient.improveCV({
        parsedCV,
        jobDescription: jobDetails?.jobDescription,
      });

      if (result.success && result.improvedCV) {
        setImprovedCV(result.improvedCV);
        toast.success("CV improved successfully!");
      } else {
        toast.error(result.error || "Failed to improve CV");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to improve CV");
    } finally {
      setIsImproving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Improve Your CV</h1>
        <p className="text-muted-foreground mt-1">
          Upload your CV, optionally add a job description for tailoring, then
          let AI improve your bullet points.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Step 1: Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Upload Your CV</CardTitle>
          </CardHeader>
          <CardContent>
            <CVUploader onUploadSuccess={setParsedCV} />
            {parsedCV && (
              <div className="mt-3 text-sm text-green-600">
                Parsed: {parsedCV.experience.length} roles,{" "}
                {parsedCV.skills.length} skills detected
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Job description (optional) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              2. Add Job Description{" "}
              <span className="text-muted-foreground font-normal text-sm">
                (optional — for tailoring)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <JobDescriptionInput
              onSubmit={handleImprove}
              isLoading={isImproving || !parsedCV}
              submitLabel={
                !parsedCV
                  ? "Upload CV first"
                  : isImproving
                  ? "Improving..."
                  : "Improve CV with Job Context"
              }
            />
            {parsedCV && !isImproving && (
              <button
                className="mt-3 text-sm text-primary underline"
                onClick={() => handleImprove()}
              >
                Or improve without job description
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {improvedCV && (
        <Card>
          <CardHeader>
            <CardTitle>Improved CV</CardTitle>
          </CardHeader>
          <CardContent>
            <CVImprovementPanel improvedCV={improvedCV} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
