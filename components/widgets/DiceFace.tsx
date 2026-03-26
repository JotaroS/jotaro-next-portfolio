type DiceFaceProps = {
  value: number;
  size?: number;
  className?: string;
  highlighted?: boolean;
};

// Standard dice dot positions on a 100×100 grid
const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[32, 32], [68, 68]],
  3: [[32, 32], [50, 50], [68, 68]],
  4: [[32, 32], [68, 32], [32, 68], [68, 68]],
  5: [[32, 32], [68, 32], [50, 50], [32, 68], [68, 68]],
  6: [[32, 30], [68, 30], [32, 50], [68, 50], [32, 70], [68, 70]],
};

export function DiceFace({ value, size = 28, className = "", highlighted = false }: DiceFaceProps) {
  const dots = DOT_POSITIONS[value] ?? [];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label={`ダイス ${value}`}
    >
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="18"
        ry="18"
        style={{
          fill: highlighted ? "#1a1a2e" : "#13131f",
          stroke: highlighted ? "#60b8ff" : "#3a3a5a",
          transition: "fill 0.15s, stroke 0.15s",
        }}
        strokeWidth="5"
      />
      {dots.map(([cx, cy], i) => (
        <circle
          // biome-ignore lint/suspicious/noArrayIndexKey: stable list
          key={i}
          cx={cx}
          cy={cy}
          r="9"
          style={{
            fill: highlighted ? "#60b8ff" : "#e8e4d9",
            transition: "fill 0.15s",
          }}
        />
      ))}
    </svg>
  );
}
