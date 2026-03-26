"use client";

import type { CSSProperties, ChangeEvent } from "react";
import { useMemo, useState } from "react";

// ── 日本人身長データ（厚労省 国民健康・栄養調査 参考値）─────────────────────
const DATASETS = {
  male: {
    label: "男性（20代）",
    mu: 171.2,
    sigma: 5.9,
    color: "#60b8ff",
    accent: "#3090e0",
    emoji: "👨",
  },
  female: {
    label: "女性（20代）",
    mu: 158.5,
    sigma: 5.4,
    color: "#f0a0c0",
    accent: "#d06090",
    emoji: "👩",
  },
  mixed: {
    label: "混合（男女）",
    mu: 164.8,
    sigma: 8.2,
    color: "#c8a0f0",
    accent: "#9060d0",
    emoji: "👥",
  },
} as const;

type DatasetKey = keyof typeof DATASETS;

// ── ガウス分布 ─────────────────────────────────────────────────────────────────
function gauss(x: number, mu: number, sigma: number) {
  return (
    (1 / (sigma * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * ((x - mu) / sigma) ** 2)
  );
}

// Box-Muller サンプル生成
function genSamples(mu: number, sigma: number, n: number, seed: number) {
  const samples: number[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
  for (let i = 0; i < n; i += 2) {
    const u1 = rand() || 1e-10;
    const u2 = rand();
    const mag = sigma * Math.sqrt(-2 * Math.log(u1));
    samples.push(mu + mag * Math.cos(2 * Math.PI * u2));
    if (i + 1 < n) samples.push(mu + mag * Math.sin(2 * Math.PI * u2));
  }
  return samples;
}

// ヒストグラム bins
function makeBins(samples: number[], lo: number, hi: number, nBins: number) {
  const w = (hi - lo) / nBins;
  const counts = new Array(nBins).fill(0) as number[];
  samples.forEach((v) => {
    const i = Math.floor((v - lo) / w);
    if (i >= 0 && i < nBins) counts[i]++;
  });
  const total = samples.length;
  return counts.map((c, i) => ({
    x: lo + (i + 0.5) * w,
    lo: lo + i * w,
    hi: lo + (i + 1) * w,
    density: c / (total * w),
  }));
}

// フィットスコア（0~100）
function fitScore(
  bins: ReturnType<typeof makeBins>,
  mu: number,
  sigma: number
) {
  let sse = 0;
  let norm = 0;
  bins.forEach((b) => {
    const pred = gauss(b.x, mu, sigma);
    sse += (b.density - pred) ** 2;
    norm += pred ** 2;
  });
  const relErr = Math.sqrt(sse / (norm + 1e-10));
  return Math.max(0, Math.min(100, Math.round(100 * Math.exp(-relErr * 3))));
}

// ── SVG Chart ─────────────────────────────────────────────────────────────────
const W = 500,
  H = 220,
  PAD = { l: 44, r: 16, t: 16, b: 36 };
const CW = W - PAD.l - PAD.r;
const CH = H - PAD.t - PAD.b;

type Bin = { x: number; lo: number; hi: number; density: number };

function Chart({
  bins,
  muTrue,
  sigmaTrue,
  muUser,
  sigmaUser,
  lo,
  hi,
  color,
  accent,
  showTrue,
}: {
  bins: Bin[];
  muTrue: number;
  sigmaTrue: number;
  muUser: number;
  sigmaUser: number;
  lo: number;
  hi: number;
  color: string;
  accent: string;
  showTrue: boolean;
}) {
  const maxDens = Math.max(...bins.map((b) => b.density)) * 1.25;

  const px = (x: number) => PAD.l + ((x - lo) / (hi - lo)) * CW;
  const py = (y: number) => PAD.t + CH - (y / maxDens) * CH;

  const nCurve = 200;
  const makePts = (mu: number, sigma: number) =>
    Array.from({ length: nCurve }, (_, i) => {
      const x = lo + (i / (nCurve - 1)) * (hi - lo);
      return [px(x), py(gauss(x, mu, sigma))] as [number, number];
    });

  const truePts = makePts(muTrue, sigmaTrue);
  const userPts = makePts(muUser, sigmaUser);

  const pathD = (pts: [number, number][]) =>
    pts
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`
      )
      .join(" ");

  const fillD =
    pathD(userPts) +
    ` L${px(hi)},${py(0)} L${px(lo)},${py(0)} Z`;

  const step = hi - lo <= 40 ? 5 : 10;
  const ticks: number[] = [];
  for (
    let v = Math.ceil(lo / step) * step;
    v <= hi;
    v += step
  )
    ticks.push(v);

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: "block" }}
      aria-label="分布グラフ"
    >
      {/* Grid */}
      {[0.25, 0.5, 0.75, 1.0].map((t) => {
        const y = py(maxDens * t);
        return (
          <line
            key={t}
            x1={PAD.l}
            y1={y}
            x2={W - PAD.r}
            y2={y}
            stroke="#1e1e30"
            strokeWidth="1"
          />
        );
      })}

      {/* Histogram bars */}
      {bins.map((b, i) => {
        const bx = px(b.lo);
        const bw = Math.max(1, px(b.hi) - px(b.lo) - 1);
        const bh = (b.density / maxDens) * CH;
        return (
          <rect
            key={i}
            x={bx}
            y={py(b.density)}
            width={bw}
            height={bh}
            fill={color}
            opacity={0.35}
            rx={1}
          />
        );
      })}

      {/* User curve fill */}
      <path d={fillD} fill={`${accent}18`} />

      {/* True distribution — dashed (toggleable) */}
      {showTrue && (
        <path
          d={pathD(truePts)}
          fill="none"
          stroke="#ffffff40"
          strokeWidth="1.5"
          strokeDasharray="5,4"
        />
      )}

      {/* User curve */}
      <path
        d={pathD(userPts)}
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        style={{ filter: `drop-shadow(0 0 4px ${accent}88)` }}
      />

      {/* Axes */}
      <line
        x1={PAD.l}
        y1={PAD.t}
        x2={PAD.l}
        y2={PAD.t + CH}
        stroke="#3a3a5a"
        strokeWidth="1.5"
      />
      <line
        x1={PAD.l}
        y1={PAD.t + CH}
        x2={W - PAD.r}
        y2={PAD.t + CH}
        stroke="#3a3a5a"
        strokeWidth="1.5"
      />

      {/* X ticks */}
      {ticks.map((v) => (
        <g key={v}>
          <line
            x1={px(v)}
            y1={PAD.t + CH}
            x2={px(v)}
            y2={PAD.t + CH + 4}
            stroke="#3a3a5a"
            strokeWidth="1"
          />
          <text
            x={px(v)}
            y={PAD.t + CH + 16}
            textAnchor="middle"
            fill="#5a5a7a"
            fontSize="10"
            fontFamily="monospace"
          >
            {v}
          </text>
        </g>
      ))}

      {/* Y label */}
      <text
        x={12}
        y={PAD.t + CH / 2}
        textAnchor="middle"
        fill="#4a4a6a"
        fontSize="9"
        fontFamily="monospace"
        transform={`rotate(-90,12,${PAD.t + CH / 2})`}
      >
        density
      </text>

      {/* X label */}
      <text
        x={PAD.l + CW / 2}
        y={H - 2}
        textAnchor="middle"
        fill="#4a4a6a"
        fontSize="10"
        fontFamily="monospace"
      >
        身長 (cm)
      </text>

      {/* mu markers */}
      {showTrue && (
        <line
          x1={px(muTrue)}
          y1={PAD.t}
          x2={px(muTrue)}
          y2={PAD.t + CH}
          stroke="#ffffff30"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
      )}
      <line
        x1={px(muUser)}
        y1={PAD.t}
        x2={px(muUser)}
        y2={PAD.t + CH}
        stroke={`${accent}88`}
        strokeWidth="1.5"
        strokeDasharray="3,3"
      />
    </svg>
  );
}

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const R = 36,
    stroke = 7;
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
          strokeWidth={stroke}
        />
        <circle
          cx="45"
          cy="45"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
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
          {score}
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

// ── Main ──────────────────────────────────────────────────────────────────────
const N_SAMPLES = 800;
const N_BINS = 28;
const SEEDS: Record<DatasetKey, number> = { male: 42, female: 137, mixed: 99 };

export function HeightDistributionWidget() {
  const [datasetKey, setDatasetKey] = useState<DatasetKey>("male");
  const [muUser, setMuUser] = useState(165);
  const [sigUser, setSigUser] = useState(8);
  const [revealed, setRevealed] = useState(false);
  const [showTrue, setShowTrue] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  const ds = DATASETS[datasetKey as DatasetKey];
  const lo = ds.mu - 4.5 * ds.sigma;
  const hi = ds.mu + 4.5 * ds.sigma;

  const samples = useMemo(
    () => genSamples(ds.mu, ds.sigma, N_SAMPLES, SEEDS[datasetKey as DatasetKey]),
    [datasetKey, ds.mu, ds.sigma]
  );
  const bins = useMemo(
    () => makeBins(samples, lo, hi, N_BINS),
    [samples, lo, hi]
  );
  const score = useMemo(
    () => fitScore(bins, muUser, sigUser),
    [bins, muUser, sigUser]
  );

  const handleSliderChange = (newMu: number, newSig: number) => {
    const s = fitScore(bins, newMu, newSig);
    if (s > bestScore) setBestScore(s);
  };

  const handleDataset = (key: DatasetKey) => {
    setDatasetKey(key);
    setMuUser(165);
    setSigUser(8);
    setRevealed(false);
    setShowTrue(false);
    setBestScore(0);
  };

  return (
    <section className="not-prose my-8">
      <style>{`
        .hdw-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 2px;
          background: #252535;
          outline: none;
          border-radius: 2px;
          cursor: pointer;
        }
        .hdw-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: 2px solid #0d0d14;
          box-shadow: 0 0 8px var(--thumb-color);
          cursor: pointer;
        }
        .hdw-slider::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: 2px solid #0d0d14;
          box-shadow: 0 0 8px var(--thumb-color);
          cursor: pointer;
        }
        .hdw-ds-btn {
          background: #13131f;
          border: 1px solid #22223a;
          border-radius: 6px;
          color: #5a5a7a;
          font-size: 0.65rem;
          padding: 0.45rem 0.8rem;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: monospace;
        }
        .hdw-ds-btn:hover { border-color: #4a4a6a; color: #9999bb; }
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
            分布マッチングゲーム
          </h3>
          <p
            style={{
              fontSize: "0.68rem",
              color: "#7777aa",
              marginTop: "0.3rem",
              lineHeight: 1.7,
            }}
          >
            正規分布の{" "}
            <span style={{ color: "#60b8ff" }}>μ（平均）</span> と{" "}
            <span style={{ color: "#f0a0c0" }}>σ（標準偏差）</span>{" "}
            を調整して
            <br />
            ヒストグラムにぴったり重ねよう
          </p>
        </div>

        {/* Dataset selector */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.2rem",
            flexWrap: "wrap",
          }}
        >
          {(Object.entries(DATASETS) as [DatasetKey, (typeof DATASETS)[DatasetKey]][]).map(
            ([key, d]) => (
              <button
                key={key}
                className="hdw-ds-btn"
                onClick={() => handleDataset(key)}
                style={
                  datasetKey === key
                    ? {
                        borderColor: d.accent,
                        color: d.color,
                        background: `${d.accent}18`,
                        boxShadow: `0 0 8px ${d.accent}44`,
                      }
                    : {}
                }
              >
                {d.emoji} {d.label}
              </button>
            )
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 220px",
            gap: "1.2rem",
          }}
        >
          {/* Chart column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
            <div
              style={{
                background: "#10101a",
                border: "1px solid #1e1e30",
                borderRadius: 8,
                padding: "0.8rem",
                overflow: "hidden",
              }}
            >
              <Chart
                bins={bins}
                muTrue={ds.mu}
                sigmaTrue={ds.sigma}
                muUser={muUser}
                sigmaUser={sigUser}
                lo={lo}
                hi={hi}
                color={ds.color}
                accent={ds.accent}
                showTrue={showTrue}
              />

              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  paddingLeft: "0.5rem",
                  marginTop: "0.3rem",
                  fontSize: "0.6rem",
                  color: "#5a5a7a",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  <span
                    style={{
                      display: "inline-block",
                      width: 20,
                      height: 0,
                      borderTop: "2px dashed #ffffff40",
                      verticalAlign: "middle",
                      marginRight: 5,
                    }}
                  />
                  真の分布
                </span>
                <span>
                  <span
                    style={{
                      display: "inline-block",
                      width: 20,
                      height: 2,
                      background: ds.accent,
                      verticalAlign: "middle",
                      marginRight: 5,
                    }}
                  />
                  あなたの正規分布
                </span>
                <span>
                  <span
                    style={{
                      display: "inline-block",
                      width: 14,
                      height: 10,
                      background: ds.color,
                      opacity: 0.35,
                      verticalAlign: "middle",
                      marginRight: 5,
                      borderRadius: 1,
                    }}
                  />
                  データ
                </span>
              </div>
            </div>

            {/* Toggle true distribution */}
            <button
              onClick={() => setShowTrue((v: boolean) => !v)}
              style={{
                background: showTrue ? `${ds.accent}18` : "#1a1a28",
                border: `1px solid ${showTrue ? ds.accent + "66" : "#3a3a5a"}`,
                color: showTrue ? ds.color : "#7777aa",
                fontSize: "0.65rem",
                padding: "0.5rem",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "monospace",
                transition: "all 0.15s",
                boxShadow: showTrue ? `0 0 6px ${ds.accent}44` : "none",
              }}
            >
              {showTrue ? "👁 真の分布を隠す" : "👁 真の分布を表示する"}
            </button>

            {/* Reveal answer */}
            {!revealed ? (
              <button
                onClick={() => {
                  setRevealed(true);
                  setShowTrue(true);
                }}
                style={{
                  background: "#1a1a28",
                  border: "1px solid #3a3a5a",
                  color: "#7777aa",
                  fontSize: "0.65rem",
                  padding: "0.5rem",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  transition: "all 0.15s",
                }}
              >
                🔍 答えを見る（μ = ? , σ = ?）
              </button>
            ) : (
              <div
                style={{
                  background: "#13131f",
                  border: `1px solid ${ds.accent}44`,
                  borderRadius: 6,
                  padding: "0.7rem",
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.55rem",
                      color: "#5a5a7a",
                      marginBottom: "0.2rem",
                    }}
                  >
                    真の μ
                  </div>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      color: "#60b8ff",
                      fontWeight: 600,
                    }}
                  >
                    {ds.mu}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.55rem",
                      color: "#5a5a7a",
                      marginBottom: "0.2rem",
                    }}
                  >
                    真の σ
                  </div>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      color: "#f0a0c0",
                      fontWeight: 600,
                    }}
                  >
                    {ds.sigma}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: "#5a5a7a",
                    lineHeight: 1.7,
                  }}
                >
                  {ds.emoji} {ds.label}の
                  <br />
                  実測値（参考値）
                </div>
              </div>
            )}
          </div>

          {/* Controls column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
          >
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
                フィットスコア
              </div>
              <ScoreRing score={score} color={ds.accent} />
              <div
                style={{
                  marginTop: "1.5rem",
                  fontSize: "0.58rem",
                  color: "#4a4a6a",
                  textAlign: "center",
                }}
              >
                ベスト:{" "}
                <span style={{ color: ds.color }}>{bestScore}</span>
              </div>
            </div>

            {/* Sliders */}
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
                  marginBottom: "0.9rem",
                }}
              >
                パラメータ
              </div>

              {/* mu slider */}
              <div style={{ marginBottom: "1.1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "#60b8ff",
                      fontWeight: 600,
                    }}
                  >
                    μ　平均
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#e8e4d9" }}>
                    {muUser.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="140"
                  max="190"
                  step="0.5"
                  value={muUser}
                  className="hdw-slider"
                  style={
                    { "--thumb-color": "#60b8ff" } as CSSProperties
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const v = parseFloat(e.target.value);
                    setMuUser(v);
                    handleSliderChange(v, sigUser);
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.52rem",
                    color: "#2a2a45",
                    marginTop: "0.2rem",
                  }}
                >
                  <span>140</span>
                  <span>190</span>
                </div>
              </div>

              {/* sigma slider */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "#f0a0c0",
                      fontWeight: 600,
                    }}
                  >
                    σ　標準偏差
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#e8e4d9" }}>
                    {sigUser.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={sigUser}
                  className="hdw-slider"
                  style={
                    { "--thumb-color": "#f0a0c0" } as CSSProperties
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const v = parseFloat(e.target.value);
                    setSigUser(v);
                    handleSliderChange(muUser, v);
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.52rem",
                    color: "#2a2a45",
                    marginTop: "0.2rem",
                  }}
                >
                  <span>狭い (1)</span>
                  <span>広い (20)</span>
                </div>
              </div>
            </div>

            {/* Insight box */}
            <div
              style={{
                background: "#0f0f1e",
                border: "1px solid #1e1e30",
                borderLeft: "3px solid #ffcc44",
                borderRadius: 6,
                padding: "0.8rem",
                fontSize: "0.62rem",
                color: "#5a5a7a",
                lineHeight: 1.9,
              }}
            >
              <span style={{ color: "#ffcc44", fontWeight: 600 }}>
                尤度とは：
              </span>
              <br />
              「このパラメータで
              <br />
              このデータが生まれる
              <br />
              もっともらしさ」
              <br />
              スコアを最大化するのが{" "}
              <span style={{ color: "#c8ff64" }}>最尤推定</span>。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
