import { JobMatchScore } from "@/types";

function scoreColor(score: number): string {
  if (score <= 40) return "#DC2626";
  if (score <= 65) return "#D97706";
  if (score <= 85) return "#1A6B3C";
  return "#0D4D2A";
}

function CircleProgress({ score, color }: { score: number; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      {/* Background track */}
      <circle cx="44" cy="44" r={radius} fill="none" stroke="#F0EDE8" strokeWidth="6" />
      {/* Progress arc — starts at 12 o'clock */}
      <circle
        cx="44"
        cy="44"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      {/* Score centered */}
      <text
        x="44"
        y="44"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fontWeight="800"
        fill={color}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {score}
      </text>
    </svg>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

export function JobMatchScoreCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--color-border)",
        borderTop: "2px solid var(--color-border)",
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        marginBottom: 24,
      }}
    >
      <p
        className="animate-pulse"
        style={{ fontSize: 14, color: "var(--color-text-secondary)", textAlign: "center", margin: 0 }}
      >
        Calculating your match score...
      </p>
      <div className="animate-pulse" style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--color-border)" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ height: 14, width: "40%", background: "var(--color-border)", borderRadius: 4 }} />
            <div style={{ height: 10, width: "25%", background: "var(--color-border)", borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 10, background: "var(--color-border)", borderRadius: 4 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

export function JobMatchScoreCard({ data }: { data: JobMatchScore }) {
  const color = scoreColor(data.score);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--color-border)",
        borderTop: `2px solid ${color}`,
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        marginBottom: 24,
      }}
    >
      {/* Top row: score + arc */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 56,
              fontWeight: 800,
              color,
              lineHeight: 1,
              margin: 0,
            }}
          >
            {data.score}
          </p>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: 6,
            }}
          >
            {data.label}
          </p>
        </div>
        <CircleProgress score={data.score} color={color} />
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid var(--color-border)", margin: "20px 0" }} />

      {/* Strengths + Gaps */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--color-accent)", fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>
            Strengths
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.strengths.slice(0, 2).map((s, i) => (
              <p key={i} style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.5, margin: 0 }}>
                ✓ {s}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#D97706", fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>
            Gaps to Address
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.gaps.slice(0, 2).map((g, i) => (
              <p key={i} style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.5, margin: 0 }}>
                △ {g}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Tip */}
      <div
        style={{
          marginTop: 20,
          background: "#FFFBEB",
          border: "1px solid #FDE68A",
          borderRadius: 8,
          padding: "12px 16px",
        }}
      >
        <p style={{ fontSize: 13, color: "#92400E", margin: 0, lineHeight: 1.5 }}>
          💡 {data.tip}
        </p>
      </div>
    </div>
  );
}
