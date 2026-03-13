"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/improve",      label: "Improve CV" },
  { href: "/cover-letter", label: "Cover Letter" },
];

export function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <style>{`
        .nav-link { position: relative; transition: color 0.15s ease; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--color-accent);
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .nav-link.active::after { opacity: 1; }
        .nav-link:hover { color: var(--color-text-primary) !important; }
        .mobile-link { position: relative; display: flex; align-items: center; gap: 10px; }
        .mobile-link.active::before {
          content: '';
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--color-accent);
          flex-shrink: 0;
        }
      `}</style>

      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: scrolled || menuOpen ? "rgba(247, 245, 240, 0.95)" : "rgba(247, 245, 240, 0)",
          backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
          borderBottomColor: scrolled || menuOpen ? "var(--color-border)" : "transparent",
          transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between" style={{ padding: "16px 24px" }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-6 h-6 rounded-md bg-emerald-700 flex items-center justify-center shrink-0">
              <span className="text-white text-[9px] font-bold tracking-tight leading-none">CV</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">
              CVBoost <span className="text-muted-foreground font-normal">AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center" style={{ gap: 32 }}>
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn("nav-link", isActive && "active")}
                  style={{
                    fontSize: 15,
                    color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-muted/60 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{ color: "var(--color-text-primary)" }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="md:hidden border-t"
            style={{ background: "rgba(247, 245, 240, 0.98)", borderColor: "var(--color-border)" }}
          >
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn("mobile-link px-6 py-4 text-sm border-b block", isActive && "active")}
                  style={{
                    color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                    fontWeight: isActive ? 600 : 400,
                    borderColor: "var(--color-border)",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}
