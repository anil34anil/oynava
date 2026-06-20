/** Oynava marka logosu: play amblemi + gradyan yazı. Header ve footer'da kullanılır. */
export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const text = size === "sm" ? "text-lg" : "text-xl";
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className={`${dim} shrink-0`} aria-hidden="true">
        <defs>
          <linearGradient id="oynavaLogo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00e5ff" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="58" height="58" rx="16" fill="#0a0d18" />
        <rect x="4.5" y="4.5" width="55" height="55" rx="14.5" fill="none" stroke="url(#oynavaLogo)" strokeWidth="3" />
        <path d="M25 20 L46 32 L25 44 Z" fill="url(#oynavaLogo)" />
      </svg>
      <span
        className={`bg-gradient-to-r from-neon to-neon-purple bg-clip-text font-display ${text} font-black tracking-widest text-transparent`}
      >
        OYNAVA
      </span>
    </span>
  );
}
