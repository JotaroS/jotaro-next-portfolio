"use client";

import { useEffect, useMemo, useState } from "react";
import { DiceFace } from "@/components/widgets/DiceFace";
import { ProbabilityBarChart } from "@/components/widgets/ProbabilityBarChart";

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

export function DiceMatchWidget({
  title = "確率分布マッチゲーム",
  initialRolls = 600,
  hiddenProbabilities = [0.13, 0.13, 0.13, 0.13, 0.15, 0.33],
}: DiceMatchWidgetProps) {
  const hidden = useMemo(() => normalize(hiddenProbabilities), [hiddenProbabilities]);
  const [rollCount, setRollCount] = useState(initialRolls);
  const [counts, setCounts] = useState(() => rollCounts(hidden, initialRolls));
  const [sliderValues, setSliderValues] = useState([1, 1, 1, 1, 1, 1]);

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

  const scoreColor =
    score >= 85 ? "bg-emerald-500" : score >= 60 ? "bg-yellow-500" : "bg-rose-500";

  return (
    <section className="not-prose my-8 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="m-0 text-base font-semibold">{title}</h3>
        <button
          type="button"
          onClick={() => setCounts(rollCounts(hidden, rollCount))}
          className="rounded-md bg-sky-600 px-10 py-1.5 text-sm text-white hover:bg-sky-500"
        >
          サイコロをふる！
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
        <ProbabilityBarChart
          labels={["1", "2", "3", "4", "5", "6"]}
          observed={counts}
          expected={expectedCounts}
          observedLabel="観測"
          expectedLabel="あなたの分布"
        />

        <div className="space-y-4">
          {/* Roll count: dice icon + slider + count */}
          <div className="flex items-center gap-2">
            <DiceFace value={6} size={22} />
            <input
              type="range"
              min={120}
              max={2400}
              step={60}
              value={rollCount}
              onChange={(event) => setRollCount(Number(event.target.value))}
              className="flex-1"
            />
            <span className="w-10 text-right text-xs tabular-nums font-medium">
              {rollCount}
            </span>
          </div>

          {/* Probability sliders */}
          <div>
            <p className="mb-2 text-xs font-medium">p(1) ~ p(6) を調整</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {sliderValues.map((value, index) => (
                <label key={`p-${index + 1}`} className="block text-xs">
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <DiceFace value={index + 1} size={18} />
                    <span className="tabular-nums text-slate-500">
                      {normalizedGuess[index].toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.01}
                    max={2}
                    step={0.01}
                    value={value}
                    onChange={(event) => {
                      const updated = [...sliderValues];
                      updated[index] = Number(event.target.value);
                      setSliderValues(updated);
                    }}
                    className="w-full"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Match score */}
          <div>
            <div className="mb-1 flex justify-between text-xs font-medium">
              <span>マッチ度</span>
              <span>{score.toFixed(1)} / 100</span>
            </div>
            <div className="h-3 rounded bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-3 rounded transition-all ${scoreColor}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
