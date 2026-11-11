import React, { useEffect, useRef } from 'react';

interface OrganicShaderCanvasProps {
  className?: string;
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  // 2D Simplex-style hash and noise for organic fluid motion
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
      -0.577350269189626,
      0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.52;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p * frequency);
      p = mat2(0.86, -0.5, 0.5, 0.86) * p * 1.92;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 st = vec2(uv.x * aspect, uv.y);
    vec2 mouse = vec2(u_mouse.x * aspect, u_mouse.y);

    float t = u_time * 0.09;

    // Subtle organic mouse influence
    float mouseDist = length(st - mouse);
    float mouseGlow = smoothstep(0.95, 0.0, mouseDist) * 0.18;
    vec2 mouseWarp = (st - mouse) * smoothstep(0.85, 0.0, mouseDist) * 0.09;

    // Domain warping for silk-like organic movement
    vec2 q = vec2(
      fbm(st * 0.85 + vec2(t * 0.55, t * 0.35) + mouseWarp),
      fbm(st * 0.85 + vec2(-t * 0.4, t * 0.5) - mouseWarp)
    );

    vec2 r = vec2(
      fbm(st * 1.05 + 1.15 * q + vec2(1.7, 9.2) + 0.25 * t),
      fbm(st * 1.05 + 1.15 * q + vec2(8.3, 2.8) + 0.21 * t)
    );

    float f = fbm(st * 0.75 + 1.25 * r);

    // Brand Palette of Ludmila Taquary:
    // 1. Deep Forest Olive (#2B391F)
    vec3 deepOlive = vec3(0.169, 0.224, 0.122);
    // 2. Signature Olive Green (#3F5030)
    vec3 oliveGreen = vec3(0.247, 0.314, 0.188);
    // 3. Soft Sage / Moss (#566844)
    vec3 softMoss = vec3(0.337, 0.408, 0.267);
    // 4. Warm Earthy Taupe / Clay (#8A7862)
    vec3 earthyTaupe = vec3(0.541, 0.471, 0.384);
    // 5. Warm Sand (#D8C9B6)
    vec3 warmSand = vec3(0.847, 0.788, 0.714);
    // 6. Soft Beige / Off-White (#EAE0D5)
    vec3 softBeige = vec3(0.918, 0.878, 0.835);

    // Base vertical & diagonal organic blend
    float blend1 = smoothstep(-0.65, 0.75, f + (uv.y * 0.35 - 0.15));
    float blend2 = smoothstep(-0.35, 0.85, q.x + r.y * 0.65);
    float blend3 = smoothstep(0.1, 0.95, r.x * 0.7 + uv.x * 0.35 + mouseGlow);

    vec3 color = mix(deepOlive, oliveGreen, blend1);
    color = mix(color, softMoss, blend2 * 0.65);
    color = mix(color, earthyTaupe, smoothstep(0.25, 0.85, f * 0.8 + q.y * 0.5) * 0.48);

    // Warm sand and beige light pools floating organically across the canvas
    float sandLight = smoothstep(0.18, 0.88, (f * 0.55 + 0.45) * (0.55 + 0.45 * sin(uv.x * 2.4 + r.x * 2.0 + t)));
    color = mix(color, warmSand, sandLight * 0.28 + mouseGlow * 0.45);
    color = mix(color, softBeige, pow(max(0.0, sandLight), 2.4) * 0.16);

    // Subtle vignette for depth and high-contrast editorial typography legibility
    float vignette = smoothstep(1.35, 0.28, length((uv - 0.5) * vec2(1.15, 1.05)));
    color *= mix(0.82, 1.04, vignette);

    // Subtle organic film grain so gradient feels tactile like fine paper
    float grain = (fract(sin(dot(uv * u_resolution + mod(u_time, 10.0), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.018;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const OrganicShaderCanvas: React.FC<OrganicShaderCanvasProps> = ({
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { antialias: false, alpha: false }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    let targetMouse = { x: 0.62, y: 0.54 };
    let currentMouse = { x: 0.62, y: 0.54 };

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / Math.max(window.innerWidth, 1);
      targetMouse.y = 1.0 - e.clientY / Math.max(window.innerHeight, 1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = mediaQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    let rafId = 0;
    const startTime = performance.now();

    const render = (now: number) => {
      handleResize();
      const elapsed = prefersReducedMotion ? 12.5 : (now - startTime) * 0.001;

      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.045;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.045;

      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, currentMouse.x, currentMouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`organic-shader-canvas ${className}`}
      aria-hidden="true"
    />
  );
};
