"use client";

import type { CSSProperties, ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { DiceFace } from "@/components/widgets/DiceFace";
import { ProbabilityBarChart } from "@/components/widgets/ProbabilityBarChart";
import { ScoreRing } from "@/components/widgets/ScoreRing";

type DiceMatchWidgetProps = {
  title?: string;
  initialRolls?: number;
  hiddenProbabilities?: number[];
};

function normalize(values: number[]) {
  const clipped = values.map((value) => Math.max(value, 0.001));
  const total = clipped.reduce((acc, value) => acc + value, 0);
  return clipped.map((value) => value / total);
}

function sampleIndex(probabilities: number[]) {
  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i += 1) {
    cumulative += probabilities[i];
    if (random <= cumulative) {
      return i;
    }
  }
  return probabilities.length - 1;
}

function rollCounts(probabilities: number[], n: number) {
  const counts = new Array(probabilities.length).fill(0);
  for (let i = 0; i < n; i += 1) {
    counts[sampleIndex(probabilities)] += 1;
  }
  return counts;
}

function relativeMatchScore(observedFreq: number[], guessFreq: number[]) {
  const epsilon = 1e-8;
  const ll = observedFreq.reduce(
    (acc, observed, index) =>
      acc + observed * Math.log((guessFreq[index] ?? epsilon) + epsilon),
    0
  );
  const best = observedFreq.reduce(
    (acc, observed) => acc + observed * Math.log(observed + epsilon),
    0
  );

  return Math.max(0, Math.min(100, Math.exp(ll - best) * 100));
}

// Accent color per face pair: 1–2: blue, 3–4: purple, 5–6: pink
const FACE_ACCENT_COLORS: string[] = [
  "#60b8ff",
  "#60b8ff",
  "#c8a0f0",
  "#c8a0f0",
  "#f0a0c0",
  "#f0a0c0",
];

export function DiceMatchWidget({
  title = "確率分布マッチゲーム",
  initialRolls = 600,
  hiddenProbabilities = [0.13, 0.13, 0.13, 0.13, 0.15, 0.33],
}: DiceMatchWidgetProps) {
  const hidden = useMemo(() => normalize(hiddenProbabilities), [hiddenProbabilities]);
  const [rollCount, setRollCount] = useState(initialRolls);
  const [counts, setCounts] = useState(() => rollCounts(hidden, initialRolls));
  const [sliderValues, setSliderValues] = useState([1, 1, 1, 1, 1, 1]);
  const [rollBtnHover, setRollBtnHover] = useState(false);

  useEffect(() => {
    setCounts(rollCounts(hidden, rollCount));
  }, [hidden, rollCount]);

  const normalizedGuess = useMemo(() => normalize(sliderValues), [sliderValues]);
  const observedFreq = useMemo(
    () => counts.map((count) => count / Math.max(rollCount, 1)),
    [counts, rollCount]
  );
  const expectedCounts = useMemo(
    () => normalizedGuess.map((probability) => probability * rollCount),
    [normalizedGuess, rollCount]
  );
  const score = useMemo(
    () => relativeMatchScore(observedFreq, normalizedGuess),
    [observedFreq, normalizedGuess]
  );

  return (
    <section
      className="not-prose my-8"
      style={{
        fontFamily: "monospace",
        background: "#0d0d14",
        color: "#e8e4d9",
        borderRadius: 12,
        padding: "1.5rem",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .dmw-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 2px;
          background: #252535;
          outline: none;
          border-radius: 2px;
          cursor: pointer;
        }
        .dmw-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: 2px solid #0d0d14;
          box-shadow: 0 0 8px var(--thumb-color);
          cursor: pointer;
        }
        .dmw-slider::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: 2px solid #0d0d14;
          box-shadow: 0 0 8px var(--thumb-color);
          cursor: pointer;
        }
      `}</style>

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
          onClick={() => setCounts(rollCounts(hidden, rollCount))}
          onMouseEnter={() => setRollBtnHover(true)}
          onMouseLeave={() => setRollBtnHover(false)}
          style={{
            background: "#1a1a28",
            border: rollBtnHover ? "1px solid #60b8ff66" : "1px solid #3a3a5a",
            color: rollBtnHover ? "#60b8ff" : "#7777aa",
            boxShadow: rollBtnHover ? "0 0 8px #60b8ff44" : "none",
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
          gap: "1.2rem",
        }}
      >
        {/* Chart column */}
        <div>
          <ProbabilityBarChart
            labels={["1", "2", "3", "4", "5", "6"]}
            observed={counts}
            expected={expectedCounts}
            observedLabel="観測"
            expectedLabel="あなたの分布"
          />

          {/* Roll count slider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginTop: "1rem",
            }}
          >
            <DiceFace value={6} size={22} />
            <input
              type="range"
              min={120}
              max={2400}
              step={60}
              value={rollCount}
              className="dmw-slider"
              style={{ "--thumb-color": "#60b8ff", flex: 1 } as CSSProperties}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRollCount(Number(e.target.value))
              }
            />
            <span
              style={{
                width: "2.5rem",
                textAlign: "right",
                fontSize: "0.7rem",
                color: "#8888aa",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {rollCount}
            </span>
          </div>
        </div>

        {/* Controls column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {/* Score ring */}
          <div
            style={{
              background: "#10101a",
              border: "1px solid #1e1e30",
              borderRadius: 8,
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <div
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                color: "#5a5a7a",
                marginBottom: "0.3rem",
              }}
            >
              マッチ度
            </div>
            <ScoreRing score={score} color="#60b8ff" />
          </div>

          {/* Probability sliders */}
          <div
            style={{
              background: "#10101a",
              border: "1px solid #1e1e30",
              borderRadius: 8,
              padding: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                color: "#5a5a7a",
                marginBottom: "0.7rem",
              }}
            >
              p(1) ~ p(6) を調整
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem 0.75rem",
              }}
            >
              {sliderValues.map((value, index) => {
                const accentColor = FACE_ACCENT_COLORS[index];
                return (
                  <label key={`p-${index + 1}`} style={{ display: "block", fontSize: "0.7rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <DiceFace value={index + 1} size={18} />
                      <span
                        style={{
                          fontVariantNumeric: "tabular-nums",
                          color: "#8888aa",
                        }}
                      >
                        {normalizedGuess[index].toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.01}
                      max={2}
                      step={0.01}
                      value={value}
                      className="dmw-slider"
                      style={
                        { "--thumb-color": accentColor, width: "100%" } as CSSProperties
                      }
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const updated = [...sliderValues];
                        updated[index] = Number(e.target.value);
                        setSliderValues(updated);
                      }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
