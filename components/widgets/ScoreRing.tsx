type ScoreRingProps = {
  score: number;
  color: string;
};

export function ScoreRing({ score, color }: ScoreRingProps) {
  const R = 36,
    strokeW = 7;
  const circ = 2 * Math.PI * R;
  const dash = (score / 100) * circ;
  const label =
    score >= 90
      ? "完璧！"
      : score >= 70
        ? "いい感じ"
        : score >= 45
          ? "もう少し"
          : "ズレてる";
  const labelColor =
    score >= 90
      ? "#c8ff64"
      : score >= 70
        ? "#ffcc44"
        : score >= 45
          ? "#ff9944"
          : "#ff6644";

  return (
    <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle
          cx="45"
          cy="45"
          r={R}
          fill="none"
          stroke="#1e1e30"
          strokeWidth={strokeW}
        />
        <circle
          cx="45"
          cy="45"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{
            transition: "stroke-dasharray 0.2s ease",
            filter: `drop-shadow(0 0 6px ${color}88)`,
          }}
        />
        <text
          x="45"
          y="41"
          textAnchor="middle"
          fill="white"
          fontSize="18"
          fontWeight="700"
          fontFamily="monospace"
        >
          {Math.round(score)}
        </text>
        <text
          x="45"
          y="55"
          textAnchor="middle"
          fill="#6b6b8a"
          fontSize="9"
          fontFamily="monospace"
        >
          / 100
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.6rem",
          color: labelColor,
          whiteSpace: "nowrap",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
    </div>
  );
}
