"use client";

import { useState } from "react";
import { CoverLetter } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, RefreshCw, Check } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

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
  const [content, setContent] = useState(coverLetter.content);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownloadPDF() {
    const blob = await apiClient.exportDocument({
      content,
      format: "pdf",
      filename: `cover-letter-${coverLetter.companyName}`,
    });
    downloadBlob(blob, `cover-letter-${coverLetter.companyName}.pdf`);
  }

  async function handleDownloadDOCX() {
    const blob = await apiClient.exportDocument({
      content,
      format: "docx",
      filename: `cover-letter-${coverLetter.companyName}`,
    });
    downloadBlob(blob, `cover-letter-${coverLetter.companyName}.docx`);
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Cover Letter</h3>
          <p className="text-sm text-muted-foreground">
            {coverLetter.jobTitle} — {coverLetter.companyName}
          </p>
        </div>
        <div className="flex gap-2">
          {onRegenerate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 mr-1 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadDOCX}>
            <Download className="h-4 w-4 mr-1" />
            DOCX
          </Button>
        </div>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={16}
        className="font-mono text-sm resize-none"
      />

      <p className="text-xs text-muted-foreground">
        {content.split(/\s+/).filter(Boolean).length} words — edit directly above
      </p>
    </div>
  );
}
