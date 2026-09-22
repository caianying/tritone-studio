import { useEffect, useRef } from "react";
import * as THREE from "three";

type RibbonCfg = {
  geo: THREE.PlaneGeometry;
  mat: THREE.MeshStandardMaterial;
  base: Float32Array;
  posAttr: THREE.BufferAttribute;
  vHalf: number;
  phase: number;
  timeScale: number;
  freqScale: number;
  ampScale: number;
};

/**
 * Hero 液态银丝背景：一主一辅两条白色丝绸缎带在黑色空间中缓缓流动
 * （顶点噪声位移 + 实时法线），暖白主光 + 冷白轮廓光打出柔软高光；
 * 三层尘埃粒子（近层亮尘 / 远层暗尘 / 大颗粒焦外光斑）营造纵深，
 * 鼠标移动时整个场景轻微视差倾斜。
 */
export function SilkField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 9, 26);

    const camera = new THREE.PerspectiveCamera(46, mount.clientWidth / mount.clientHeight, 0.1, 60);
    camera.position.set(0, 0.2, 13.5);
    camera.lookAt(0, 1.0, 0);

    const group = new THREE.Group();
    group.position.y = 1.6; // 缎带居上，让出底部文案区
    scene.add(group);

    // 纵向透明渐变：让缎带上下边缘雾化消失，形成柔软轮廓
    const fadeCanvas = document.createElement("canvas");
    fadeCanvas.width = 2;
    fadeCanvas.height = 256;
    const fctx = fadeCanvas.getContext("2d")!;
    const fadeGrad = fctx.createLinearGradient(0, 0, 0, 256);
    fadeGrad.addColorStop(0, "#000");
    fadeGrad.addColorStop(0.28, "#fff");
    fadeGrad.addColorStop(0.72, "#fff");
    fadeGrad.addColorStop(1, "#000");
    fctx.fillStyle = fadeGrad;
    fctx.fillRect(0, 0, 2, 256);
    const fadeTex = new THREE.CanvasTexture(fadeCanvas);

    // ---- 两条缎带：前景主带 + 后景辅带（更远、更暗、相位不同） ----
    const makeRibbon = (
      w: number,
      h: number,
      segX: number,
      segY: number,
      color: number,
      z: number,
      rotX: number,
      phase: number,
      timeScale: number,
      freqScale: number,
      ampScale: number
    ): RibbonCfg => {
      const geo = new THREE.PlaneGeometry(w, h, segX, segY);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.48,
        metalness: 0.3,
        side: THREE.DoubleSide,
        transparent: true,
        alphaMap: fadeTex,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = rotX;
      mesh.position.z = z;
      group.add(mesh);
      return {
        geo,
        mat,
        base: (geo.attributes.position as THREE.BufferAttribute).array.slice() as Float32Array,
        posAttr: geo.attributes.position as THREE.BufferAttribute,
        vHalf: h / 2,
        phase,
        timeScale,
        freqScale,
        ampScale,
      };
    };

    const ribbons: RibbonCfg[] = [
      makeRibbon(32, 5.2, 200, 64, 0xbdbdbd, 0, -0.42, 0, 1, 1, 1),
      makeRibbon(38, 7.5, 120, 40, 0x767676, -4.5, -0.3, 4.2, 0.62, 0.72, 1.5),
    ];

    // ---- 尘埃粒子（近层亮尘 / 远层暗尘 / 焦外大光斑） ----
    const makeDust = (n: number, size: number, opacity: number, spread: [number, number, number]) => {
      const arr = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        arr[i * 3] = (Math.random() - 0.5) * spread[0];
        arr[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
        arr[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      const m = new THREE.PointsMaterial({
        color: 0xffffff,
        size,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const pts = new THREE.Points(g, m);
      scene.add(pts);
      return { geo: g, mat: m, base: arr.slice() as Float32Array, n };
    };
    const dustNear = makeDust(500, 0.05, 0.5, [30, 16, 8]);
    const dustFar = makeDust(900, 0.028, 0.28, [34, 18, 10]);
    const dustBokeh = makeDust(60, 0.22, 0.05, [26, 14, 6]);

    // ---- 灯光：主光（暖白，左上前方）+ 轮廓光（冷白，右后方） ----
    const key = new THREE.DirectionalLight(0xfff6ea, 2.0);
    key.position.set(5, 7, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xdfe8ff, 0.9);
    rim.position.set(-7, -3, -6);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0x404040, 0.35));

    // 鼠标轻微视差
    let mx = 0;
    let my = 0;
    const onPointer = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();

    const step = (t: number) => {
      // 缎带顶点：沿带宽做包络 taper，端头收成柔软轮廓
      for (const r of ribbons) {
        const tt = t * r.timeScale + r.phase;
        const arr = r.posAttr.array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          const x = r.base[i] * r.freqScale;
          const y = r.base[i + 1];
          const env = Math.cos((y / r.vHalf) * Math.PI * 0.5) ** 2; // 1 → 0
          const ampMod = 0.62 + 0.38 * Math.sin(x * 0.21 + tt * 0.28);
          arr[i + 2] =
            env *
            ampMod *
            r.ampScale *
            (1.25 * Math.sin(x * 0.4 + tt * 0.85) +
              0.7 * Math.sin(x * 0.93 - tt * 0.55 + 2.1) +
              0.42 * Math.sin(x * 1.72 + tt * 1.25 + y * 0.7));
          arr[i + 1] = y + env * 0.35 * Math.sin(x * 0.5 + tt * 0.62);
        }
        r.posAttr.needsUpdate = true;
        r.geo.computeVertexNormals();
      }

      // 尘埃缓慢上浮 + 横向漂摆
      for (const d of [dustNear, dustFar, dustBokeh]) {
        const p = d.geo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < d.n; i++) {
          const i3 = i * 3;
          p.array[i3 + 1] = d.base[i3 + 1] + Math.sin(t * 0.12 + i * 1.7) * 0.6;
          p.array[i3] = d.base[i3] + Math.sin(t * 0.09 + i * 2.3) * 0.8;
        }
        p.needsUpdate = true;
      }

      group.rotation.y += (mx * 0.1 - group.rotation.y) * 0.035;
      group.rotation.x += (my * 0.05 - group.rotation.x) * 0.035;
      group.rotation.z = Math.sin(t * 0.07) * 0.02; // 极缓慢的呼吸摇摆
      renderer.render(scene, camera);
    };

    if (reduced) {
      step(0);
    } else {
      const animate = () => {
        raf = requestAnimationFrame(animate);
        step(clock.getElapsedTime());
      };
      animate();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      for (const r of ribbons) {
        r.geo.dispose();
        r.mat.dispose();
      }
      fadeTex.dispose();
      for (const d of [dustNear, dustFar, dustBokeh]) {
        d.geo.dispose();
        d.mat.dispose();
      }
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden />;
}

