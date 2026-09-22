import { useEffect } from "react";

/**
 * 智能整屏翻页：
 * - 不拦截滚轮 —— section 内部始终可以正常滚动浏览内容
 * - 向下滚到当前 section 底部边缘 → 吸附到下一个 section 顶
 * - 向上滚到当前 section 顶部边缘 → 吸附到上一个 section 顶
 * - 任意位置“猛划”（单次滚动量 ≥ FLICK）→ 直接切换 section
 * - 触控（pointer: coarse）不启用，由 CSS scroll-snap(proximity) 轻柔吸附
 */
export function useSectionSnap() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const FLICK = 130; // 单次猛划阈值（px），普通滚轮一格约 100
    const EDGE = 64; // 顶部 / 底部边缘判定区（px）
    const COOLDOWN = 850;

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

      // 当前所在 section（offsetTop 小于等于当前滚动位置的最后一块）
      let cur = 0;
      list.forEach((s, i) => {
        if (s.offsetTop <= pos + 8) cur = i;
      });
      const sec = list[cur];

      let target = -1;
      if (dir > 0) {
        const atEnd = sec.offsetTop + sec.offsetHeight - pos - vh < EDGE;
        if (flick || atEnd) target = Math.min(cur + 1, list.length - 1);
      } else {
        const atTop = pos - sec.offsetTop < EDGE;
        if (flick || atTop) target = Math.max(cur - 1, 0);
      }

      if (target < 0 || target === cur) return;
      lockUntil = now + COOLDOWN;
      list[target].scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);
}
