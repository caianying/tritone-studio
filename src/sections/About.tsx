import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const FEATURES = [
  {
    no: "01",
    title: "词曲创作",
    en: "Songwriting",
    desc: "从一句旋律到一个完整的故事。流行、民谣、电子、影视歌曲，量体裁衣。",
  },
  {
    no: "02",
    title: "录音与混音",
    en: "Recording & Mixing",
    desc: "经过声学处理的录音棚与模拟设备链，人声、乐队、弦乐四重奏，都能被温柔而精确地收进来。",
  },
  {
    no: "03",
    title: "影视与游戏配乐",
    en: "Score & Sound Design",
    desc: "为画面补一口气：短片、纪录片、独立游戏，从主题动机到最终 5.1 混录。",
  },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yBig = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const ySmall = useTransform(scrollYProgress, [0, 1], [30, -110]);

  return (
    <section ref={ref} id="about" className="section">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex items-start justify-between gap-6">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="section-tag"
          >
            工作室 · ABOUT
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="section-index hidden md:block"
            aria-hidden
          >
            01
          </motion.span>
        </div>

        <div className="relative mt-10">
          <motion.h2
            style={{ y: yBig }}
            className="font-display text-[clamp(30px,4.6vw,54px)] leading-[1.3] text-white"
          >
            三全音，是不协和音程里
            <br />
            最诚实的那一个 ——
            <br />
            <em className="serif-accent text-[1.05em]"> tension，也是故事的开始。</em>
          </motion.h2>

          <motion.p
            style={{ y: ySmall }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-12 md:ml-auto md:max-w-[460px] md:text-right"
          >
            <span className="font-display block text-[clamp(24px,3.2vw,38px)] leading-[1.4] text-white">
              来自深圳，
              <em className="serif-accent">做音乐的</em>。
            </span>
            <span className="mt-4 block text-[11px] uppercase tracking-[0.4em] text-[#6b6b6b]">
              Shenzhen — Music Makers
            </span>
          </motion.p>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.no}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
              className="group bg-[#050505] p-8 transition-colors duration-500 hover:bg-[#0c0a06]"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[13px] text-[#525252]">{f.no}</span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#525252]">{f.en}</span>
              </div>
              <h3 className="mt-8 text-[22px] font-semibold tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-amber-300">
                {f.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-[1.75] text-[#8a8a8a]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
