"use client";

interface MiniProgressRingProps {
  value: number;
  toneClass: string;
}

export default function MiniProgressRing({
  value,
  toneClass,
}: MiniProgressRingProps) {
  const radius = 28;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-[88px] w-[88px]">
      <svg height="88" width="88" className="-rotate-90">
        <circle
          stroke="rgba(25,31,40,0.08)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="44"
          cy="44"
        />
        <circle
          className={toneClass}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset }}
          r={normalizedRadius}
          cx="44"
          cy="44"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[15px] font-semibold text-[var(--text-main)]">
          {value}%
        </span>
      </div>
    </div>
  );
}