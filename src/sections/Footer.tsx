import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const STATS = [
  { value: "120+", label: "完成作品" },
  { value: "3", label: "双金耳朵认证成员" },
  { value: "5.1", label: "环绕混录棚" },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <footer ref={ref} id="contact" className="relative overflow-hidden">
      {/* 底部琥珀光晕 */}
      <motion.div
        style={{ y: glowY, opacity: glowOpacity }}
        className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[70vmin] w-[110vmin] -translate-x-1/2 rounded-full blur-[140px]"
        aria-hidden
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.22) 0%, rgba(180,83,9,0.08) 45%, transparent 70%)" }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-[1100px] px-6 pb-12 pt-[140px]">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-center text-[clamp(36px,6vw,72px)] leading-[1.2] text-white"
        >
          让下一首歌，
          <br />
          <em className="serif-accent text-[1.05em]">从这里开始。</em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="mailto:hello@tritone.studio" className="btn btn-solid">
            hello@tritone.studio
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a href="#top" className="btn btn-ghost">回到顶部</a>
        </motion.div>

        <div className="mt-20 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
              className="text-center"
            >
              <div className="text-[clamp(24px,3.5vw,40px)] font-semibold tracking-[-0.03em] text-white">{s.value}</div>
              <div className="mt-1 text-[12px] tracking-[0.1em] text-[#8a8a8a]">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-[12px] text-[#6b6b6b] md:flex-row">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
              <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
            </svg>
            TRITONE · 三全音音乐工作室
          </div>
          <div>中国 · 深圳 —— 也接远程单</div>
          <div>© 2026 TRITONE Studio. All frequencies reserved.</div>
        </div>
      </div>
    </footer>
  );
}
