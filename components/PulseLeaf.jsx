// The site's signature mark: a single leaf vein that resolves into a
// pulse (EKG) line — Ayurveda's botanical language meeting clinical
// medicine. Used as a drawn-on-load accent, never as a repeated icon.
export default function PulseLeaf({ className = "w-24 h-10", animate = true }) {
  return (
    <svg
      viewBox="0 0 240 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 70 C 30 70, 40 20, 70 20 C 95 20, 100 55, 120 55 L136 55 L146 30 L156 75 L166 45 L176 55 L236 55"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "text-emerald motion-safe:animate-drawLine" : "text-emerald"}
        style={animate ? { strokeDasharray: 500 } : undefined}
      />
      <path
        d="M70 20 C 60 5, 40 2, 28 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-gold"
      />
    </svg>
  );
}
