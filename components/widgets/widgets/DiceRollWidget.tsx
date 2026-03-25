"use client";

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
    <section className="not-prose my-8 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="m-0 text-base font-semibold">{title}</h3>
        <button
          type="button"
          onClick={reroll}
          className="rounded-md bg-sky-600 px-10 py-1.5 text-sm text-white hover:bg-sky-500"
        >
          サイコロをふる！
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
        <ProbabilityBarChart
          labels={["1", "2", "3", "4", "5", "6"]}
          observed={result.counts}
          expected={expectedCounts}
          observedLabel="実測"
          expectedLabel="理論値を表示する"
          animKey={animKey}
        />

        <div className="space-y-4">
          {/* Roll count: dice icon + slider + count */}
          <div className="flex items-center gap-2">
            <DiceFace value={6} size={22} />
            <input
              type="range"
              min={60}
              max={2400}
              step={60}
              value={rollCount}
            onChange={(event) => {
              const n = Number(event.target.value);
              setRollCount(n);
              if (hasRolled) {
                setResult(rollDice(normalizedProbabilities, n));
                setAnimKey((k) => k + 1);
              }
            }}
              className="flex-1"
            />
            <span className="w-10 text-right text-xs tabular-nums font-medium">
              {rollCount}
            </span>
          </div>

          {/* Outcome dice grid */}
          {hasRolled ? (
            <div>
              <p className="mb-2 text-xs font-medium text-slate-500">
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
                <p className="mt-1.5 text-[10px] text-slate-400">
                  ...他 {rollCount - 24} 個
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-xs text-slate-400">
              ↑ ボタンを押してふろう
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
