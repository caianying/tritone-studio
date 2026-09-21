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
    <div className="relative overflow-hidden border-y border-white/10 py-5" aria-hidden>
      <div className="marquee-track">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-16">
            {row.map(([zh, en], i) => (
              <span key={`${half}-${i}`} className="flex items-baseline gap-4 whitespace-nowrap">
                <span className="font-display text-[22px] text-[#e5e5e5]">{zh}</span>
                <span className="serif-accent text-[15px]">{en}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" className="ml-8 self-center">
                  <circle cx="5" cy="5" r="4" fill="none" stroke="#f59e0b" strokeOpacity="0.5" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
      {/* 两端渐隐 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
    </div>
  );
}
