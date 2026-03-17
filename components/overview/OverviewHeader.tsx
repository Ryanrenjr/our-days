"use client";

interface OverviewHeaderProps {
  dayNumber: string;
  monthWeekText: string;
  note: string;
  noteInput: string;
  isEditingNote: boolean;
  setNoteInput: (value: string) => void;
  setIsEditingNote: (value: boolean) => void;
  onSaveNote: () => Promise<void> | void;
}

export default function OverviewHeader({
  dayNumber,
  monthWeekText,
  note,
  noteInput,
  isEditingNote,
  setNoteInput,
  setIsEditingNote,
  onSaveNote,
}: OverviewHeaderProps) {
  return (
    <section className="mb-10 grid grid-cols-1 gap-5 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="toss-card p-8 md:p-10">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
          DAILY PAIR
        </p>

        <div className="mt-5 flex items-end gap-5">
          <span className="text-[88px] font-bold leading-none tracking-[-0.08em] text-[var(--text-main)] md:text-[104px]">
            {dayNumber}
          </span>

          <div className="pb-3">
            <p className="text-[28px] font-semibold tracking-[-0.04em] text-[var(--text-main)] md:text-[32px]">
              {monthWeekText}
            </p>
          </div>
        </div>
      </div>

      <div className="toss-card p-8 md:p-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
              NOTE
            </p>
            <h2 className="mt-3 text-[30px] font-bold tracking-[-0.04em] text-[var(--text-main)]">
              今日备注
            </h2>
          </div>

          {!isEditingNote ? (
            <button
              onClick={() => setIsEditingNote(true)}
              className="rounded-full border border-[var(--line-soft)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
            >
              编辑
            </button>
          ) : (
            <button
              onClick={onSaveNote}
              className="rounded-full bg-[var(--text-main)] px-4 py-2 text-sm font-medium text-white transition"
            >
              保存
            </button>
          )}
        </div>

        {!isEditingNote ? (
          <p className="mt-6 text-[17px] leading-8 text-[var(--text-muted)]">
            {note || "写下一句今天想提醒自己的话。"}
          </p>
        ) : (
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            className="mt-6 min-h-[128px] w-full rounded-[20px] border border-[var(--line-soft)] bg-[var(--bg-soft)] p-4 text-[16px] leading-7 text-[var(--text-main)] outline-none"
          />
        )}
      </div>
    </section>
  );
}