/**
 * 页脚漂浮尘埃粒子：缓慢上升的微尘，白与暖灰双色，微弱发光。
 */
export function DustParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 60);
    camera.position.z = 12;

    const N = 240;
    const positions = new Float32Array(N * 3);
    const speeds = new Float32Array(N);
    const colors = new Float32Array(N * 3);
    const cWhite = new THREE.Color("#ffffff");
    const cWarm = new THREE.Color("#cfcfcf");
    const tmp = new THREE.Color();

    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      speeds[i] = 0.15 + Math.random() * 0.45;
      tmp.copy(Math.random() > 0.35 ? cWhite : cWarm);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const pos = geo.attributes.position as THREE.BufferAttribute;
    let raf = 0;
    const clock = new THREE.Clock();

    const step = (dt: number, t: number) => {
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        pos.array[i3 + 1] += speeds[i] * dt;
        pos.array[i3] += Math.sin(t * 0.5 + i) * 0.004;
        if ((pos.array[i3 + 1] as number) > 8.5) pos.array[i3 + 1] = -8.5;
      }
      pos.needsUpdate = true;
      pts.rotation.y = Math.sin(t * 0.05) * 0.15;
      renderer.render(scene, camera);
    };

    if (reduced) {
      step(0, 0);
    } else {
      const animate = () => {
        raf = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);
        step(dt, clock.getElapsedTime());
      };
      animate();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden />;
}
