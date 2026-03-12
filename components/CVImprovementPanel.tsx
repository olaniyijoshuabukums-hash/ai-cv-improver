"use client";

import { useState } from "react";
import { ImprovedCV } from "@/types";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

function cvToText(cv: ImprovedCV): string {
  const lines: string[] = [];

  if (cv.name) lines.push(cv.name);
  const contact = [cv.email, cv.phone].filter(Boolean).join("  |  ");
  if (contact) lines.push(contact);
  lines.push("");

  if (cv.experience.length > 0) {
    lines.push("EXPERIENCE");
    lines.push("─".repeat(48));
    for (const job of cv.experience) {
      const roleHeader = [job.role, job.company].filter(Boolean).join(" — ");
      lines.push(roleHeader);
      if (job.duration) lines.push(job.duration);
      for (const b of job.bullets) {
        lines.push(`• ${b.improved}`);
      }
      lines.push("");
    }
  }

  if (cv.skills.length > 0) {
    lines.push("SKILLS");
    lines.push("─".repeat(48));
    lines.push(cv.skills.join(" · "));
    lines.push("");
  }

  if (cv.education.length > 0) {
    lines.push("EDUCATION");
    lines.push("─".repeat(48));
    for (const edu of cv.education) {
      const eduLine = [edu.degree, edu.institution].filter(Boolean).join(" — ");
      lines.push(edu.year ? `${eduLine} (${edu.year})` : eduLine);
    }
  }

  return lines.join("\n");
}

interface CVImprovementPanelProps {
  improvedCV: ImprovedCV;
}

export default function CVImprovementPanel({ improvedCV }: CVImprovementPanelProps) {
  const [downloading, setDownloading] = useState<"pdf" | "docx" | null>(null);

  async function handleDownload(format: "pdf" | "docx") {
    setDownloading(format);
    try {
      const content = cvToText(improvedCV);
      const name = improvedCV.name?.replace(/\s+/g, "_") ?? "CV";
      const blob = await apiClient.exportDocument({
        content,
        format,
        filename: `${name}_Improved`,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}_Improved.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Download buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => handleDownload("pdf")}
          disabled={!!downloading}
          size="sm"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {downloading === "pdf" ? "Generating…" : "Download PDF"}
        </Button>
        <Button
          onClick={() => handleDownload("docx")}
          disabled={!!downloading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          {downloading === "docx" ? "Generating…" : "Download DOCX"}
        </Button>
      </div>

      {/* A4-style CV document */}
      <div className="bg-white rounded-xl border border-border shadow-sm px-10 py-12 max-w-2xl font-sans">

        {/* Header — name & contact */}
        {(improvedCV.name || improvedCV.email || improvedCV.phone) && (
          <div className="mb-8 pb-6 border-b border-gray-200">
            {improvedCV.name && (
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {improvedCV.name}
              </h2>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {improvedCV.email && <span>{improvedCV.email}</span>}
              {improvedCV.phone && <span>{improvedCV.phone}</span>}
            </div>
          </div>
        )}

        {/* Experience */}
        {improvedCV.experience.length > 0 && (
          <section className="mb-8">
            <h3 className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-700 mb-4">
              Experience
            </h3>
            <div className="space-y-6">
              {improvedCV.experience.map((job, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-4 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900">
                      {job.role}
                      {job.company && (
                        <span className="font-normal text-gray-500">
                          {" "}— {job.company}
                        </span>
                      )}
                    </p>
                    {job.duration && (
                      <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
                        {job.duration}
                      </span>
                    )}
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {job.bullets.map((bullet, j) => (
                      <li key={j} className="flex gap-2.5 text-sm text-gray-700 leading-relaxed">
                        <span className="text-emerald-600 shrink-0 mt-px select-none">•</span>
                        <span>{bullet.improved}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {improvedCV.skills.length > 0 && (
          <section className="mb-8">
            <h3 className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-700 mb-3">
              Skills
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {improvedCV.skills.join(" · ")}
            </p>
          </section>
        )}

        {/* Education */}
        {improvedCV.education.length > 0 && (
          <section>
            <h3 className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-700 mb-3">
              Education
            </h3>
            <div className="space-y-2">
              {improvedCV.education.map((edu, i) => (
                <div key={i} className="flex items-baseline justify-between gap-4">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{edu.degree}</span>
                    {edu.institution && (
                      <span className="text-gray-500"> — {edu.institution}</span>
                    )}
                  </p>
                  {edu.year && (
                    <span className="text-xs text-gray-400 shrink-0">{edu.year}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
