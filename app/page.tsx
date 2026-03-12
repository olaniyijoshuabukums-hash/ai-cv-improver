import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { FileText, Sparkles, Mail, ArrowRight, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-24 pb-32">
        {/* Dot-grid texture */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.84 0.005 75) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Fade dot grid at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 -z-10 bg-gradient-to-b from-transparent to-background" />

        <div className="mx-auto max-w-5xl">
          {/* Eyebrow */}
          <p className="mb-7 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            AI-Powered Career Tools
          </p>

          {/* Headline — editorial serif/sans mix */}
          <h1 className="max-w-3xl text-[3.25rem] font-bold leading-[1.08] tracking-tight sm:text-[4.5rem] text-balance">
            Land more interviews
            <br />
            with{" "}
            <em className="font-display not-italic italic font-normal text-emerald-700">
              AI-crafted
            </em>{" "}
            applications
          </h1>

          <p className="mt-8 max-w-md text-base text-muted-foreground leading-relaxed">
            Upload your CV, paste a job description, and get AI-rewritten bullet
            points and a personalized cover letter in seconds.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/improve"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 px-7 text-sm font-medium gap-2"
              )}
            >
              Improve My CV
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/cover-letter"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 px-7 text-sm font-medium"
              )}
            >
              Write Cover Letter
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
            {["PDF & DOCX support", "Instant results", "Export as PDF or DOCX"].map(
              (item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <span className="h-1 w-1 rounded-full bg-emerald-600 shrink-0" />
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">

          {/* Section header with inline rule */}
          <div className="flex items-end justify-between border-b border-border pb-5 mb-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 mb-1">
                How it works
              </p>
              <h2 className="text-xl font-bold tracking-tight">
                Three steps to your best application
              </h2>
            </div>
            <Link
              href="/improve"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Get started <MoveRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Unified feature panel */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-x border-b border-border">
            {features.map(({ icon: Icon, title, description, step }) => (
              <div
                key={title}
                className="group px-8 py-10 hover:bg-muted/50 transition-colors duration-150"
              >
                {/* Step + icon row */}
                <div className="flex items-center justify-between mb-7">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <Icon className="h-4.5 w-4.5 text-emerald-700" />
                  </div>
                  <span className="text-[2.5rem] font-bold leading-none text-border select-none tabular-nums">
                    {step}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark CTA banner ───────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-foreground px-10 py-14 sm:px-14">
            <div className="max-w-lg space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Start today
              </p>
              <h2 className="text-[2rem] font-bold leading-tight tracking-tight text-white">
                Your next job starts
                <br />
                with a{" "}
                <em className="font-display not-italic italic font-normal text-emerald-400">
                  stronger
                </em>{" "}
                CV
              </h2>
              <p className="text-sm text-white/55 leading-relaxed max-w-sm">
                Upload your CV and a job description. Our AI rewrites your
                bullets, tailors your language, and generates a standout cover
                letter — in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/improve"
                  className="inline-flex items-center justify-center gap-2 h-11 px-7 rounded-lg bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  Improve My CV
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/cover-letter"
                  className="inline-flex items-center justify-center h-11 px-7 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Write Cover Letter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

const features = [
  {
    step: "01",
    icon: FileText,
    title: "Upload Your CV",
    description:
      "Drop in a PDF, DOCX, or plain text file. We parse your roles, experience, and bullet points automatically.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "AI Rewrites Your Bullets",
    description:
      "GPT-4.1 rewrites every bullet with action verbs and measurable impact, tailored to your target role.",
  },
  {
    step: "03",
    icon: Mail,
    title: "Generate a Cover Letter",
    description:
      "Get a personalized, professional cover letter for any job. Edit inline, then export as PDF or DOCX.",
  },
];
