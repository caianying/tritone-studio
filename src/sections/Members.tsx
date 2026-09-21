import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

type Member = {
  name: string;
  en: string;
  role: string;
  chip: string;
  chipBg: string;
  img: string;
  quote: string;
  alt: string;
};

const MEMBERS: Member[] = [
  {
    name: "阿岚",
    en: "ALAN",
    role: "主理人 · 制作人 · 作曲",
    chip: "PRODUCER",
    chipBg: "#fbbf24",
    img: "/images/member-alan.png",
    quote: "旋律响起之前，先想清楚它为什么存在。",
    alt: "琥珀色推子特写 —— 制作人的工作台",
  },
  {
    name: "周远舟",
    en: "FAR ZHOU",
    role: "录音师 · 混音师",
    chip: "MIX ENGINEER",
    chipBg: "#93c5fd",
    img: "/images/member-zhou.png",
    quote: "好混音不是修出来的，是保留下来的。",
    alt: "蓝色开盘磁带机特写 —— 录音师的时间轴",
  },
  {
    name: "陆离",
    en: "LULI",
    role: "编曲 · 声音设计",
    chip: "ARRANGER",
    chipBg: "#d8b4fe",
    img: "/images/member-lu.png",
    quote: "音色是另一种语法，我负责让它说话。",
    alt: "紫色模块合成器虚化特写 —— 编曲师的星空",
  },
];

/** 三张卡以不同速率上下错位 —— 核心视差 */
function ParallaxCard({
  member,
  index,
  progress,
}: {
  member: Member;
  index: number;
  progress: MotionValue<number>;
}) {
  const distance = index === 1 ? 90 : 50 + index * 20;
  const y = useTransform(progress, [0, 1], [distance, -distance]);

  return (
    <motion.div style={{ y }} className={index === 1 ? "md:mt-16" : ""}>
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="member-card"
      >
        <img src={member.img} alt={member.alt} loading="lazy" />
        <div className="member-meta">
          <span className="member-role-chip" style={{ background: member.chipBg }}>
            {member.chip}
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="font-display text-[24px] text-white">{member.name}</h3>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8a8a]">{member.en}</span>
          </div>
          <p className="mt-1 text-[13px] text-[#b5b5b5]">{member.role}</p>
          <p className="mt-3 border-t border-white/10 pt-3 text-[12.5px] italic leading-[1.6] text-[#8a8a8a]">
            “{member.quote}”
          </p>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function Members() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} id="members" className="section overflow-hidden">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="section-tag"
            >
              成员 · THE TRIO
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="section-title"
            >
              三个人，
              <em className="serif-accent">三种频率</em>。
            </motion.h2>
          </div>
          <div className="flex flex-col items-end gap-6">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="section-index hidden md:block"
              aria-hidden
            >
              02
            </motion.span>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.25 }}
              className="max-w-[300px] text-right text-[13.5px] leading-[1.75] text-[#8a8a8a]"
            >
              制作人、录音师、编曲师 —— 工种不同，耳朵一致。合作多年，一个眼神就能接住彼此的下一个小节。
            </motion.p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {MEMBERS.map((m, i) => (
            <ParallaxCard key={m.en} member={m} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
