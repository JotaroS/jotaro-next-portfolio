"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { DiceFace } from "@/components/widgets/DiceFace";
import { ProbabilityBarChart } from "@/components/widgets/ProbabilityBarChart";

type DiceRollWidgetProps = {
  title?: string;
  initialRolls?: number;
  probabilities?: number[];
};

function normalizeProbabilities(values: number[]) {
  const safe = values.map((value) => Math.max(0, value));
  const sum = safe.reduce((acc, value) => acc + value, 0);
  if (!sum) {
    return new Array(values.length).fill(1 / values.length);
  }
  return safe.map((value) => value / sum);
}

function sampleOne(probabilities: number[]) {
  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i += 1) {
    cumulative += probabilities[i];
    if (random <= cumulative) {
      return i + 1;
    }
  }
  return probabilities.length;
}

function rollDice(probabilities: number[], count: number) {
  const outcomes: number[] = [];
  const counts = new Array(probabilities.length).fill(0);

  for (let i = 0; i < count; i += 1) {
    const value = sampleOne(probabilities);
    outcomes.push(value);
    counts[value - 1] += 1;
  }

  return { outcomes, counts };
}

export function DiceRollWidget({
  title = "サイコロシミュレーション",
  initialRolls = 600,
  probabilities = [1, 1, 1, 1, 1, 1],
}: DiceRollWidgetProps) {
  const normalizedProbabilities = useMemo(
    () => normalizeProbabilities(probabilities),
    [probabilities]
  );
  const [rollCount, setRollCount] = useState(initialRolls);
  const [hasRolled, setHasRolled] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof rollDice>>(() => ({
    outcomes: [],
    counts: new Array(probabilities.length).fill(0),
  }));
  const [btnHover, setBtnHover] = useState(false);

  const expectedCounts = useMemo(
    () => normalizedProbabilities.map((value) => value * rollCount),
    [normalizedProbabilities, rollCount]
  );

  const reroll = () => {
    setResult(rollDice(normalizedProbabilities, rollCount));
    setHasRolled(true);
    setAnimKey((k) => k + 1);
  };

  return (
    <section className="not-prose my-8">
      <style>{`
        .drw-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 2px;
          background: #252535;
          outline: none;
          border-radius: 2px;
          cursor: pointer;
        }
        .drw-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: 2px solid #0d0d14;
          box-shadow: 0 0 8px var(--thumb-color);
          cursor: pointer;
        }
        .drw-slider::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: 2px solid #0d0d14;
          box-shadow: 0 0 8px var(--thumb-color);
          cursor: pointer;
        }
      `}</style>

      <div
        style={{
          fontFamily: "monospace",
          background: "#0d0d14",
          color: "#e8e4d9",
          borderRadius: 12,
          padding: "1.5rem",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderLeft: "3px solid #ffcc44",
            paddingLeft: "0.8rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              color: "#5a5a7a",
              marginBottom: "0.2rem",
            }}
          >
            インタラクティブ
          </div>
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "#e8e4d9",
            }}
          >
            {title}
          </h3>
        </div>

        {/* Roll button */}
        <div style={{ marginBottom: "1.2rem" }}>
          <button
            type="button"
            onClick={reroll}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              background: "#1a1a28",
              border: btnHover ? "1px solid #60b8ff66" : "1px solid #3a3a5a",
              color: btnHover ? "#60b8ff" : "#7777aa",
              boxShadow: btnHover ? "0 0 8px #60b8ff44" : "none",
              fontSize: "0.75rem",
              padding: "0.5rem 2.5rem",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "monospace",
              transition: "all 0.15s",
            }}
          >
            サイコロをふる！
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1.25rem",
          }}
        >
          <ProbabilityBarChart
            labels={["1", "2", "3", "4", "5", "6"]}
            observed={result.counts}
            expected={expectedCounts}
            observedLabel="実測"
            expectedLabel="理論値を表示する"
            animKey={animKey}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Roll count: dice icon + slider + count */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <DiceFace value={6} size={22} />
              <input
                type="range"
                min={60}
                max={2400}
                step={60}
                value={rollCount}
                className="drw-slider"
                style={
                  { "--thumb-color": "#60b8ff", flex: 1 } as CSSProperties
                }
                onChange={(event) => {
                  const n = Number(event.target.value);
                  setRollCount(n);
                  if (hasRolled) {
                    setResult(rollDice(normalizedProbabilities, n));
                    setAnimKey((k) => k + 1);
                  }
                }}
              />
              <span
                style={{
                  width: "2.5rem",
                  textAlign: "right",
                  fontSize: "0.7rem",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 500,
                  color: "#8888aa",
                }}
              >
                {rollCount}
              </span>
            </div>

            {/* Outcome dice grid */}
            {hasRolled ? (
              <div>
                <p
                  style={{
                    marginBottom: "0.5rem",
                    marginTop: 0,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    color: "#8888aa",
                  }}
                >
                  最初の24個の結果
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {result.outcomes.slice(0, 24).map((value, index) => (
                    <DiceFace
                      // biome-ignore lint/suspicious/noArrayIndexKey: stable slice
                      key={`${animKey}-${index}`}
                      value={value}
                      size={30}
                    />
                  ))}
                </div>
                {rollCount > 24 && (
                  <p
                    style={{
                      marginTop: "0.375rem",
                      marginBottom: 0,
                      fontSize: "0.625rem",
                      color: "#7777aa",
                    }}
                  >
                    ...他 {rollCount - 24} 個
                  </p>
                )}
              </div>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  color: "#7777aa",
                  margin: 0,
                }}
              >
                ↑ ボタンを押してふろう
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
