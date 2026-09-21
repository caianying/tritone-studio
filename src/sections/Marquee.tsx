const ITEMS = [
  ["写歌", "SONGWRITING"],
  ["录音", "RECORDING"],
  ["混音", "MIXING"],
  ["配乐", "SCORING"],
  ["声音设计", "SOUND DESIGN"],
  ["母带", "MASTERING"],
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-6" aria-hidden>
      <div className="marquee-track">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-20">
            {row.map(([zh, en], i) => {
              const outlined = (i + half) % 2 === 0;
              return (
                <span key={`${half}-${i}`} className="flex items-baseline gap-5 whitespace-nowrap">
                  <span
                    className={`font-display text-[30px] leading-none ${
                      outlined ? "stroke-text" : "text-[#e5e5e5]"
                    }`}
                  >
                    {zh}
                  </span>
                  <span className={`text-[14px] tracking-[0.18em] ${outlined ? "text-[#6b6b6b]" : "em-acid"}`}>
                    {en}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" className="ml-10 self-center">
                    <rect
                      x="2.2"
                      y="2.2"
                      width="7.6"
                      height="7.6"
                      fill="none"
                      stroke="#d9f24f"
                      strokeOpacity="0.6"
                      transform="rotate(45 6 6)"
                    />
                  </svg>
                </span>
              );
            })}
          </div>
        ))}
      </div>
      {/* 两端渐隐 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
    </div>
  );
}
