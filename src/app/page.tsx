"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Scene data ───────────────────────────────────────────────────────────────
const CLUSTER_LABELS = [
  { id: "discover",   text: "DISCOVER",    sub: "Explore subjects",    world: [-32, 4, -12] as [number, number, number], href: "/dashboard" },
  { id: "study",      text: "STUDY",       sub: "Chapter content",     world: [28,  3, -22] as [number, number, number], href: "/dashboard" },
  { id: "practice",   text: "PRACTICE",    sub: "AI assessments",      world: [33,  2,  18] as [number, number, number], href: "/dashboard" },
  { id: "progress",   text: "PROGRESS",    sub: "Track your journey",  world: [-28, 3,  22] as [number, number, number], href: "/leaderboard" },
  { id: "console",    text: "CONSOLE",     sub: "Study tools",         world: [4,   2, -42] as [number, number, number], href: "/login" },
];

const CAM = [
  { pos: [0,   80, 30] as const, look: [0, 0, 0] as const },
  { pos: [-18, 32, 38] as const, look: [0, 0, 0] as const },
  { pos: [8,    3, 48] as const, look: [0, 3, 0] as const },
];

interface Label2D {
  id: string; text: string; sub: string; href: string;
  x: number; y: number; visible: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DCGalaxyPage() {
  const mountRef  = useRef<HTMLDivElement>(null);
  const internals = useRef<{
    camera?: any; renderer?: any; composer?: any; galaxy?: any; clock?: any;
    targetPos:    { x: number; y: number; z: number };
    targetLook:   { x: number; y: number; z: number };
    currentLook:  { x: number; y: number; z: number };
    currentState: number;
    raf:          number;
    cleanupResize?: () => void;
  }>({
    targetPos:    { x: 0, y: 80, z: 30 },
    targetLook:   { x: 0, y: 0,  z: 0  },
    currentLook:  { x: 0, y: 0,  z: 0  },
    currentState: 0,
    raf:          0,
  });

  const [progress, setProgress] = useState(0);
  const [loaded,   setLoaded]   = useState(false);
  const [camState, setCamState] = useState(0);
  const [labels,   setLabels]   = useState<Label2D[]>([]);
  const router = useRouter();

  // ── Three.js init ──────────────────────────────────────────────────────────
  useEffect(() => {
    let dead = false;

    (async () => {
      const THREE = await import("three");
      if (dead || !mountRef.current) return;

      // Optional bloom (graceful fallback if import fails)
      let Composer: any, RenderPassCls: any, BloomCls: any;
      try {
        ({ EffectComposer: Composer }    = await import("three/examples/jsm/postprocessing/EffectComposer.js"));
        ({ RenderPass:  RenderPassCls } = await import("three/examples/jsm/postprocessing/RenderPass.js"));
        ({ UnrealBloomPass: BloomCls }  = await import("three/examples/jsm/postprocessing/UnrealBloomPass.js"));
      } catch { /* run without bloom */ }

      if (dead || !mountRef.current) return;
      const el = mountRef.current;
      const W  = el.clientWidth;
      const H  = el.clientHeight;

      // Scene & camera
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
      camera.position.set(0, 80, 30);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      Object.assign(renderer.domElement.style, { position: "absolute", top: "0", left: "0" });
      el.appendChild(renderer.domElement);

      // Bloom composer
      let composer: any = null;
      if (Composer && RenderPassCls && BloomCls) {
        composer = new Composer(renderer);
        composer.addPass(new RenderPassCls(scene, camera));
        const bloom = new BloomCls(new THREE.Vector2(W, H), 1.9, 0.55, 0.04);
        composer.addPass(bloom);
      }

      // ── Galaxy geometry ──────────────────────────────────────────────────────
      const N     = 160_000;
      const MAX_R = 65;
      const ARMS  = 4;
      const pos   = new Float32Array(N * 3);
      const col   = new Float32Array(N * 3);

      // Box-Muller Gaussian
      const gauss = () => {
        let u = 0, v = 0;
        while (!u) u = Math.random();
        while (!v) v = Math.random();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      };

      for (let i = 0; i < N; i++) {
        const i3  = i * 3;
        let x = 0, y = 0, z = 0;

        if (Math.random() < 0.1) {
          // Bright core cluster
          const r  = Math.random() ** 1.5 * 7;
          const th = Math.random() * Math.PI * 2;
          const ph = Math.acos(2 * Math.random() - 1);
          x = r * Math.sin(ph) * Math.cos(th);
          y = r * Math.sin(ph) * Math.sin(th) * 0.10;
          z = r * Math.cos(ph);
        } else {
          // Spiral arm
          const arm       = Math.floor(Math.random() * ARMS);
          const baseAngle = (arm / ARMS) * Math.PI * 2;
          const r         = Math.random() ** 0.45 * MAX_R;
          let   angle     = baseAngle + (r / MAX_R) * 3.6;
          angle += gauss() * ((r / MAX_R) * 0.42 + 0.06);
          x = r * Math.cos(angle);
          y = gauss() * (1.2 - r / MAX_R) * 0.45;
          z = r * Math.sin(angle);
        }

        pos[i3] = x; pos[i3 + 1] = y; pos[i3 + 2] = z;

        // Colour: white core → neon green → dark outer
        const d = Math.sqrt(x * x + z * z) / MAX_R;
        let r_ = 0, g_ = 0, b_ = 0;
        if (d < 0.04) {
          r_ = 1; g_ = 1; b_ = 1;
        } else if (d < 0.14) {
          const t = (d - 0.04) / 0.10;
          r_ = 1 - t * 0.55; g_ = 1; b_ = 1 - t;
        } else if (d < 0.38) {
          const t = (d - 0.14) / 0.24;
          r_ = 0.45 - t * 0.38; g_ = 1; b_ = 0.45 - t * 0.40;
        } else {
          const t = Math.min((d - 0.38) / 0.62, 1);
          r_ = 0.07 * (1 - t); g_ = 0.48 - t * 0.44; b_ = 0.07 * (1 - t);
        }
        col[i3] = r_; col[i3 + 1] = g_; col[i3 + 2] = b_;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.09, vertexColors: true, sizeAttenuation: true,
        transparent: true, opacity: 0.88,
        depthWrite: false, blending: THREE.AdditiveBlending,
      });

      const galaxy = new THREE.Points(geo, mat);
      scene.add(galaxy);

      // Save into ref
      internals.current.camera   = camera;
      internals.current.renderer = renderer;
      internals.current.composer = composer;
      internals.current.galaxy   = galaxy;
      internals.current.clock    = new THREE.Clock();

      // Resize
      const onResize = () => {
        const W = el.clientWidth, H = el.clientHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
        composer?.setSize(W, H);
      };
      window.addEventListener("resize", onResize);
      internals.current.cleanupResize = () => window.removeEventListener("resize", onResize);

      // Fake loading progress
      let p = 0;
      const iv = setInterval(() => {
        p = Math.min(p + Math.random() * 18 + 6, 100);
        if (!dead) setProgress(p);
        if (p >= 100) {
          clearInterval(iv);
          setTimeout(() => { if (!dead) setLoaded(true); }, 700);
        }
      }, 90);

      // ── Render loop ──────────────────────────────────────────────────────────
      const lookV = new THREE.Vector3();
      const projV = new THREE.Vector3();
      let frame   = 0;

      const animate = () => {
        if (dead) return;
        internals.current.raf = requestAnimationFrame(animate);
        frame++;

        const { targetPos, targetLook, currentLook, clock } = internals.current;
        const t = clock.getElapsedTime();

        galaxy.rotation.y = t * 0.018;

        // Smooth camera lerp
        camera.position.x += (targetPos.x - camera.position.x) * 0.03;
        camera.position.y += (targetPos.y - camera.position.y) * 0.03;
        camera.position.z += (targetPos.z - camera.position.z) * 0.03;

        currentLook.x += (targetLook.x - currentLook.x) * 0.03;
        currentLook.y += (targetLook.y - currentLook.y) * 0.03;
        currentLook.z += (targetLook.z - currentLook.z) * 0.03;

        lookV.set(currentLook.x, currentLook.y, currentLook.z);
        camera.lookAt(lookV);

        // Project 3-D label positions to screen every 4th frame
        if (frame % 4 === 0) {
          const W  = el.clientWidth;
          const H  = el.clientHeight;
          const nl = CLUSTER_LABELS.map(lb => {
            projV.set(lb.world[0], lb.world[1], lb.world[2]);
            projV.project(camera);
            return {
              ...lb,
              x:       (projV.x *  0.5 + 0.5) * W,
              y:       (projV.y * -0.5 + 0.5) * H,
              visible: projV.z < 1,
            };
          });
          setLabels(nl);
        }

        if (composer) composer.render();
        else renderer.render(scene, camera);
      };
      animate();
    })();

    return () => {
      dead = true;
      const { raf, renderer, cleanupResize } = internals.current;
      if (raf) cancelAnimationFrame(raf);
      cleanupResize?.();
      if (renderer?.domElement?.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, []);

  // ── Camera state machine ───────────────────────────────────────────────────
  const goCam = useCallback((s: number) => {
    const c = CAM[s];
    if (!c) return;
    internals.current.targetPos    = { x: c.pos[0],  y: c.pos[1],  z: c.pos[2]  };
    internals.current.targetLook   = { x: c.look[0], y: c.look[1], z: c.look[2] };
    internals.current.currentState = s;
    setCamState(s);
  }, []);

  // Scroll to advance states
  useEffect(() => {
    let acc = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      acc += e.deltaY;
      if (acc >  260) { goCam(Math.min(internals.current.currentState + 1, 2)); acc = 0; }
      if (acc < -260) { goCam(Math.max(internals.current.currentState - 1, 0)); acc = 0; }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goCam]);

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000", overflow: "hidden",
      fontFamily: "'Inter', 'Space Grotesk', -apple-system, sans-serif",
    }}>
      {/* Three.js canvas mount */}
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

      {/* ── Preloader ──────────────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 100, background: "#000",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22,
        opacity: loaded ? 0 : 1, pointerEvents: loaded ? "none" : "all",
        transition: "opacity 1s ease",
      }}>
        {/* Circular progress ring */}
        <div style={{ position: "relative", width: 76, height: 76 }}>
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="38" cy="38" r="32" fill="none" stroke="rgba(0,255,102,0.10)" strokeWidth="2" />
            <circle
              cx="38" cy="38" r="32" fill="none" stroke="#00FF66" strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress / 100)}`}
              style={{
                transition: "stroke-dashoffset 0.12s ease",
                filter: "drop-shadow(0 0 6px #00FF66) drop-shadow(0 0 14px rgba(0,255,102,0.4))",
              }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#00FF66", letterSpacing: "0.06em",
          }}>
            {Math.round(progress)}%
          </div>
        </div>
        <div style={{ fontSize: 9, letterSpacing: "0.55em", color: "rgba(0,255,102,0.4)", textTransform: "uppercase" }}>
          Initialising DC
        </div>
      </div>

      {/* ── Main UI overlay ────────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        opacity: loaded ? 1 : 0, transition: "opacity 1.2s ease 0.3s",
        pointerEvents: loaded ? "all" : "none",
      }}>

        {/* ── Navbar ─────────────────────────────────────────────────────────── */}
        <nav style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 44px",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: "#00FF66",
              boxShadow: "0 0 10px #00FF66, 0 0 22px rgba(0,255,102,0.4)",
            }} />
            <span style={{
              fontSize: 12, fontWeight: 700, color: "rgba(0,255,102,0.85)", letterSpacing: "0.38em",
            }}>DC</span>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", gap: 34, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.22em", fontWeight: 500 }}>
            {([["SUBJECTS", "/dashboard"], ["CHAPTERS", "/dashboard"], ["LEADERBOARD", "/leaderboard"]] as const).map(([l, h]) => (
              <Link key={l} href={h} style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#00FF66"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}
              >{l}</Link>
            ))}
          </div>

          {/* CTA */}
          <Link href="/login" style={{
            padding: "9px 22px", borderRadius: 40, fontSize: 10, fontWeight: 700,
            border: "1px solid rgba(0,255,102,0.35)", color: "#00FF66", textDecoration: "none",
            letterSpacing: "0.25em", background: "rgba(0,255,102,0.04)", transition: "all 0.25s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(0,255,102,0.14)"; el.style.borderColor = "rgba(0,255,102,0.6)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(0,255,102,0.04)"; el.style.borderColor = "rgba(0,255,102,0.35)"; }}
          >LAUNCH APP</Link>
        </nav>

        {/* ── STATE 0: Hero ───────────────────────────────────────────────────── */}
        {camState === 0 && (
          <>
            {/* Central headline */}
            <div style={{
              position: "absolute", top: "42%", left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center", pointerEvents: "none", userSelect: "none",
            }}>
              <h1 style={{
                margin: 0, lineHeight: 0.88,
                fontSize: "clamp(90px, 15vw, 170px)",
                fontWeight: 900, letterSpacing: "0.14em", color: "#fff",
                textShadow: "0 0 70px rgba(0,255,102,0.35), 0 0 140px rgba(0,255,102,0.14), 0 0 240px rgba(0,255,102,0.06)",
              }}>DC</h1>
              <p style={{
                margin: "18px 0 0", fontSize: "clamp(10px, 1.15vw, 13px)",
                color: "rgba(255,255,255,0.42)", letterSpacing: "0.28em", fontWeight: 400,
              }}>Designing the AI Learning System for Class 1–12.</p>
            </div>

            {/* Bottom row */}
            <div style={{
              position: "absolute", bottom: 38, left: 0, right: 0,
              display: "flex", justifyContent: "space-between", alignItems: "flex-end",
              padding: "0 44px",
            }}>
              <p style={{
                margin: 0, maxWidth: 270, fontSize: 11,
                color: "rgba(255,255,255,0.22)", lineHeight: 1.95, letterSpacing: "0.07em",
              }}>
                A complete AI-powered education system.<br />
                Every class. Every subject. Every chapter.<br />
                Generated live, just for you.
              </p>
              <div style={{ textAlign: "right" }}>
                <button onClick={() => goCam(1)} style={{
                  background: "none", border: "1px solid rgba(0,255,102,0.38)",
                  color: "#00FF66", padding: "13px 34px", borderRadius: 2,
                  fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: "0.38em",
                  boxShadow: "0 0 28px rgba(0,255,102,0.08), inset 0 0 24px rgba(0,255,102,0.03)",
                  transition: "all 0.3s",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(0,255,102,0.08)";
                    el.style.boxShadow  = "0 0 44px rgba(0,255,102,0.22), inset 0 0 32px rgba(0,255,102,0.06)";
                    el.style.borderColor = "rgba(0,255,102,0.7)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "none";
                    el.style.boxShadow  = "0 0 28px rgba(0,255,102,0.08), inset 0 0 24px rgba(0,255,102,0.03)";
                    el.style.borderColor = "rgba(0,255,102,0.38)";
                  }}
                >EXPLORE SYSTEM</button>
                <div style={{ marginTop: 10, fontSize: 9, color: "rgba(255,255,255,0.16)", letterSpacing: "0.28em" }}>
                  SCROLL TO NAVIGATE ↓
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── STATE 1: Cluster / Roadmap ─────────────────────────────────────── */}
        {camState === 1 && (
          <>
            <div style={{
              position: "absolute", top: "11%", left: "50%",
              transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none",
            }}>
              <div style={{ fontSize: 9, color: "rgba(0,255,102,0.5)", letterSpacing: "0.52em", marginBottom: 10 }}>
                THE DC NEXGEN
              </div>
              <h2 style={{ margin: 0, fontSize: "clamp(20px, 2.8vw, 34px)", fontWeight: 600, color: "white", letterSpacing: "0.08em" }}>
                Study in five steps.
              </h2>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", marginTop: 8, letterSpacing: "0.35em" }}>
                ROADMAP
              </div>
            </div>

            {/* Floating cluster labels projected from 3-D world space */}
            {labels.map(lb => lb.visible && (
              <div key={lb.id}
                onClick={() => router.push(lb.href)}
                style={{
                  position: "absolute", left: lb.x, top: lb.y,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer", textAlign: "center",
                }}
              >
                <div style={{
                  width: 5, height: 5, borderRadius: "50%", background: "#00FF66",
                  margin: "0 auto 9px",
                  boxShadow: "0 0 8px #00FF66, 0 0 18px rgba(0,255,102,0.55)",
                }} />
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.28em", whiteSpace: "nowrap" }}>
                  {lb.text}
                </div>
                <div style={{ fontSize: 9, color: "rgba(0,255,102,0.45)", letterSpacing: "0.08em", marginTop: 3 }}>
                  {lb.sub}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── STATE 2: Immersive / Inside galaxy ────────────────────────────── */}
        {camState === 2 && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "0 68px",
          }}>
            <div style={{
              fontSize: "clamp(14px, 1.8vw, 22px)",
              color: "rgba(255,255,255,0.42)", lineHeight: 2.3, letterSpacing: "0.05em", marginBottom: 58,
            }}>
              Twelve classes.<br />Fifty subjects.<br />Unlimited knowledge.
            </div>
            <div style={{ display: "flex", gap: 60, flexWrap: "wrap", marginBottom: 62 }}>
              {[
                "Three views. One platform.\nAI-powered content.",
                "Live across twelve classes,\nevery subject, every chapter.",
                "Real assessments.\nAI feedback. Instant results.",
              ].map((t, i) => (
                <div key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.95, maxWidth: 195, letterSpacing: "0.06em", whiteSpace: "pre-line" }}>
                  {t}
                </div>
              ))}
            </div>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 14,
              fontSize: 11, color: "#00FF66", textDecoration: "none",
              letterSpacing: "0.38em", fontWeight: 700,
              borderBottom: "1px solid rgba(0,255,102,0.28)", paddingBottom: 6,
              width: "fit-content", transition: "all 0.25s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,102,0.65)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,102,0.28)"; }}
            >
              START YOUR JOURNEY →
            </Link>
          </div>
        )}

        {/* ── Navigation dots (right edge) ───────────────────────────────────── */}
        <div style={{
          position: "absolute", right: 26, top: "50%", transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: 11, alignItems: "center",
        }}>
          {[0, 1, 2].map(s => (
            <button key={s} onClick={() => goCam(s)} style={{
              width: camState === s ? 8 : 4, height: camState === s ? 8 : 4,
              borderRadius: "50%", border: "none", cursor: "pointer", padding: 0,
              background: camState === s ? "#00FF66" : "rgba(255,255,255,0.18)",
              boxShadow: camState === s ? "0 0 10px #00FF66, 0 0 18px rgba(0,255,102,0.4)" : "none",
              transition: "all 0.35s ease",
            }} />
          ))}
        </div>

        {/* ── Subtle corner vignette ─────────────────────────────────────────── */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }} />
      </div>
    </div>
  );
}
