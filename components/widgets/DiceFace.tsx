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
        className={`transition-colors duration-150 ${
          highlighted
            ? "fill-slate-800 stroke-sky-500 dark:fill-slate-900 dark:stroke-sky-400"
            : "fill-white stroke-slate-300 dark:fill-slate-700 dark:stroke-slate-500"
        }`}
        strokeWidth="5"
      />
      {dots.map(([cx, cy], i) => (
        <circle
          // biome-ignore lint/suspicious/noArrayIndexKey: stable list
          key={i}
          cx={cx}
          cy={cy}
          r="9"
          className={`transition-colors duration-150 ${
            highlighted ? "fill-sky-400" : "fill-slate-700 dark:fill-slate-200"
          }`}
        />
      ))}
    </svg>
  );
}
