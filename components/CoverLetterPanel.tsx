"use client";

import { useState } from "react";
import { CoverLetter } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw, Check } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";

interface CoverLetterPanelProps {
  coverLetter: CoverLetter;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export default function CoverLetterPanel({
  coverLetter,
  onRegenerate,
  isRegenerating = false,
}: CoverLetterPanelProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const paragraphs = coverLetter.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const wordCount = coverLetter.content
    .split(/\s+/)
    .filter(Boolean).length;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(coverLetter.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }

  async function handleDownloadPDF() {
    setDownloading(true);
    try {
      const slug = [coverLetter.jobTitle, coverLetter.companyName]
        .filter(Boolean)
        .join("-")
        .replace(/\s+/g, "_") || "cover-letter";
      const blob = await apiClient.exportDocument({
        content: coverLetter.content,
        format: "pdf",
        filename: slug,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          size="sm"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {downloading ? "Generating…" : "Download PDF"}
        </Button>

        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy to Clipboard"}
        </Button>

        {onRegenerate && (
          <Button
            onClick={onRegenerate}
            disabled={isRegenerating}
            variant="ghost"
            size="sm"
            className="gap-2 ml-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            {isRegenerating ? "Regenerating…" : "Regenerate"}
          </Button>
        )}
      </div>

      {/* A4 document card */}
      <div className="bg-white rounded-xl border border-border shadow-sm px-10 py-12 max-w-2xl">
        {/* Letter header */}
        {(coverLetter.jobTitle || coverLetter.companyName) && (
          <div className="mb-8 pb-5 border-b border-gray-200">
            {coverLetter.jobTitle && (
              <h2 className="text-lg font-semibold text-gray-900">
                {coverLetter.jobTitle}
              </h2>
            )}
            {coverLetter.companyName && (
              <p className="text-sm text-gray-500 mt-0.5">{coverLetter.companyName}</p>
            )}
          </div>
        )}

        {/* Body paragraphs */}
        <div className="space-y-5">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-sm text-gray-800 leading-[1.8]">
              {para}
            </p>
          ))}
        </div>

        {/* Word count */}
        <p className="mt-8 text-xs text-gray-400">{wordCount} words</p>
      </div>
    </div>
  );
}
