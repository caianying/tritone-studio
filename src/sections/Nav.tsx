import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const LINKS = [
  { label: "工作室", href: "#about" },
  { label: "成员", href: "#members" },
  { label: "作品", href: "#works" },
  { label: "联系", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className="mx-auto grid max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 transition-all duration-500"
        style={{
          paddingTop: scrolled ? 10 : 20,
          paddingBottom: scrolled ? 10 : 14,
          background: scrolled ? "rgba(0,0,0,0.72)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        }}
      >
        <a href="#top" className="flex items-center gap-2.5 justify-self-start" aria-label="TRITONE 首页">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b">
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>
          <span className="whitespace-nowrap text-[15.5px] font-semibold tracking-[-0.03em] text-white">
            TRITONE
            <span className="ml-1.5 hidden text-[12px] font-normal text-[#9a9a9a] min-[420px]:inline">三全音</span>
          </span>
        </a>

        <nav className="hidden items-center gap-2 justify-self-center md:flex" aria-label="主导航">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-pill">
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="hidden justify-self-end md:block">
          <span className="btn btn-solid !h-10 !px-4 !text-[13px]">预约试听</span>
        </a>
        <span className="md:hidden" />
      </div>

      {/* 顶部滚动进度条 */}
      <motion.div
        style={{ scaleX: progressScale }}
        className="h-px origin-left bg-gradient-to-r from-[#d9f24f] via-[#d9f24f]/50 to-transparent"
      />
    </motion.header>
  );
}
