import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          AI CV Improver & Cover Letter Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your CV, paste a job description, and let AI rewrite your
          bullet points and craft a personalized cover letter in seconds.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link href="/improve" className={cn(buttonVariants({ size: "lg" }))}>
            Improve My CV
          </Link>
          <Link href="/cover-letter" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Write Cover Letter
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-primary" />
              Upload Your CV
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Upload a PDF, DOCX, or TXT file. We extract your experience and
            bullet points automatically.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            GPT-4.1 rewrites each bullet point with strong action verbs and
            measurable impact, tailored to your target role.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-5 w-5 text-primary" />
              Cover Letter
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Generate a personalized, professional cover letter for any job —
            edit, copy, and download as PDF or DOCX.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
