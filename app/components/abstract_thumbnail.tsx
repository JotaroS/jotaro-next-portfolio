"use client";

import { useEffect, useRef, useState } from "react";

// Fullscreen triangle — cheaper than two triangles, no shared-edge seam.
const VERTEX_SHADER = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// Flowing, colorful abstract field: domain-warped value-noise fbm mapped
// through a cosine color palette. Smooth by construction — no hard bands.
const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  // Quintic (C2) interpolation — removes the faint grid seams that cubic
  // smoothstep leaves behind.
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Rotate each octave so the value-noise lattice never lines up with the
// axes across octaves — that axis alignment is what reads as square tiles.
const mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 6; i++) {
    v += amp * noise(p);
    p = ROT * p * 2.0;
    amp *= 0.5;
  }
  return v;
}

// Inigo Quilez cosine palette — smooth, controllable color ramp.
vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.55);
  vec3 b = vec3(0.45, 0.4, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.0, 0.15, 0.35);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  float minDim = min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / minDim;
  float t = uTime * 0.08;

  // Two-stage domain warp: the field folds over itself, giving smooth,
  // liquid, marbled motion instead of static noise.
  vec2 q = vec2(fbm(p * 1.6 + vec2(0.0, t)),
                fbm(p * 1.6 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.6 + 2.0 * q + vec2(1.7, 9.2) + t * 0.7),
                fbm(p * 1.6 + 2.0 * q + vec2(8.3, 2.8) - t * 0.5));

  float f = fbm(p * 1.6 + 3.0 * r);

  // Color from the warped field; the warp vectors tint it further.
  vec3 col = palette(f + 0.15 * length(q) + t * 0.3);
  col = mix(col, palette(length(r) + 0.4), 0.35);

  // Lift shadows a touch and add soft depth from the field value.
  col *= 0.55 + 0.6 * f;

  // Gentle vignette so edges settle into the card.
  col *= smoothstep(1.35, 0.25, length(p));

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

type AbstractThumbnailProps = {
  className?: string;
};

/**
 * Lightweight, dependency-free WebGL thumbnail: a slowly flowing, colorful
 * abstract field (domain-warped noise through a cosine palette). Used as the
 * Past Works placeholder image when a project has no `link_image` yet.
 */
export function AbstractThumbnail({ className }: AbstractThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = (canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }) ||
      canvas.getContext("experimental-webgl", { antialias: false, alpha: false })) as WebGLRenderingContext | null;

    if (!gl) {
      setSupported(false);
      return;
    }

    const program = linkProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) {
      setSupported(false);
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "aPosition");
    const resolutionLoc = gl.getUniformLocation(program, "uResolution");
    const timeLoc = gl.getUniformLocation(program, "uTime");

    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    let drawWidth = 1;
    let drawHeight = 1;
    // Cap DPR — this is a small decorative card, so 2x is cheap and keeps
    // the flowing field crisp without pixel stair-stepping.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      drawWidth = Math.max(1, Math.round(rect.width * dpr));
      drawHeight = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = drawWidth;
      canvas.height = drawHeight;
      gl.viewport(0, 0, drawWidth, drawHeight);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.05 });
    io.observe(container);

    let rafId = 0;
    let lastFrameTime = 0;
    const frameInterval = 1000 / 30; // 30fps cap — plenty for a slow-drifting field.
    const startTime = performance.now();

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);
      if (!visible || now - lastFrameTime < frameInterval) return;
      lastFrameTime = now;

      gl.useProgram(program);
      gl.uniform2f(resolutionLoc, drawWidth, drawHeight);
      gl.uniform1f(timeLoc, (now - startTime) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      io.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  if (!supported) {
    return (
      <div
        className={className}
        style={{ width: "100%", aspectRatio: "345 / 200", background: "linear-gradient(135deg, #2a1a4a, #1a3a5a, #3a2a1a)" }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", aspectRatio: "345 / 200", overflow: "hidden" }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
