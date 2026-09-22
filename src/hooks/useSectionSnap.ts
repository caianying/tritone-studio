import { useEffect } from "react";

/**
 * 整屏翻页：桌面端滚轮每“划”一下，平滑滚动到下一个带 [data-snap] 的区块。
 * - 累积滚轮增量，超过阈值才触发（触控板小步滚动不会误触发）
 * - 动画期间锁定，避免连跳
 * - 减少动态偏好 / 移动端触控（pointer: coarse）不启用，走系统原生滚动
 * - 移动端由 CSS scroll-snap(proximity) 提供轻柔吸附
 */
export function useSectionSnap() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const sections = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));

    let acc = 0;
    let animating = false;
    let lockTimer = 0;

    const release = () => {
      window.clearTimeout(lockTimer);
      lockTimer = window.setTimeout(() => {
        animating = false;
        acc = 0;
      }, 1000);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // 捏合缩放不管
      const list = sections();
      if (list.length === 0) return;
      if (animating) {
        e.preventDefault();
        return;
      }
      acc += e.deltaY;
      if (Math.abs(acc) < 60) return; // 累积阈值，滤掉触控板噪声
      e.preventDefault();

      const pos = window.scrollY;
      let idx = 0;
      list.forEach((s, i) => {
        if (s.offsetTop <= pos + 12) idx = i;
      });
      const target = acc > 0 ? Math.min(idx + 1, list.length - 1) : Math.max(idx - 1, 0);
      animating = true;
      acc = 0;
      list[target].scrollIntoView({ behavior: "smooth", block: "start" });
      release();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(lockTimer);
    };
  }, []);
}
