"use client";

import { useState } from "react";
import CVUploader from "@/components/CVUploader";
import CoverLetterPanel from "@/components/CoverLetterPanel";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
        toast.success("Your cover letter is ready!");
      } else {
        toast.error(result.error || "Something went wrong — please try again");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong — please try again");
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
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 8 }}>
          Cover Letter
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            fontWeight: 800,
            lineHeight: 1.1,
            color: "var(--color-text-primary)",
            margin: 0,
          }}
        >
          Write Your Cover Letter
        </h1>
        <p style={{ fontSize: 16, color: "var(--color-text-secondary)", marginTop: 8, maxWidth: 560 }}>
          Tell us about the role. We&rsquo;ll write a cover letter that sounds like you — clear,
          confident, and tailored to the job.
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* ── Left panel ── */}
        <div className="w-full md:w-2/5 md:sticky md:top-[72px] md:max-h-[calc(100vh-88px)] md:overflow-y-auto space-y-4">

          <div className="bg-white border border-border rounded-xl p-5 space-y-6">

            {/* Upload */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-foreground">Your CV</h2>
              <CVUploader onUploadSuccess={setParsedCV} />
              {parsedCV && (
                <p className="text-xs text-emerald-700 font-medium">
                  ✓ CV ready · {parsedCV.experience.length} roles detected
                </p>
              )}
            </div>

            <div className="border-t border-border" />

            {/* Role details */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground">
                The Role You&rsquo;re Applying For
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="jobTitle" className="text-xs">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Product Designer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-xs">Company</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g. Stripe"
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
                  placeholder="Paste the job description here — we'll tailor your CV specifically to this role..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="resize-none"
                  style={{ minHeight: "300px" }}
                />
              </div>
            </div>
          </div>

          {/* CTA button */}
          <button
            onClick={handleGenerate}
            disabled={!canSubmit}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 10,
              border: "none",
              cursor: canSubmit ? "pointer" : "not-allowed",
              background: canSubmit ? "var(--color-accent)" : "var(--color-border)",
              color: canSubmit ? "#FFFFFF" : "var(--color-text-secondary)",
              transition: "background 0.2s ease",
            }}
          >
            {!parsedCV
              ? "Upload your CV first"
              : !jobDescription.trim()
              ? "Add a job description"
              : isGenerating
              ? "Crafting your cover letter..."
              : "Write My Cover Letter"}
          </button>
        </div>

        {/* ── Right panel ── */}
        <div className="w-full md:w-3/5 min-h-[500px]">

          {/* Empty state */}
          {!isGenerating && !coverLetter && (
            <div className="flex flex-col items-center justify-center h-full min-h-[480px] text-center rounded-xl border-2 border-dashed border-border p-12">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                Your cover letter will appear here
              </p>
              <p className="text-xs mt-1.5 max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
                Upload your CV and paste the job description — we&rsquo;ll write a cover letter
                that sounds like you at your best.
              </p>
            </div>
          )}

          {/* Loading skeleton */}
          {isGenerating && (
            <div className="bg-white rounded-xl border border-border shadow-sm px-10 py-12 space-y-5">
              <p className="text-sm font-medium text-muted-foreground animate-pulse">
                Crafting your cover letter...
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
            <div>
              {/* Result header */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    background: "var(--color-accent-light)",
                    color: "var(--color-accent)",
                    padding: "4px 12px",
                    borderRadius: 20,
                  }}
                >
                  COVER LETTER READY
                </span>
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
                  Read through, make it yours, then download.
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
      </div>
    </div>
  );
}
