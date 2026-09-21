import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HeroWaves } from "@/components/Waves";
import { WaveField3D } from "@/components/ThreeFX";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-end overflow-hidden pb-[16vh]"
    >
      <HeroWaves scrollYProgress={scrollYProgress} />
      <WaveField3D />

      {/* 贴纸标签 */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -10 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ delay: 1.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-[7%] top-[30%] z-[6] hidden lg:block"
        aria-hidden
      >
        <span className="sticker text-[13px]">就现在，整起</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16, rotate: 8 }}
        animate={{ opacity: 1, y: 0, rotate: 3 }}
        transition={{ delay: 1.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-[12%] top-[40%] z-[6] hidden lg:block"
        aria-hidden
      >
        <span className="sticker-ghost">SHENZHEN — EST. 2021</span>
      </motion.div>

      {/* 幽灵描边字 */}
      <span className="ghost-word" aria-hidden>TRITONE</span>

      {/* 旋转黑胶装饰 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.2 }}
        className="absolute right-[7%] top-[24%] z-[5] hidden lg:block"
        aria-hidden
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, ease: "linear", repeat: Infinity }}
          style={{ animation: "float-slow 7s ease-in-out infinite" }}
        >
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="73" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1" />
            {[64, 56, 48, 40].map((r) => (
              <circle key={r} cx="75" cy="75" r={r} fill="none" stroke="#1f1f1f" strokeWidth="1" />
            ))}
            <circle cx="75" cy="75" r="22" fill="#f59e0b" opacity="0.9" />
            <circle cx="75" cy="75" r="3.5" fill="#000" />
            <path d="M75 53 a22 22 0 0 1 19 11" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
          </svg>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative z-10 flex w-full max-w-[880px] flex-col items-center px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="section-tag"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
            <path d="M12 2c.6 0 .9.6 1.1 2.1.6 4.7 1.5 5.6 6.2 6.2 1.5.2 2 .5 2 1.1s-.5.9-2 1.1c-4.7.6-5.6 1.5-6.2 6.2-.2 1.5-.5 2.1-1.1 2.1s-.9-.6-1.1-2.1c-.6-4.7-1.5-5.6-6.2-6.2C3.5 13.9 3 13.6 3 13s.5-.9 2-1.1c4.7-.6 5.6-1.5 6.2-6.2C11.1 2.6 11.4 2 12 2Z" />
          </svg>
          独立音乐工作室 · EST. 2021 · 深圳
        </motion.span>

        <h1 className="font-display mt-7 text-[clamp(42px,7.5vw,86px)] leading-[1.14] text-white">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.05, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              就……做导唱的，
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.05, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              <em className="em-acid text-[1.06em]">整案要加钱</em>。
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.85 }}
          className="mt-6 max-w-[480px] text-[15.5px] leading-[1.7] tracking-[-0.01em] text-[#9a9a9a]"
        >
          一间棚，一支团队。写歌、录音、混音、配乐 —— 从第一颗音符到最后一轨母带，我们都认真到底。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
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
    </section>
  );
}
