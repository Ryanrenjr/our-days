"use client";

import { Check, Edit2, Trash2, X, CalendarDays } from "lucide-react";
import type { Destination } from "../../hooks/useDestinations";

interface DestinationsCardProps {
  destinations: Destination[];
  destinationName: string;
  destinationNote: string;
  destinationDate: string;
  setDestinationName: (value: string) => void;
  setDestinationNote: (value: string) => void;
  setDestinationDate: (value: string) => void;
  onAddDestination: () => Promise<void> | void;
  editingDestinationId: number | null;
  editingDestinationName: string;
  editingDestinationNote: string;
  editingDestinationDate: string;
  setEditingDestinationId: (value: number | null) => void;
  setEditingDestinationName: (value: string) => void;
  setEditingDestinationNote: (value: string) => void;
  setEditingDestinationDate: (value: string) => void;
  onStartEdit: (
    id: number,
    name: string,
    note?: string | null,
    date?: string | null
  ) => void;
  onSaveEdit: () => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
}

function formatRecordDate(dateString?: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);
}

export default function DestinationsCard({
  destinations,
  destinationName,
  destinationNote,
  destinationDate,
  setDestinationName,
  setDestinationNote,
  setDestinationDate,
  onAddDestination,
  editingDestinationId,
  editingDestinationName,
  editingDestinationNote,
  editingDestinationDate,
  setEditingDestinationId,
  setEditingDestinationName,
  setEditingDestinationNote,
  setEditingDestinationDate,
  onStartEdit,
  onSaveEdit,
  onDelete,
}: DestinationsCardProps) {
  return (
    <section className="grid grid-cols-1 gap-5">
      <div className="toss-card p-8 md:p-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
              TRAVEL LOG
            </p>
            <h2 className="mt-3 text-[30px] font-bold tracking-[-0.04em] text-[var(--text-main)]">
              旅行记录
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="toss-card-sm bg-[var(--bg-soft)] p-4">
            <div className="grid gap-3">
              <input
                type="text"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                placeholder="地点 / 城市 / 国家..."
                className="rounded-[16px] border border-[var(--line-soft)] bg-white px-4 py-3 text-sm outline-none"
              />

              <input
                type="date"
                value={destinationDate}
                onChange={(e) => setDestinationDate(e.target.value)}
                className="rounded-[16px] border border-[var(--line-soft)] bg-white px-4 py-3 text-sm outline-none"
              />

              <input
                type="text"
                value={destinationNote}
                onChange={(e) => setDestinationNote(e.target.value)}
                placeholder="备注（可选）"
                className="rounded-[16px] border border-[var(--line-soft)] bg-white px-4 py-3 text-sm outline-none"
              />

              <button
                onClick={onAddDestination}
                className="rounded-[16px] bg-[var(--text-main)] px-4 py-3 text-sm font-medium text-white"
              >
                添加记录
              </button>
            </div>
          </div>

          <div className="custom-scrollbar max-h-[360px] space-y-3 overflow-y-auto pr-2">
            {destinations.length === 0 && (
              <div className="toss-card-sm px-4 py-5 text-sm text-[var(--text-muted)]">
                还没有旅行记录，可以先添加一条。
              </div>
            )}

            {destinations.map((item) => (
              <div key={item.id} className="toss-card-sm px-5 py-4">
                {editingDestinationId === item.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingDestinationName}
                      onChange={(e) => setEditingDestinationName(e.target.value)}
                      className="w-full rounded-[14px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none"
                    />

                    <input
                      type="date"
                      value={editingDestinationDate}
                      onChange={(e) => setEditingDestinationDate(e.target.value)}
                      className="w-full rounded-[14px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none"
                    />

                    <input
                      type="text"
                      value={editingDestinationNote}
                      onChange={(e) => setEditingDestinationNote(e.target.value)}
                      className="w-full rounded-[14px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={onSaveEdit}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text-main)] text-white"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingDestinationId(null);
                          setEditingDestinationName("");
                          setEditingDestinationNote("");
                          setEditingDestinationDate("");
                        }}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-soft)] bg-white text-[var(--text-muted)]"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--text-main)]">
                        {item.name}
                      </p>

                      {item.date && (
                        <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)]">
                          <CalendarDays size={14} />
                          {formatRecordDate(item.date)}
                        </p>
                      )}

                      {item.note && (
                        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                          {item.note}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onStartEdit(item.id, item.name, item.note, item.date)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-soft)] bg-white text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-soft)] bg-white text-[var(--text-muted)] transition hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}