"use client";

interface TravelHeaderProps {
  totalCount: number;
  datedCount: number;
}

export default function TravelHeader({
  totalCount,
  datedCount,
}: TravelHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-soft)]">
            Travel Log
          </p>
          <h1 className="mt-3 text-[48px] font-bold tracking-[-0.05em] text-[var(--text-main)] md:text-[56px]">
            旅行记录
          </h1>
          <p className="mt-4 text-[16px] leading-7 text-[var(--text-muted)]">
            把去过的地方、想去的城市、重要日期都记在这里。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 self-start xl:self-auto">
          <div className="toss-card-sm px-5 py-4 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">
              all
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
              {totalCount}
            </p>
          </div>

          <div className="toss-card-sm px-5 py-4 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">
              dated
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
              {datedCount}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}