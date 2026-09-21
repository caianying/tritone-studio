import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

type Work = {
  title: string;
  kind: string;
  year: string;
  hue: number; // 生成封面主色
  seed: number; // 波形伪随机种子
};

const WORKS: Work[] = [
  { title: "潮汐电台", kind: "单曲 · 独立流行", year: "2026", hue: 38, seed: 7 },
  { title: "午夜环线", kind: "EP · 电子", year: "2025", hue: 215, seed: 21 },
  { title: "纸飞机", kind: "短片配乐 · 剧情", year: "2025", hue: 18, seed: 13 },
  { title: "琥珀", kind: "专辑 · 民谣", year: "2024", hue: 32, seed: 42 },
  { title: "雾中风景", kind: "独立游戏 · 原声", year: "2024", hue: 265, seed: 9 },
  { title: "城市脉动", kind: "品牌 · 声音设计", year: "2023", hue: 190, seed: 33 },
];

/** 确定性伪随机 */
function prand(seed: number, i: number) {
  const x = Math.sin(seed * 9973 + i * 233.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 生成式封面：渐变底 + 声波条 + 光斑，每部作品独一无二 */
function Cover({ hue, seed }: { hue: number; seed: number }) {
  const bars = Array.from({ length: 26 }, (_, i) => {
    const h = 14 + prand(seed, i) * 62;
    return { x: 6 + i * 3.4, h, y: 46 - h / 2 };
  });
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`g${seed}`} cx="30%" cy="25%" r="90%">
          <stop offset="0%" stopColor={`hsl(${hue} 70% 30%)`} />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
      </defs>
      <rect width="96" height="96" fill={`url(#g${seed})`} />
      <circle cx={68 + prand(seed, 99) * 14} cy={24 + prand(seed, 55) * 14} r="14" fill={`hsl(${hue} 90% 62% / 0.28)`} />
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width="2" height={b.h} rx="1" fill={`hsl(${hue} 85% 70% / ${0.35 + prand(seed, i + 60) * 0.5})`} />
      ))}
    </svg>
  );
}

function WorkRow({ work, index }: { work: Work; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = index % 2 === 0 ? 26 : -26;
  const x = useTransform(scrollYProgress, [0, 1], [-drift, drift]);
  const coverY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  return (
    <motion.div ref={ref} style={{ x }}>
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.85, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="work-row group"
      >
        <motion.div style={{ y: coverY }} className="work-cover">
          <Cover hue={work.hue} seed={work.seed} />
        </motion.div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <span className="work-kind">{work.kind}</span>
            <span className="font-mono text-[12px] text-[#525252]">{work.year}</span>
          </div>
          <h3 className="work-title mt-1.5">{work.title}</h3>
        </div>
        <div className="work-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Works() {
  const headRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headRef,
    offset: ["start end", "end start"],
  });
  const headX: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="works" className="section">
      <div className="mx-auto max-w-[1100px]">
        <div ref={headRef}>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="section-tag"
          >
            作品 · SELECTED WORKS
          </motion.span>
          <motion.h2
            style={{ x: headX }}
            className="section-title whitespace-nowrap"
          >
            这些年，
            <em className="serif-accent">我们留下的声音</em>
          </motion.h2>
        </div>

        <div className="mt-16">
          {WORKS.map((w, i) => (
            <WorkRow key={w.title} work={w} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-10 text-center text-[13px] text-[#6b6b6b]"
        >
          完整歌单与幕后花絮，正在整理中 —— 先听这六张名片。
        </motion.p>
      </div>
    </section>
  );
}
