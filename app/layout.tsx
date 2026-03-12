import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  title: "CVBoost AI — CV Improver & Cover Letter Generator",
  description: "Improve your CV and generate personalized cover letters with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased bg-background text-foreground`}
      >
        <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-emerald-700 flex items-center justify-center shrink-0">
                <span className="text-white text-[9px] font-bold tracking-tight leading-none">CV</span>
              </div>
              <span className="font-semibold text-sm tracking-tight">
                CVBoost <span className="text-muted-foreground font-normal">AI</span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/improve"
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              >
                Improve CV
              </Link>
              <Link
                href="/cover-letter"
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              >
                Cover Letter
              </Link>
              <Link href="/improve" className={cn(buttonVariants({ size: "sm" }), "ml-2 px-4")}>
                Get Started
              </Link>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
