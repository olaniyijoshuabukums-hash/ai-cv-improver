"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export interface JobDetails {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
}

interface JobDescriptionInputProps {
  onSubmit: (details: JobDetails) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function JobDescriptionInput({
  onSubmit,
  isLoading = false,
  submitLabel = "Analyze Job",
}: JobDescriptionInputProps) {
  const [form, setForm] = useState<JobDetails>({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.jobDescription.trim()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            name="jobTitle"
            placeholder="e.g. Product Manager"
            value={form.jobTitle}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="e.g. Acme Corp"
            value={form.companyName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobDescription">
          Job Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="jobDescription"
          name="jobDescription"
          placeholder="Paste the full job description here..."
          rows={8}
          value={form.jobDescription}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" disabled={isLoading || !form.jobDescription.trim()}>
        {isLoading ? "Analyzing..." : submitLabel}
      </Button>
    </form>
  );
}
