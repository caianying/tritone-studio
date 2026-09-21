import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero 三维点阵波浪：琥珀 → 蓝 → 紫 渐变粒子海，
 * 随时间正弦起伏，随鼠标轻微倾斜（视差），加色混合发光。
 */
export function WaveField3D() {
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
    const camera = new THREE.PerspectiveCamera(58, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 2.4, 7.5);
    camera.lookAt(0, -0.2, 0);

    const group = new THREE.Group();
    scene.add(group);

    // 点阵网格
    const COLS = 150;
    const ROWS = 72;
    const W = 24;
    const D = 13;
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cAmber = new THREE.Color("#f59e0b");
    const cBlue = new THREE.Color("#3b82f6");
    const cViolet = new THREE.Color("#8b5cf6");
    const tmp = new THREE.Color();

    let p = 0;
    for (let ix = 0; ix < COLS; ix++) {
      for (let iz = 0; iz < ROWS; iz++) {
        positions[p] = (ix / (COLS - 1) - 0.5) * W;
        positions[p + 1] = 0;
        positions[p + 2] = (iz / (ROWS - 1) - 0.5) * D;
        const t = ix / (COLS - 1);
        if (t < 0.5) tmp.copy(cAmber).lerp(cBlue, t * 2);
        else tmp.copy(cBlue).lerp(cViolet, (t - 0.5) * 2);
        colors[p] = tmp.r;
        colors[p + 1] = tmp.g;
        colors[p + 2] = tmp.b;
        p += 3;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    group.add(new THREE.Points(geo, mat));
    group.position.y = -1.1;

    // 鼠标视差
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

    const pos = geo.attributes.position as THREE.BufferAttribute;
    const clock = new THREE.Clock();
    let raf = 0;

    const step = (t: number) => {
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];
        pos.array[i3 + 1] =
          Math.sin(x * 0.5 + t * 1.15) * 0.38 +
          Math.cos(z * 0.85 + t * 0.85) * 0.3 +
          Math.sin((x + z) * 0.32 + t * 0.55) * 0.26;
      }
      pos.needsUpdate = true;
      group.rotation.y += (mx * 0.14 - group.rotation.y) * 0.04;
      group.rotation.x += (my * 0.07 - group.rotation.x) * 0.04;
      renderer.render(scene, camera);
    };

    if (reduced) {
      step(0); // 静止渲染一帧
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
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden />;
}

/**
 * 页脚漂浮尘埃粒子：缓慢上升的微尘，琥珀与暖白双色，微弱发光。
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
    const cAmber = new THREE.Color("#f59e0b");
    const cWarm = new THREE.Color("#e8e0d0");
    const tmp = new THREE.Color();

    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      speeds[i] = 0.15 + Math.random() * 0.45;
      tmp.copy(Math.random() > 0.35 ? cAmber : cWarm);
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
