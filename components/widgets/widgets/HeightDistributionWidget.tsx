"use client";

import { useEffect, useMemo, useState } from "react";

type HeightDistributionWidgetProps = {
  title?: string;
};

type DistributionType = "normal" | "uniform" | "lognormal";

const X_MIN = 145;
const X_MAX = 195;

// SVG coordinate constants
const SVG_W = 360;
const SVG_H = 195;
const PLOT_X0 = 10;   // left edge of chart
const PLOT_X1 = 350;  // right edge
const AXIS_Y = 168;   // x-axis line y
const PLOT_TOP = 12;  // top of plot area

const X_TICKS = [150, 155, 160, 165, 170, 175, 180, 185, 190] as const;

function toSvgX(x: number) {
  return ((x - X_MIN) / (X_MAX - X_MIN)) * (PLOT_X1 - PLOT_X0) + PLOT_X0;
}
function toSvgY(y: number, maxY: number) {
  return AXIS_Y - (y / maxY) * (AXIS_Y - PLOT_TOP);
}

function createDataset(size: number) {
  const data: number[] = [];
  let seed = 1229;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < size; i += 1) {
    const u1 = Math.max(next(), 1e-7);
    const u2 = next();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    data.push(170 + z * 6.8);
  }

  return data.filter((value) => value >= X_MIN && value <= X_MAX);
}

function normalPdf(x: number, mu: number, sigma: number) {
  const safeSigma = Math.max(sigma, 0.3);
  const z = (x - mu) / safeSigma;
  return Math.exp(-(z * z) / 2) / (safeSigma * Math.sqrt(2 * Math.PI));
}

function uniformPdf(x: number, min: number, max: number) {
  const safeMin = Math.min(min, max - 0.2);
  const safeMax = Math.max(max, safeMin + 0.2);
  if (x < safeMin || x > safeMax) {
    return 0;
  }
  return 1 / (safeMax - safeMin);
}

function logNormalPdf(x: number, mu: number, sigma: number) {
  if (x <= 0) {
    return 0;
  }
  const safeSigma = Math.max(sigma, 0.05);
  const logX = Math.log(x);
  const z = (logX - mu) / safeSigma;
  return Math.exp(-(z * z) / 2) / (x * safeSigma * Math.sqrt(2 * Math.PI));
}

function evaluatePdf(
  type: DistributionType,
  x: number,
  params: { a: number; b: number }
) {
  if (type === "uniform") {
    return uniformPdf(x, params.a, params.b);
  }
  if (type === "lognormal") {
    return logNormalPdf(x, params.a, params.b);
  }
  return normalPdf(x, params.a, params.b);
}

function matchScore(
  data: number[],
  type: DistributionType,
  params: { a: number; b: number }
) {
  const epsilon = 1e-10;
  const averageLogLikelihood =
    data.reduce(
      (acc, value) => acc + Math.log(evaluatePdf(type, value, params) + epsilon),
      0
    ) / Math.max(data.length, 1);

  const scaled = ((averageLogLikelihood + 8) / 5.5) * 100;
  return Math.max(0, Math.min(100, scaled));
}

