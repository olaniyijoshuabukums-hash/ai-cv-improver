"use client";

import { useState } from "react";
import { ImprovedCV } from "@/types";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CVImprovementPanelProps {
  improvedCV: ImprovedCV;
}

export default function CVImprovementPanel({ improvedCV }: CVImprovementPanelProps) {
  const [downloading, setDownloading] = useState<"pdf" | "docx" | null>(null);

  async function handleDownload(format: "pdf" | "docx") {
    setDownloading(format);
    try {
      const name = improvedCV.name?.replace(/\s+/g, "_") ?? "CV";
      const blob = await apiClient.exportCV(improvedCV, format, `${name}_Improved`);
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
    <div className="space-y-5">
      {/* Sticky download bar */}
      <div className="sticky top-[72px] z-10 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background/95 px-4 py-3 backdrop-blur-sm shadow-sm">
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
      </div>

      {/* A4-style CV document */}
      <div className="bg-white rounded-xl border border-border shadow-sm px-10 py-12 max-w-2xl font-sans">

        {/* ── Header ── */}
        {(improvedCV.name || improvedCV.email || improvedCV.phone) && (
          <div className="mb-7 pb-6 border-b border-gray-100">
            {improvedCV.name && (
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {improvedCV.name}
              </h1>
            )}
            {(improvedCV.email || improvedCV.phone) && (
              <p className="text-sm text-gray-500">
                {[improvedCV.email, improvedCV.phone].filter(Boolean).join("  |  ")}
              </p>
            )}
          </div>
        )}

        {/* ── Professional Summary ── */}
        {improvedCV.summary && (
          <section className="mb-7">
            <SectionHeading>Professional Summary</SectionHeading>
            <p className="text-sm text-gray-500 italic leading-relaxed mt-3">
              {improvedCV.summary}
            </p>
          </section>
        )}

        {/* ── Experience ── */}
        {improvedCV.experience.length > 0 && (
          <section className="mb-7">
            <SectionHeading>Experience</SectionHeading>
            <div className="mt-3 space-y-6">
              {improvedCV.experience.map((job, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-4 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900">
                      {job.title}
                      {job.company && (
                        <span className="font-normal text-gray-500"> — {job.company}</span>
                      )}
                      {job.location && (
                        <span className="font-normal text-gray-400">, {job.location}</span>
                      )}
                    </p>
                    {job.period && (
                      <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap mt-0.5">
                        {job.period}
                      </span>
                    )}
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {job.bullets.map((bullet, j) => (
                      <li
                        key={j}
                        className="flex gap-2.5 text-sm text-gray-700 leading-relaxed"
                      >
                        <span className="text-emerald-600 shrink-0 mt-px select-none">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Skills ── */}
        {improvedCV.skills.length > 0 && (
          <section className="mb-7">
            <SectionHeading>Skills</SectionHeading>
            <div className="mt-3 flex flex-wrap gap-2">
              {improvedCV.skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Education ── */}
        {improvedCV.education.length > 0 && (
          <section>
            <SectionHeading>Education</SectionHeading>
            <div className="mt-3 space-y-2">
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b-2 border-emerald-600 pb-1">
      <h3 className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-700">
        {children}
      </h3>
    </div>
  );
}
