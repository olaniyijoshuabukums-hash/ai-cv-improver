"use client";

import { useState } from "react";
import { CoverLetter } from "@/types";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Download, RefreshCw, Check, ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [downloading, setDownloading] = useState<"pdf" | "docx" | null>(null);

  const paragraphs = coverLetter.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const wordCount = coverLetter.content.split(/\s+/).filter(Boolean).length;

  const slug =
    [coverLetter.jobTitle, coverLetter.companyName]
      .filter(Boolean)
      .join("-")
      .replace(/\s+/g, "_") || "cover-letter";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(coverLetter.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }

  async function handleDownload(format: "pdf" | "docx") {
    setDownloading(format);
    try {
      const blob = await apiClient.exportDocument({
        content: coverLetter.content,
        format,
        filename: slug,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* Sticky download bar */}
      <div className="sticky top-[72px] z-10 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background/95 px-4 py-3 backdrop-blur-sm shadow-sm">
        {/* Download dropdown */}
        <DropdownMenu>
            <DropdownMenuTrigger
            className={cn(buttonVariants({ size: "sm" }), "gap-2")}
            disabled={!!downloading}
          >
            <Download className="h-4 w-4" />
            {downloading ? "Downloading…" : "Download"}
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => handleDownload("pdf")}
              disabled={!!downloading}
              className="gap-2 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              Download as PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDownload("docx")}
              disabled={!!downloading}
              className="gap-2 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              Download as DOCX
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Copy to clipboard */}
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

        {/* Regenerate */}
        {onRegenerate && (
          <Button
            onClick={onRegenerate}
            disabled={isRegenerating}
            variant="ghost"
            size="sm"
            className="gap-2 ml-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            {isRegenerating ? "Rewriting..." : "Rewrite"}
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
