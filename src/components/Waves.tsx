import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * 多层正弦声波，随页面滚动以不同速率错位移动（视差核心），
 * 每层还带有缓慢的横向漂移，形成“声波在呼吸”的感觉。
 */
function WaveLayer({
  color,
  opacity,
  speed,
  driftDuration,
  flip = false,
}: {
  color: string;
  opacity: number;
  speed: number;
  driftDuration: number;
  flip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60 * speed, -60 * speed]);

  // 低振幅细长声波
  const wave =
    "M0 52 C 120 30, 240 74, 360 52 S 600 30, 720 52 S 960 74, 1080 52 S 1320 30, 1440 52 L1440 120 L0 120 Z";

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, transform: flip ? "scaleY(-1)" : undefined }}
      className="absolute inset-x-0 bottom-0 h-[16vh] min-h-[110px]"
    >
      <motion.svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="h-full w-full"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: driftDuration, ease: "linear", repeat: Infinity }}
        style={{ width: "200%" }}
      >
        <path d={wave} fill={color} />
        <path d={wave} fill={color} transform="translate(1440 0)" />
      </motion.svg>
    </motion.div>
  );
}

/** Hero 专用：固定在 hero 内的声波组，随滚动整体下沉错位 */
export function HeroWaves({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -190]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -280]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* 氛围光斑 */}
      <div
        className="absolute left-1/2 top-[38%] h-[55vmin] w-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(96,165,250,0.06) 45%, transparent 70%)",
        }}
      />
      <motion.div style={{ y: y4 }} className="absolute inset-x-0 bottom-[-6vh]">
        <WaveLayer color="#241505" opacity={0.9} speed={0.4} driftDuration={26} />
      </motion.div>
      <motion.div style={{ y: y3 }} className="absolute inset-x-0 bottom-[-4.5vh]">
        <WaveLayer color="#5b3410" opacity={0.5} speed={0.7} driftDuration={20} />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute inset-x-0 bottom-[-3vh]">
        <WaveLayer color="#8a5313" opacity={0.32} speed={1} driftDuration={16} />
      </motion.div>
      <motion.div style={{ y: y1 }} className="absolute inset-x-0 bottom-[-1.5vh]">
        <WaveLayer color="#d97706" opacity={0.16} speed={1.4} driftDuration={12} />
      </motion.div>
    </div>
  );
}

/** 章节之间点缀用的单条声波分隔 */
export function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className="pointer-events-none relative h-[12vh] min-h-[80px] w-full overflow-hidden" aria-hidden>
      <WaveLayer color="#1c1206" opacity={1} speed={1.2} driftDuration={22} flip={flip} />
    </div>
  );
}
