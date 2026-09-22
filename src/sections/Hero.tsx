import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SilkField } from "@/components/ThreeFX";

const EASE = [0.16, 1, 0.3, 1] as const;

const STATS = [
  {
    label: "120+ 完成作品",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8e8e8" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
        <path d="M9 18V6l10-2v12" />
        <circle cx="6.5" cy="18" r="2.5" />
        <circle cx="16.5" cy="16" r="2.5" />
      </svg>
    ),
  },
  {
    label: "5.1 环绕混录棚",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8e8e8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 12h2l2-6 3 12 3-9 2 3h6" />
      </svg>
    ),
  },
  {
    label: "深圳 · 全国接远程单",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8e8e8" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 4 5.6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.6-4-9s1.5-6.4 4-9z" />
      </svg>
    ),
  },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      data-snap
      className="relative grid min-h-[100svh] grid-rows-[1fr_auto] overflow-hidden"
    >
      <SilkField />

      {/* 上下压暗渐变：保证导航与底部文案可读 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-28 bg-gradient-to-b from-black/80 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[42%] bg-gradient-to-t from-black via-black/40 to-transparent"
      />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative z-10 flex flex-col items-center justify-end px-6 pb-12 text-center"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
          className="badge"
        >
          <svg width="16" height="18" viewBox="0 0 24 24" fill="#fff" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.45))" }} aria-hidden>
            <path d="M12 2.6c.55 0 .88.55 1.08 2.1.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22-1.55-.2-2.1-.53-2.1-1.08s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22.2-1.55.53-2.1 1.08-2.1Z" />
          </svg>
          独立音乐工作室 · EST. 2021 · 深圳
        </motion.span>

        <h1 className="mt-6 text-[clamp(40px,6.5vw,76px)] font-medium leading-[1.12] tracking-[-0.045em] text-white">
          <span className="headline-line">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.05, delay: 0.42, ease: EASE }}
              className="block"
            >
              就……做导唱的，
            </motion.span>
          </span>
          <span className="headline-line">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.05, delay: 0.62, ease: EASE }}
              className="block"
            >
              <em className="serif-accent text-[1.08em]">全案要加钱</em>。
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.25, delay: 0.82 }}
          className="lede mt-5 max-w-[470px]"
        >
          一间棚，一支团队。写歌、录音、混音、配乐 —— 从第一颗音符到最后一轨母带，我们都认真到底。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.96 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
        >
          <a href="#works" className="btn btn-solid">
            聆听作品
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a href="#contact" className="btn btn-ghost">整起</a>
        </motion.div>
      </motion.div>

      {/* 数据栏（首屏底部） */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.12 }}
        style={{ opacity: copyOpacity }}
        className="relative z-10 flex flex-col items-center justify-between gap-4 px-[6vw] pb-9 md:flex-row"
      >
        {STATS.map((s) => (
          <span key={s.label} className="stat-item">
            {s.icon}
            {s.label}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
