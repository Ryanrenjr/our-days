"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import MiniProgressRing from "./MiniProgressRing";

interface SpaceCardProps {
  label: string;
  title: string;
  description: string;
  progress: number;
  icon: LucideIcon;
  iconBgClass: string;
  ringToneClass: string;
  onClick: () => void;
  wideOnMedium?: boolean;
}

export default function SpaceCard({
  label,
  title,
  description,
  progress,
  icon: Icon,
  iconBgClass,
  ringToneClass,
  onClick,
  wideOnMedium = false,
}: SpaceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`toss-card group p-7 text-left transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] ${
        wideOnMedium ? "md:col-span-2 xl:col-span-1" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBgClass}`}
            >
              <Icon size={20} className="text-[var(--text-main)]" />
            </div>

            <ArrowRight
              className="text-[var(--text-soft)] transition group-hover:translate-x-1"
              size={18}
            />
          </div>

          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">
            {label}
          </p>

          <h3 className="mt-3 text-[34px] font-bold tracking-[-0.05em] text-[var(--text-main)]">
            {title}
          </h3>

          <p className="mt-4 text-[16px] font-medium text-[var(--text-muted)]">
            {description}
          </p>
        </div>

        <div className="shrink-0">
          <MiniProgressRing value={progress} toneClass={ringToneClass} />
        </div>
      </div>
    </button>
  );
}