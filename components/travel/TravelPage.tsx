"use client";

import { Check, Edit2, Trash2, X, CalendarDays, MapPinned } from "lucide-react";
import type { Destination, DestinationStatus } from "../../hooks/useDestinations";
import TravelHeader from "./TravelHeader";

interface TravelPageProps {
  destinations: Destination[];
  destinationName: string;
  destinationCountry: string;
  destinationNote: string;
  destinationDate: string;
  destinationStatus: DestinationStatus;
  setDestinationName: (value: string) => void;
  setDestinationCountry: (value: string) => void;
  setDestinationNote: (value: string) => void;
  setDestinationDate: (value: string) => void;
  setDestinationStatus: (value: DestinationStatus) => void;
  onAddDestination: () => Promise<void> | void;

  editingDestinationId: number | null;
  editingDestinationName: string;
  editingDestinationCountry: string;
  editingDestinationNote: string;
  editingDestinationDate: string;
  editingDestinationStatus: DestinationStatus;
  setEditingDestinationId: (value: number | null) => void;
  setEditingDestinationName: (value: string) => void;
  setEditingDestinationCountry: (value: string) => void;
  setEditingDestinationNote: (value: string) => void;
  setEditingDestinationDate: (value: string) => void;
  setEditingDestinationStatus: (value: DestinationStatus) => void;

  onStartEdit: (
    id: number,
    name: string,
    note?: string | null,
    date?: string | null,
    country?: string | null,
    status?: DestinationStatus
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

const statusLabelMap: Record<DestinationStatus, string> = {
  wishlist: "想去",
  visited: "已去过",
};

const statusClassMap: Record<DestinationStatus, string> = {
  wishlist: "bg-blue-50 text-blue-700",
  visited: "bg-green-50 text-green-700",
};

export default function TravelPage({
  destinations,
  destinationName,
  destinationCountry,
  destinationNote,
  destinationDate,
  destinationStatus,
  setDestinationName,
  setDestinationCountry,
  setDestinationNote,
  setDestinationDate,
  setDestinationStatus,
  onAddDestination,
  editingDestinationId,
  editingDestinationName,
  editingDestinationCountry,
  editingDestinationNote,
  editingDestinationDate,
  editingDestinationStatus,
  setEditingDestinationId,
  setEditingDestinationName,
  setEditingDestinationCountry,
  setEditingDestinationNote,
  setEditingDestinationDate,
  setEditingDestinationStatus,
  onStartEdit,
  onSaveEdit,
  onDelete,
}: TravelPageProps) {
  const datedCount = destinations.filter((item) => item.date).length;

  return (
    <div className="animate-fade-up flex h-full flex-col">
      <TravelHeader totalCount={destinations.length} datedCount={datedCount} />

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="toss-card p-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
            NEW RECORD
          </p>
          <h2 className="mt-3 text-[30px] font-bold tracking-[-0.04em] text-[var(--text-main)]">
            添加旅行记录
          </h2>

          <div className="mt-6 grid gap-3">
            <input
              type="text"
              value={destinationName}
              onChange={(e) => setDestinationName(e.target.value)}
              placeholder="地点 / 城市..."
              className="rounded-[16px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none"
            />

            <input
              type="text"
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              placeholder="国家..."
              className="rounded-[16px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none"
            />

            <div className="flex flex-wrap gap-2">
              {(["wishlist", "visited"] as DestinationStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setDestinationStatus(status)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    destinationStatus === status
                      ? statusClassMap[status]
                      : "bg-white text-[var(--text-muted)] border border-[var(--line-soft)]"
                  }`}
                >
                  {statusLabelMap[status]}
                </button>
              ))}
            </div>

            <input
              type="date"
              value={destinationDate}
              onChange={(e) => setDestinationDate(e.target.value)}
              className="rounded-[16px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none"
            />

            <textarea
              value={destinationNote}
              onChange={(e) => setDestinationNote(e.target.value)}
              placeholder="备注（可选）"
              className="min-h-[120px] rounded-[16px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none"
            />

            <button
              onClick={onAddDestination}
              className="rounded-[16px] bg-[var(--text-main)] px-4 py-3 text-sm font-medium text-white"
            >
              添加记录
            </button>
          </div>
        </div>

        <div className="toss-card p-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
            RECORDS
          </p>
          <h2 className="mt-3 text-[30px] font-bold tracking-[-0.04em] text-[var(--text-main)]">
            记录列表
          </h2>

          <div className="custom-scrollbar mt-6 max-h-[620px] space-y-3 overflow-y-auto pr-2">
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
                      type="text"
                      value={editingDestinationCountry}
                      onChange={(e) => setEditingDestinationCountry(e.target.value)}
                      className="w-full rounded-[14px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none"
                    />

                    <div className="flex flex-wrap gap-2">
                      {(["wishlist", "visited"] as DestinationStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => setEditingDestinationStatus(status)}
                          className={`rounded-full px-4 py-2 text-sm transition ${
                            editingDestinationStatus === status
                              ? statusClassMap[status]
                              : "bg-white text-[var(--text-muted)] border border-[var(--line-soft)]"
                          }`}
                        >
                          {statusLabelMap[status]}
                        </button>
                      ))}
                    </div>

                    <input
                      type="date"
                      value={editingDestinationDate}
                      onChange={(e) => setEditingDestinationDate(e.target.value)}
                      className="w-full rounded-[14px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none"
                    />

                    <textarea
                      value={editingDestinationNote}
                      onChange={(e) => setEditingDestinationNote(e.target.value)}
                      className="min-h-[100px] w-full rounded-[14px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none"
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
                          setEditingDestinationCountry("");
                          setEditingDestinationNote("");
                          setEditingDestinationDate("");
                          setEditingDestinationStatus("wishlist");
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

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {item.country && (
                          <span className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)]">
                            <MapPinned size={14} />
                            {item.country}
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${statusClassMap[item.status]}`}
                        >
                          {statusLabelMap[item.status]}
                        </span>
                      </div>

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
                          onStartEdit(
                            item.id,
                            item.name,
                            item.note,
                            item.date,
                            item.country,
                            item.status
                          )
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
      </section>
    </div>
  );
}