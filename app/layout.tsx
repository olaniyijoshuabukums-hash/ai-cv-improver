import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI CV Improver & Cover Letter Generator",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <nav className="border-b px-6 py-3 flex items-center gap-6">
          <a href="/" className="font-semibold text-lg">
            CV Improver
          </a>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="/improve" className="hover:text-foreground transition-colors">
              Improve CV
            </a>
            <a href="/cover-letter" className="hover:text-foreground transition-colors">
              Cover Letter
            </a>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
