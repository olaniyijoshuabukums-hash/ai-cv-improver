import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { FileText, Sparkles, Mail, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes cvSlideIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: rotate(1.5deg) translateY(0px); }
          50%       { transform: rotate(1.5deg) translateY(-8px); }
        }
        .cv-mockup-wrap { animation: cvSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
        .cv-front-card  { animation: float 4s ease-in-out infinite; }

        .feature-card {
          background: #fff;
          border: 1px solid var(--color-border);
          border-top: 2px solid var(--color-accent);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
          transition: all 0.25s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.10);
        }

        @media (max-width: 767px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .cv-mockup-wrap { transform: scale(0.85); transform-origin: center top; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .stat-col { border-right: none !important; border-bottom: 1px solid #C8E6CC; padding-bottom: 32px; margin-bottom: 32px; }
          .stat-col:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          .strip-inner { flex-direction: column !important; }
          .strip-divider { width: 100% !important; height: 1px !important; margin: 24px 0 !important; }
        }
      `}</style>

      <div className="flex flex-col">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden px-6"
          style={{ paddingTop: 60, paddingBottom: 48, minHeight: "80vh", display: "flex", alignItems: "center" }}
        >
          {/* Dot-grid texture */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage: "radial-gradient(circle, oklch(0.84 0.005 75) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 -z-10 bg-gradient-to-b from-transparent to-background" />

          <div
            className="mx-auto max-w-5xl w-full hero-grid"
            style={{ display: "grid", gridTemplateColumns: "55% 45%", gap: 60, alignItems: "center" }}
          >
            {/* Left — text */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 28 }}>
                Career Tools That Work
              </p>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 52,
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text-primary)",
                  margin: 0,
                  maxWidth: 500,
                }}
              >
                More interviews,
                <br />
                <span style={{ fontStyle: "italic", color: "var(--color-accent)", fontWeight: 800 }}>stronger</span>{" "}
                applications.
              </h1>

              <p style={{ fontSize: 16, color: "var(--color-text-secondary)", lineHeight: 1.6, marginTop: 24, maxWidth: 420 }}>
                Upload your CV, paste a job description, and get rewritten bullet
                points and a personalized cover letter in seconds.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3" style={{ marginTop: 36 }}>
                <Link href="/improve" className={cn(buttonVariants({ size: "lg" }), "h-11 px-7 text-sm font-medium gap-2")}>
                  Improve My CV
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/cover-letter" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-7 text-sm font-medium")}>
                  Write Cover Letter
                </Link>
              </div>

              {/* Trust signals */}
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 20 }}>
                No account needed
                <span style={{ margin: "0 10px", opacity: 0.4 }}>·</span>
                Results in under a minute
                <span style={{ margin: "0 10px", opacity: 0.4 }}>·</span>
                Your data stays private
              </p>
            </div>

            {/* Right — CV mockup */}
            <div className="flex items-center justify-center" style={{ padding: "16px 0" }}>
              <div className="cv-mockup-wrap" style={{ position: "relative", width: 300, height: 360 }}>
                {/* Back card */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#FFFFFF",
                    borderRadius: 16,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
                    transform: "rotate(-2deg) translate(-8px, 8px)",
                    opacity: 0.3,
                    zIndex: 0,
                  }}
                />
                {/* Front card — floating animation */}
                <div
                  className="cv-front-card"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#FFFFFF",
                    borderRadius: 16,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    zIndex: 1,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#E8E4DC", flexShrink: 0 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                      <div style={{ width: "65%", height: 11, background: "#D4D0C8", borderRadius: 4 }} />
                      <div style={{ width: "45%", height: 8, background: "#E8E4DC", borderRadius: 4 }} />
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid #F0EDE8", margin: "0 0 14px" }} />
                  <span style={{ fontSize: 10, color: "var(--color-accent)", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 10 }}>EXPERIENCE</span>
                  <div style={{ width: "70%", height: 10, background: "#E8E4DC", borderRadius: 4, marginBottom: 6 }} />
                  <div style={{ width: "45%", height: 8, background: "#E8E4DC", borderRadius: 4, opacity: 0.5, marginBottom: 10 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                    <div style={{ width: "80%", height: 7, background: "#E8E4DC", borderRadius: 4 }} />
                    <div style={{ width: "90%", height: 7, background: "#E8E4DC", borderRadius: 4 }} />
                    <div style={{ width: "65%", height: 7, background: "#E8E4DC", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 10, color: "var(--color-accent)", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 10 }}>SKILLS</span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["Figma", "Branding", "Adobe CC"].map((s) => (
                      <span key={s} style={{ fontSize: 11, background: "#EAF4EE", color: "var(--color-accent)", padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div style={{ position: "absolute", bottom: 20, right: 20 }}>
                    <span style={{ fontSize: 11, background: "var(--color-accent)", color: "#FFFFFF", padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>
                      ✓ Improved
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Context strip ────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", padding: "32px 0" }}>
          <div
            className="mx-auto max-w-5xl px-6 strip-inner"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {/* Left: file formats */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flex: 1 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-secondary)", margin: 0 }}>
                Works with your files
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {[{ icon: "📄", label: "PDF" }, { icon: "📝", label: "DOCX" }, { icon: "📋", label: "Plain Text" }].map(({ icon, label }) => (
                  <span
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#FFFFFF",
                      border: "1px solid var(--color-border)",
                      borderRadius: 20,
                      padding: "6px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <span>{icon}</span> {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div
              className="strip-divider"
              style={{ width: 1, height: 40, background: "var(--color-border)", margin: "0 40px", flexShrink: 0 }}
            />

            {/* Right: outcomes */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flex: 1 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-secondary)", margin: 0 }}>
                What you get back
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {["✓ Improved CV", "✓ Cover Letter", "✓ Job Match Score"].map((label) => (
                  <span
                    key={label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      background: "var(--color-accent-light)",
                      border: "1px solid #C8E6CC",
                      borderRadius: 20,
                      padding: "6px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--color-accent)",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── How it works ─────────────────────────────────────── */}
        <section style={{ padding: "80px 24px" }}>
          <div className="mx-auto max-w-5xl">

            {/* Section header */}
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>
                How it works
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.15 }}>
                Three steps to a stronger application
              </h2>
              <p style={{ fontSize: 16, color: "var(--color-text-secondary)", marginTop: 8 }}>
                No fluff. No generic templates. Just your story, told better.
              </p>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-6" style={{ alignItems: "stretch" }}>
              {features.map(({ icon: Icon, title, description, step, outcome }) => (
                <div key={title} className="feature-card" style={{ padding: "36px 32px", display: "flex", flexDirection: "column" }}>
                  <span style={{ display: "inline-block", background: "var(--color-accent-light)", color: "var(--color-accent)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", width: "fit-content" }}>
                    STEP {step}
                  </span>
                  <div style={{ marginTop: 24 }}>
                    <Icon style={{ width: 28, height: 28, color: "var(--color-accent)", opacity: 0.7 }} strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 16, marginBottom: 0 }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--color-text-secondary)", marginTop: 8, flex: 1 }}>
                    {description}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 500, marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--color-border)" }}>
                    {outcome}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Trust / Stats strip ──────────────────────────────── */}
        <section style={{ background: "#EAF4EE", borderTop: "1px solid #D4EBD8", borderBottom: "1px solid #D4EBD8", padding: "72px 0" }}>
          <div
            className="mx-auto max-w-5xl px-6 stats-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center" }}
          >
            {[
              { stat: "2 min", label: "Average time to improve a CV", last: false },
              { stat: "94%",   label: "of users said their CV looked more professional", last: false },
              { stat: "3×",   label: "more interviews reported after using CVBoost", last: true },
            ].map(({ stat, label, last }) => (
              <div
                key={stat}
                className="stat-col flex flex-col items-center text-center px-6"
                style={{ borderRight: last ? "none" : "1px solid #C8E6CC" }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, color: "var(--color-accent)", lineHeight: 1 }}>
                  {stat}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-text-secondary)", maxWidth: 140, textAlign: "center", marginTop: 10, lineHeight: 1.45 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Dark CTA ─────────────────────────────────────────── */}
        <section style={{ background: "#1C1C1C", padding: "80px 40px", textAlign: "center" }}>
          <div className="mx-auto" style={{ maxWidth: 600 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, lineHeight: 1.1, color: "#FFFFFF", margin: 0 }}>
              You&rsquo;ve done the work.
              <br />
              <span style={{ fontStyle: "italic", color: "#4ADE80" }}>Let&rsquo;s make sure it shows.</span>
            </h2>

            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#D1D5DB", maxWidth: 480, margin: "20px auto 0", lineHeight: 1.65 }}>
              Paste your CV and the role you&rsquo;re targeting. We&rsquo;ll sharpen your story
              and write a cover letter that sounds exactly like you — at your best.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: 12, marginTop: 36 }}>
              <Link href="/improve" className="inline-flex items-center justify-center gap-2 h-11 px-7 rounded-lg bg-white text-[#1C1C1C] text-sm font-semibold hover:bg-white/90 transition-colors">
                Strengthen My CV
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/cover-letter" className="inline-flex items-center justify-center h-11 px-7 rounded-lg border text-white text-sm font-medium hover:bg-white/10 transition-colors" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                Write My Cover Letter
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer style={{ background: "#111111", padding: 20, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
            © 2025 CVBoost AI · Built to help you get hired
          </p>
        </footer>

      </div>
    </>
  );
}

const features = [
  {
    step: "01",
    icon: FileText,
    title: "Drop in your CV",
    description: "PDF, DOCX, or plain text. We read it and pull out what matters.",
    outcome: "✓ CV parsed in seconds",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "We sharpen your story",
    description: "Every bullet rewritten with clarity and impact, tailored to the role.",
    outcome: "✓ Every bullet point improved",
  },
  {
    step: "03",
    icon: Mail,
    title: "Download and apply",
    description: "A polished CV and cover letter, ready to send. Sounds like you — at your best.",
    outcome: "✓ Ready to download and send",
  },
];
