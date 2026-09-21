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
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 901 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      {/* 移动端全屏菜单 */}
      <div className="menu-backdrop" onClick={() => setOpen(false)} aria-hidden />
      <nav className="mobile-menu" aria-label="移动端导航">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>

      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className="mx-auto grid max-w-[1240px] grid-cols-[1fr_auto_auto] items-center gap-3 px-5 transition-all duration-500 md:grid-cols-[1fr_auto_1fr]"
          style={{
            paddingTop: scrolled ? 10 : 22,
            paddingBottom: scrolled ? 10 : 10,
            background: scrolled ? "rgba(0,0,0,0.72)" : "transparent",
            backdropFilter: scrolled ? "blur(18px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          }}
        >
          <a href="#top" className="flex items-center gap-2.5 justify-self-start" aria-label="TRITONE 首页">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#f2f2f2">
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

          <div className="flex items-center gap-2 justify-self-end">
            <a href="#contact" className="btn btn-solid hidden !h-10 !px-4 !text-[13px] md:inline-flex">
              预约试听
            </a>
            <button
              className="burger"
              aria-controls="mobile-nav"
              aria-expanded={open}
              aria-label={open ? "关闭菜单" : "打开菜单"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="burger-bar" />
              <span className="burger-bar" />
              <span className="burger-bar" />
            </button>
          </div>
        </div>

        {/* 顶部滚动进度条 */}
        <motion.div
          style={{ scaleX: progressScale }}
          className="h-px origin-left bg-gradient-to-r from-white/70 via-white/30 to-transparent"
        />
      </motion.header>
    </>
  );
}
