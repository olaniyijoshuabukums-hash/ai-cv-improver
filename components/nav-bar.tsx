"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border"
      style={{
        background: scrolled ? "rgba(247, 245, 240, 0.85)" : "rgba(247, 245, 240, 0)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottomColor: scrolled ? "var(--color-border)" : "transparent",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
      }}
    >
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
  );
}