export function HeightDistributionWidget({
  title = "連続データの分布マッチ",
}: HeightDistributionWidgetProps) {
  const data = useMemo(() => createDataset(180), []);
  const [distribution, setDistribution] = useState<DistributionType>("normal");
  const [paramA, setParamA] = useState(170);
  const [paramB, setParamB] = useState(7);

  useEffect(() => {
    if (distribution === "normal") {
      setParamA(170);
      setParamB(7);
    } else if (distribution === "uniform") {
      setParamA(155);
      setParamB(185);
    } else {
      setParamA(5.13);
      setParamB(0.05);
    }
  }, [distribution]);

  const params = useMemo(() => ({ a: paramA, b: paramB }), [paramA, paramB]);

  const points = useMemo(() => {
    const result: Array<{ x: number; y: number }> = [];
    for (let x = X_MIN; x <= X_MAX; x += 0.5) {
      result.push({ x, y: evaluatePdf(distribution, x, params) });
    }
    return result;
  }, [distribution, params]);

  const maxY = Math.max(...points.map((point) => point.y), 0.0001);
  const score = useMemo(
    () => matchScore(data, distribution, params),
    [data, distribution, params]
  );
  const stroke =
    score >= 85 ? "#10b981" : score >= 60 ? "#eab308" : "#f43f5e";
  const fillColor =
    score >= 85 ? "#10b98122" : score >= 60 ? "#eab30820" : "#f43f5e18";

  // Build curve path
  const linePath = points
    .map((pt, i) => {
      const px = toSvgX(pt.x);
      const py = toSvgY(pt.y, maxY);
      return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
    })
    .join(" ");

  // Closed fill path: line + drop down to axis + close
  const firstPx = toSvgX(points[0].x).toFixed(1);
  const lastPx = toSvgX(points[points.length - 1].x).toFixed(1);
  const fillPath = `${linePath} L ${lastPx} ${AXIS_Y} L ${firstPx} ${AXIS_Y} Z`;

  // Param ranges by distribution
  const paramAConfig =
    distribution === "lognormal"
      ? { min: 4.9, max: 5.3, step: 0.01, label: "log-平均" }
      : distribution === "uniform"
        ? { min: 145, max: 193, step: 0.5, label: "最小値" }
        : { min: 150, max: 190, step: 0.5, label: "平均 μ" };

  const paramBConfig =
    distribution === "lognormal"
      ? { min: 0.01, max: 0.3, step: 0.01, label: "log-標準偏差 σ" }
      : distribution === "uniform"
        ? { min: paramA + 1, max: 195, step: 0.5, label: "最大値" }
        : { min: 1, max: 25, step: 0.5, label: "標準偏差 σ" };

  return (
    <section className="not-prose my-8 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
        {/* Chart */}
        <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-700">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="h-auto w-full"
            aria-label="分布グラフ"
          >
            {/* Vertical grid lines */}
            {X_TICKS.map((tick) => {
              const px = toSvgX(tick);
              return (
                <line
                  key={tick}
                  x1={px}
                  y1={PLOT_TOP}
                  x2={px}
                  y2={AXIS_Y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              );
            })}

            {/* X-axis */}
            <line
              x1={PLOT_X0}
              y1={AXIS_Y}
              x2={PLOT_X1}
              y2={AXIS_Y}
              stroke="#94a3b8"
              strokeWidth="1"
            />

            {/* X-axis tick labels */}
            {X_TICKS.map((tick) => {
              const px = toSvgX(tick);
              return (
                <text
                  key={tick}
                  x={px}
                  y={SVG_H - 3}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#94a3b8"
                >
                  {tick}
                </text>
              );
            })}

            {/* Fill under curve */}
            <path d={fillPath} fill={fillColor} />

            {/* Curve */}
            <path d={linePath} fill="none" stroke={stroke} strokeWidth="2.2" />

            {/* Data dots (rug plot) */}
            {data.map((value, index) => {
              const x = toSvgX(value);
              const y = AXIS_Y + 2 + (index % 3) * 2.2;
              return (
                <circle key={`h-${index}`} cx={x} cy={y} r="1.4" fill="#0ea5e9" opacity="0.7" />
              );
            })}
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Distribution selector */}
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">分布</p>
            <select
              value={distribution}
              onChange={(event) =>
                setDistribution(event.target.value as DistributionType)
              }
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
            >
              <option value="normal">正規分布</option>
              <option value="uniform">一様分布</option>
              <option value="lognormal">対数正規分布</option>
            </select>
          </div>

          {/* Param A slider */}
          <div>
            <div className="mb-0.5 flex justify-between text-xs">
              <span className="font-medium">{paramAConfig.label}</span>
              <span className="tabular-nums text-slate-500">{paramA.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={paramAConfig.min}
              max={paramAConfig.max}
              step={paramAConfig.step}
              value={paramA}
              onChange={(event) => setParamA(Number(event.target.value))}
              className="w-full"
            />
          </div>

          {/* Param B slider */}
          <div>
            <div className="mb-0.5 flex justify-between text-xs">
              <span className="font-medium">{paramBConfig.label}</span>
              <span className="tabular-nums text-slate-500">{paramB.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={paramBConfig.min}
              max={paramBConfig.max}
              step={paramBConfig.step}
              value={paramB}
              onChange={(event) => setParamB(Number(event.target.value))}
              className="w-full"
            />
          </div>

          {/* Match score */}
          <div>
            <div className="mb-1 flex justify-between text-xs font-medium">
              <span>マッチ度</span>
              <span>{score.toFixed(1)} / 100</span>
            </div>
            <div className="h-3 rounded bg-slate-100 dark:bg-slate-800">
              <div
                className="h-3 rounded transition-all duration-300"
                style={{ width: `${score}%`, backgroundColor: stroke }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
