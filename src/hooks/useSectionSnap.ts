import { useEffect } from "react";

/**
 * 智能整屏翻页（不拦截滚轮，section 内自由浏览）：
 * - 只有当滚动「越过」当前 section 边界时才吸附纠正：
 *   向下滚过底部 / 向上滚过顶部 → 平滑滚到相邻 section
 * - 任意位置“猛划”（单次滚动量 ≥ FLICK）→ 直接切换 section
 * - 触控（pointer: coarse）不启用，由 CSS scroll-snap(proximity) 轻柔吸附
 */
export function useSectionSnap() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const FLICK = 160; // 单次猛划阈值（px），普通滚轮一格约 100
    const OVERSHOOT = 10; // 越过边界多少 px 才吸附纠正
    const COOLDOWN = 800;

    const sections = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));

    let lockUntil = 0;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // 捏合缩放
      const now = performance.now();
      if (now < lockUntil) return;
      const list = sections();
      if (list.length === 0) return;

      const pos = window.scrollY;
      const vh = window.innerHeight;
      const dir = e.deltaY > 0 ? 1 : -1;
      const flick = Math.abs(e.deltaY) >= FLICK;

      // 当前 section：以视口上 35% 处的锚点定位（越界瞬间锚点仍在原 section）
      const anchor = pos + vh * 0.35;
      let cur = 0;
      list.forEach((s, i) => {
        if (s.offsetTop <= anchor) cur = i;
      });
      const sec = list[cur];
      const top = sec.offsetTop;
      const bottom = sec.offsetTop + sec.offsetHeight;

      let target = -1;
      if (dir > 0) {
        const overshoot = pos + vh - bottom; // 视口底部越出 section 底部
        if (flick || overshoot > OVERSHOOT) target = Math.min(cur + 1, list.length - 1);
      } else {
        const overshoot = top - pos; // 视口顶部滚过 section 顶部
        if (flick || overshoot > OVERSHOOT) target = Math.max(cur - 1, 0);
      }

      if (target < 0 || target === cur) return;
      lockUntil = now + COOLDOWN;
      list[target].scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);
}
