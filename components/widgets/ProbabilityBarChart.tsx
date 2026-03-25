"use client";

import { useState } from "react";
import { DiceFace } from "@/components/widgets/DiceFace";

const CHART_HEIGHT = 160;
const MAX_PROB = 0.5;
// ticks at 0, 1/6, 1/3, 1/2
const Y_TICKS = [0, 1 / 6, 1 / 3, 1 / 2];

type ProbabilityBarChartProps = {
  labels: string[];
  observed: number[];
  expected?: number[];
  observedLabel?: string;
  expectedLabel?: string;
  showDiceFaces?: boolean;
  animKey?: number;
};

export function ProbabilityBarChart({
  labels,
  observed,
  expected,
  observedLabel = "観測",
  expectedLabel = "理論値を表示する",
  showDiceFaces = true,
  animKey,
}: ProbabilityBarChartProps) {
  const [showExpected, setShowExpected] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = Math.max(observed.reduce((a, v) => a + v, 0), 1);
  const observedProbs = observed.map((v) => v / total);
  const expectedProbs = expected ? expected.map((v) => v / total) : null;

  return (
    <div className="space-y-2">
      <style>{`
        @keyframes barGrowUp {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      `}</style>
      {/* Legend + toggle */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-500" />
          {observedLabel}
        </span>
        {expected && (
          <label className="inline-flex cursor-pointer items-center gap-1.5">
            {/* off by default */}
            <button 
              type="button"              
              role="switch"
              aria-checked={showExpected}
              onClick={() => setShowExpected((v) => !v)}
              className={`relative inline-flex h-[18px] w-8 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                showExpected
                  ? "bg-emerald-500"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  showExpected ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className={showExpected ? "" : "text-slate-400"}>
              {expectedLabel}
            </span>
          </label>
        )}
      </div>

      {/* Chart */}
      <div className="flex gap-1">
        {/* Y-axis tick labels */}
        <div className="relative flex-none" style={{ width: 26, height: CHART_HEIGHT }}>
          {Y_TICKS.map((tick) => {
            const topPx = CHART_HEIGHT - (tick / MAX_PROB) * CHART_HEIGHT;
            return (
              <div
                key={tick}
                className="absolute right-1 flex items-center"
                style={{ top: topPx, transform: "translateY(-50%)" }}
              >
                <span className="text-[9px] leading-none tabular-nums text-slate-400">
                  {tick === 0 ? "0" : tick.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Plot area */}
        <div className="flex-1 overflow-hidden">
          {/* Bar area with gridlines */}
          <div
            className="relative border-b border-l border-slate-300 dark:border-slate-600"
            style={{ height: CHART_HEIGHT }}
          >
            {/* Dashed gridlines (skip 0 — that's the bottom border) */}
            {Y_TICKS.filter((t) => t > 0).map((tick) => {
              const topPx = CHART_HEIGHT - (tick / MAX_PROB) * CHART_HEIGHT;
              return (
                <div
                  key={tick}
                  className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-200 dark:border-slate-700"
                  style={{ top: `${topPx}px` }}
                />
              );
            })}

            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-1 px-1">
              {labels.map((label, index) => {
                const obsP = observedProbs[index];
                const expP = expectedProbs ? expectedProbs[index] : 0;
                const obsH = Math.min(
                  Math.max((obsP / MAX_PROB) * (CHART_HEIGHT - 2), 2),
                  CHART_HEIGHT - 2
                );
                const expH = Math.min(
                  Math.max((expP / MAX_PROB) * (CHART_HEIGHT - 2), 2),
                  CHART_HEIGHT - 2
                );
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={`${animKey ?? 0}-${label}`}
                    className="relative flex h-full flex-1 cursor-pointer items-end justify-center gap-0.5"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Percentage tooltip on hover */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-1.5 py-0.5 text-[9px] tabular-nums text-white shadow dark:bg-slate-200 dark:text-slate-800">
                        {(obsP * 100).toFixed(1)}%
                      </div>
                    )}
                    {/* Observed bar */}
                    <div
                      className="min-w-0 flex-1 rounded-t-sm"
                      style={{
                        height: `${obsH}px`,
                        backgroundColor: isHovered
                          ? "rgb(2 132 199)"
                          : "rgb(14 165 233)",
                        transition: "background-color 0.15s",
                        transformOrigin: "bottom center",
                        animation: animKey
                          ? `barGrowUp 0.5s cubic-bezier(0.34,1.2,0.64,1) ${index * 0.06}s both`
                          : undefined,
                      }}
                    />
                    {/* Expected bar */}
                    {expected && showExpected && (
                      <div
                        className="min-w-0 flex-1 rounded-t-sm bg-emerald-500/80"
                        style={{
                          height: `${expH}px`,
                          transformOrigin: "bottom center",
                          animation: animKey
                            ? `barGrowUp 0.5s cubic-bezier(0.34,1.2,0.64,1) ${index * 0.06}s both`
                            : undefined,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis: dice faces + counts */}
          <div className="flex gap-1 px-1 pt-2">
            {labels.map((label, index) => {
              const diceValue = parseInt(label, 10);
              const isDice =
                showDiceFaces &&
                !Number.isNaN(diceValue) &&
                diceValue >= 1 &&
                diceValue <= 6;
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={label}
                  className="flex flex-1 cursor-pointer flex-col items-center gap-0.5"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {isDice ? (
                    <DiceFace value={diceValue} size={22} highlighted={isHovered} />
                  ) : (
                    <span
                      className={`text-xs transition-colors ${
                        isHovered
                          ? "text-slate-700 dark:text-slate-200"
                          : "text-slate-500"
                      }`}
                    >
                      {label}
                    </span>
                  )}
                  <span
                    className={`tabular-nums text-[10px] transition-colors ${
                      isHovered
                        ? "font-medium text-slate-600 dark:text-slate-300"
                        : "text-slate-400"
                    }`}
                  >
                    {Math.round(observed[index])}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
