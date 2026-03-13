"use client";

import { useState } from "react";
import CVUploader from "@/components/CVUploader";
import CVImprovementPanel from "@/components/CVImprovementPanel";
import { JobMatchScoreCard, JobMatchScoreCardSkeleton } from "@/components/JobMatchScoreCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ParsedCV, ImprovedCV, JobMatchScore } from "@/types";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { FileText } from "lucide-react";

export default function ImprovePage() {
  const [parsedCV, setParsedCV] = useState<ParsedCV | null>(null);
  const [improvedCV, setImprovedCV] = useState<ImprovedCV | null>(null);
  const [jobMatch, setJobMatch] = useState<JobMatchScore | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [isScoringMatch, setIsScoringMatch] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  async function handleImprove() {
    if (!parsedCV) return;
    setIsImproving(true);
    setImprovedCV(null);
    setJobMatch(null);

    try {
      const result = await apiClient.improveCV({
        parsedCV,
        jobTitle: jobTitle.trim() || undefined,
        companyName: companyName.trim() || undefined,
        jobDescription: jobDescription.trim() || undefined,
      });

      if (result.success && result.improvedCV) {
        setImprovedCV(result.improvedCV);
        toast.success("Your CV is ready!");

        // Fire job match scoring in parallel if a job description was provided
        if (jobDescription.trim()) {
          setIsScoringMatch(true);
          apiClient
            .jobMatch({ cvText: parsedCV.rawText, jobDescription: jobDescription.trim() })
            .then((r) => {
              if (r.success && r.jobMatch) setJobMatch(r.jobMatch);
            })
            .catch(() => { /* non-critical — silently skip */ })
            .finally(() => setIsScoringMatch(false));
        }
      } else {
        toast.error(result.error || "Something went wrong — please try again");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong — please try again");
    } finally {
      setIsImproving(false);
    }
  }

  const canSubmit = !!parsedCV && !isImproving;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Page header */}
      <div className="mb-8">
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 8 }}>
          CV Improvement
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
          Strengthen Your CV
        </h1>
        <p style={{ fontSize: 16, color: "var(--color-text-secondary)", marginTop: 8, maxWidth: 560 }}>
          Upload your CV and the job you&rsquo;re targeting. We&rsquo;ll rewrite your experience
          to match what they&rsquo;re looking for — clearly and confidently.
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
                  ✓ {parsedCV.experience.length} roles · {parsedCV.skills.length} skills detected
                </p>
              )}
            </div>

            <div className="border-t border-border" />

            {/* Role details */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground">
                The Role You&rsquo;re Targeting{" "}
                <span className="text-muted-foreground font-normal">— optional</span>
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
                <Label htmlFor="jobDescription" className="text-xs">Job Description</Label>
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
            onClick={handleImprove}
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
              : isImproving
              ? "Reading your experience..."
              : "Strengthen My CV"}
          </button>
        </div>

        {/* ── Right panel ── */}
        <div className="w-full md:w-3/5 min-h-[500px]">

          {/* Empty state */}
          {!isImproving && !improvedCV && (
            <div className="flex flex-col items-center justify-center h-full min-h-[480px] text-center rounded-xl border-2 border-dashed border-border p-12">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                Your strengthened CV will appear here
              </p>
              <p className="text-xs mt-1.5 max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
                Fill in the details on the left and click{" "}
                <span className="font-medium">Strengthen My CV</span> to get started.
              </p>
            </div>
          )}

          {/* Loading skeleton */}
          {isImproving && (
            <div className="bg-white rounded-xl border border-border shadow-sm px-10 py-12 space-y-5">
              <p className="text-sm font-medium text-muted-foreground animate-pulse">
                Reading your experience...
              </p>
              <div className="space-y-3 animate-pulse">
                <div className="h-5 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="h-3 bg-muted rounded w-4/5" />
                <div className="h-5 bg-muted rounded w-1/4 mt-6" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="h-5 bg-muted rounded w-1/4 mt-6" />
                <div className="h-3 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          )}

          {/* Results */}
          {improvedCV && !isImproving && (
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
                  CV READY
                </span>
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
                  Review your improved CV below. Edit any section, then download.
                </p>
              </div>

              {/* Job Match Score card — only shown when a job description was provided */}
              {isScoringMatch && <JobMatchScoreCardSkeleton />}
              {jobMatch && !isScoringMatch && <JobMatchScoreCard data={jobMatch} />}

              <CVImprovementPanel improvedCV={improvedCV} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
