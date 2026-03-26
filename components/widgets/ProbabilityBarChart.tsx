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
    <div className="space-y-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <style>{`
        @keyframes barGrowUp {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      `}</style>
      {/* Legend + toggle */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5" style={{ color: "#5a5a7a" }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#60b8ff" }} />
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
              style={{
                position: "relative",
                display: "inline-flex",
                height: 18,
                width: 32,
                flexShrink: 0,
                alignItems: "center",
                borderRadius: 9999,
                transition: "background-color 0.2s",
                background: showExpected ? "#60b8ff" : "#1e1e30",
                outline: "none",
                border: "none",
                cursor: "pointer",
                boxShadow: showExpected ? "0 0 8px #60b8ff66" : "none",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  height: 14,
                  width: 14,
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  transition: "transform 0.2s",
                  transform: showExpected ? "translateX(18px)" : "translateX(2px)",
                }}
              />
            </button>
            <span style={{ color: showExpected ? "#c8ff64" : "#5a5a7a" }}>
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
                <span
                  style={{
                    fontSize: 9,
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                    color: "#4a4a6a",
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
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
            className="relative"
            style={{
              height: CHART_HEIGHT,
              borderBottom: "1px solid #3a3a5a",
              borderLeft: "1px solid #3a3a5a",
            }}
          >
            {/* Solid gridlines (skip 0 — that's the bottom border) */}
            {Y_TICKS.filter((t) => t > 0).map((tick) => {
              const topPx = CHART_HEIGHT - (tick / MAX_PROB) * CHART_HEIGHT;
              return (
                <div
                  key={tick}
                  className="pointer-events-none absolute inset-x-0"
                  style={{
                    top: `${topPx}px`,
                    borderTop: "1px solid #1e1e30",
                  }}
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
                      <div
                        className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap"
                        style={{
                          background: "#1e1e30",
                          border: "1px solid #3a3a5a",
                          color: "#e8e4d9",
                          borderRadius: 4,
                          padding: "2px 6px",
                          fontSize: 9,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {(obsP * 100).toFixed(1)}%
                      </div>
                    )}
                    {/* Observed bar */}
                    <div
                      className="min-w-0 flex-1 rounded-t-sm"
                      style={{
                        height: `${obsH}px`,
                        backgroundColor: isHovered ? "#3090e0" : "#60b8ff",
                        opacity: isHovered ? 0.9 : 0.7,
                        transition: "background-color 0.15s, opacity 0.15s",
                        boxShadow: isHovered ? "0 0 8px #60b8ff66" : "none",
                        transformOrigin: "bottom center",
                        animation: animKey
                          ? `barGrowUp 0.5s cubic-bezier(0.34,1.2,0.64,1) ${index * 0.06}s both`
                          : undefined,
                      }}
                    />
                    {/* Expected bar */}
                    {expected && showExpected && (
                      <div
                        className="min-w-0 flex-1 rounded-t-sm"
                        style={{
                          height: `${expH}px`,
                          backgroundColor: "#c8ff64",
                          opacity: 0.6,
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
                      className="text-xs transition-colors"
                      style={{ color: isHovered ? "#e8e4d9" : "#4a4a6a" }}
                    >
                      {label}
                    </span>
                  )}
                  <span
                    style={{
                      fontVariantNumeric: "tabular-nums",
                      fontSize: 10,
                      transition: "color 0.15s",
                      color: isHovered ? "#e8e4d9" : "#4a4a6a",
                      fontWeight: isHovered ? 500 : 400,
                    }}
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
