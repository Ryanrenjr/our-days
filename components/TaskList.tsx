"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Check,
  Edit2,
  Trash2,
  CalendarDays,
  X,
  AlertTriangle,
} from "lucide-react";
import type {
  Task,
  TaskOwner,
  TaskCategory,
  TaskPriority,
  TaskType,
} from "../types";

type OwnerFilter = "boy" | "girl" | "both" | "all";
type Tone = "blue" | "pink" | "green";

interface TaskListProps {
  tasks: Task[];
  ownerFilter: OwnerFilter;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: Tone;
  emptyText: string;
  onToggle: (id: number, status: boolean) => void;
  onAdd: (
    title: string,
    owner: TaskOwner,
    category: TaskCategory,
    due_date?: string | null,
    description?: string,
    priority?: TaskPriority,
    task_type?: TaskType
  ) => void;
  onDelete: (id: number) => void;
  onEdit: (
    id: number,
    updates: {
      title: string;
      category: TaskCategory;
      due_date?: string | null;
      description?: string;
      priority: TaskPriority;
      task_type: TaskType;
    }
  ) => void;
}

const toneMap: Record<Tone, { soft: string; badge: string }> = {
  blue: {
    soft: "bg-[var(--accent-blue)]",
    badge: "bg-[var(--ring-blue)]",
  },
  pink: {
    soft: "bg-[var(--accent-pink)]",
    badge: "bg-[var(--ring-pink)]",
  },
  green: {
    soft: "bg-[var(--accent-green)]",
    badge: "bg-[var(--ring-green)]",
  },
};

const ownerLabelMap: Record<TaskOwner, string> = {
  boy: "Ryan",
  girl: "Suki",
  both: "共同",
};

const categoryLabelMap: Record<TaskCategory, string> = {
  daily: "当日任务",
  scheduled: "日期任务",
  yearly: "年度目标",
};

const priorityLabelMap: Record<TaskPriority, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const taskTypeLabelMap: Record<TaskType, string> = {
  study: "学习",
  work: "工作",
  health: "健康",
  other: "其他",
};

const taskTypeClassMap: Record<TaskType, string> = {
  study: "bg-blue-50 text-blue-700",
  work: "bg-violet-50 text-violet-700",
  health: "bg-green-50 text-green-700",
  other: "bg-purple-50 text-purple-700",
};

const priorityClassMap: Record<TaskPriority, string> = {
  low: "bg-sky-50 text-sky-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-700",
};

export default function TaskList({
  tasks,
  ownerFilter,
  title,
  subtitle,
  icon: Icon,
  tone,
  emptyText,
  onToggle,
  onAdd,
  onDelete,
  onEdit,
}: TaskListProps) {
  const [inputValue, setInputValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<TaskCategory>("daily");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPriority, setSelectedPriority] =
    useState<TaskPriority>("medium");
  const [selectedTaskType, setSelectedTaskType] =
    useState<TaskType>("other");
  const [isAddExpanded, setIsAddExpanded] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<TaskCategory>("daily");
  const [editDate, setEditDate] = useState("");
  const [editPriority, setEditPriority] = useState<TaskPriority>("medium");
  const [editTaskType, setEditTaskType] = useState<TaskType>("other");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const today = new Date();
  const dayNumber = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
  }).format(today);
  const monthWeekText = `${new Intl.DateTimeFormat("en-GB", {
    month: "long",
  }).format(today)} · ${new Intl.DateTimeFormat("zh-CN", {
    weekday: "long",
  }).format(today)}`;

  const isToday = (dateString?: string | null) => {
    if (!dateString) return false;

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return false;

    const now = new Date();

    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  const filteredTasks =
    ownerFilter === "all"
      ? tasks.filter((t) => {
          if (t.category !== selectedCategory) return false;
          if (selectedCategory === "daily") return isToday(t.created_at);
          return true;
        })
      : tasks.filter((t) => {
          if (t.owner !== ownerFilter) return false;
          if (t.category !== selectedCategory) return false;
          if (selectedCategory === "daily") return isToday(t.created_at);
          return true;
        });

  const completedCount = filteredTasks.filter((t) => t.is_completed).length;
  const pendingCount = filteredTasks.filter((t) => !t.is_completed).length;
  const progress =
    filteredTasks.length === 0
      ? 0
      : Math.round((completedCount / filteredTasks.length) * 100);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (a.is_completed !== b.is_completed) {
        return a.is_completed ? 1 : -1;
      }

      if (selectedCategory === "scheduled") {
        const aTime = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const bTime = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return aTime - bTime;
      }

      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return a.id - b.id;
    });
  }, [filteredTasks, selectedCategory]);

  const handleAddSubmit = () => {
    if (ownerFilter === "all") return;
    if (!inputValue.trim()) return;

    onAdd(
      inputValue.trim(),
      ownerFilter,
      selectedCategory,
      selectedCategory === "scheduled" ? selectedDate || null : null,
      descriptionValue,
      selectedPriority,
      selectedTaskType
    );

    setInputValue("");
    setDescriptionValue("");
    setSelectedPriority("medium");
    setSelectedTaskType("other");
    if (selectedCategory === "scheduled") {
      setSelectedDate("");
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditCategory(task.category);
    setEditDate(task.due_date || "");
    setEditPriority(task.priority);
    setEditTaskType(task.task_type);
  };

  const handleEditSubmit = (id: number) => {
    if (!editTitle.trim()) return;

    onEdit(id, {
      title: editTitle.trim(),
      category: editCategory,
      due_date: editCategory === "scheduled" ? editDate || null : null,
      description: editDescription,
      priority: editPriority,
      task_type: editTaskType,
    });

    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditCategory("daily");
    setEditDate("");
    setEditPriority("medium");
    setEditTaskType("other");
  };

  const formatDueDate = (dateString?: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("zh-CN", {
      month: "numeric",
      day: "numeric",
    }).format(date);
  };

  const formatLargeDate = (dateString?: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;

    const day = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
    }).format(date);
    const month = new Intl.DateTimeFormat("zh-CN", {
      month: "short",
    }).format(date);

    return { day, month };
  };

  const getCountdownText = (dateString?: string | null) => {
    if (!dateString) return null;

    const today = new Date();
    const target = new Date(dateString);

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfTarget = new Date(
      target.getFullYear(),
      target.getMonth(),
      target.getDate()
    );

    const diffMs = startOfTarget.getTime() - startOfToday.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "明天";
    if (diffDays > 1) return `还有 ${diffDays} 天`;
    if (diffDays === -1) return "已过期 1 天";
    return `已过期 ${Math.abs(diffDays)} 天`;
  };

  const isOverdue = (task: Task) => {
    if (task.category !== "scheduled") return false;
    if (task.is_completed) return false;
    if (!task.due_date) return false;

    const due = new Date(task.due_date);
    if (Number.isNaN(due.getTime())) return false;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(
      due.getFullYear(),
      due.getMonth(),
      due.getDate()
    );

    return dueDay.getTime() < today.getTime();
  };

  const toneClass = toneMap[tone];

  return (
    <div className="animate-fade-up flex h-full flex-col">
      <header className="mb-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-soft)]">
              {title}
            </p>

            <div className="mt-3 flex items-end gap-4">
              <span className="text-7xl font-semibold leading-none tracking-[-0.08em] text-[var(--text-main)] md:text-8xl">
                {dayNumber}
              </span>

              <div className="pb-2">
                <p className="text-xl font-medium tracking-[-0.03em] text-[var(--text-main)]">
                  {monthWeekText}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 self-start xl:self-auto">
            <div className="toss-card-sm px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">
                all
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                {filteredTasks.length}
              </p>
            </div>
            <div className="toss-card-sm px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">
                done
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                {completedCount}
              </p>
            </div>
            <div className="toss-card-sm px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">
                left
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mb-6 inline-flex w-fit rounded-full bg-black/5 p-1">
        {[
          { key: "daily", label: "当日任务" },
          { key: "scheduled", label: "日期任务" },
          { key: "yearly", label: "年度目标" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSelectedCategory(item.key as TaskCategory)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              selectedCategory === item.key
                ? "bg-white shadow-sm text-[var(--text-main)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {ownerFilter !== "all" && (
        <div className="toss-card mb-8 p-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsAddExpanded(true)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubmit()}
                placeholder={`添加${categoryLabelMap[selectedCategory]}标题...`}
                className="flex-1 rounded-[18px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-[15px] outline-none"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpanded((prev) => !prev)}
                  className="rounded-[16px] border border-[var(--line-soft)] bg-white px-4 py-3 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
                >
                  {isAddExpanded ? "收起" : "更多"}
                </button>

                <button
                  type="button"
                  onClick={handleAddSubmit}
                  className={`rounded-[16px] px-5 py-3 text-sm font-medium text-[var(--text-main)] ${toneClass.soft}`}
                >
                  添加
                </button>
              </div>
            </div>

            {isAddExpanded && (
              <div className="rounded-[18px] bg-[var(--bg-soft)] p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {(["study", "work", "health", "other"] as TaskType[]).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedTaskType(type)}
                          className={`rounded-full px-4 py-2 text-sm transition ${
                            selectedTaskType === type
                              ? taskTypeClassMap[type]
                              : "bg-white text-[var(--text-muted)] border border-[var(--line-soft)]"
                          }`}
                        >
                          {taskTypeLabelMap[type]}
                        </button>
                      )
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(["low", "medium", "high"] as TaskPriority[]).map(
                      (priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => setSelectedPriority(priority)}
                          className={`rounded-full px-4 py-2 text-sm transition ${
                            selectedPriority === priority
                              ? priorityClassMap[priority]
                              : "bg-white text-[var(--text-muted)] border border-[var(--line-soft)]"
                          }`}
                        >
                          {priorityLabelMap[priority]}优先级
                        </button>
                      )
                    )}
                  </div>

                  <textarea
                    value={descriptionValue}
                    onChange={(e) => setDescriptionValue(e.target.value)}
                    placeholder="备注（可选）"
                    className="min-h-[88px] rounded-[16px] border border-[var(--line-soft)] bg-white px-4 py-3 text-[15px] outline-none"
                  />

                  {selectedCategory === "scheduled" && (
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="rounded-[16px] border border-[var(--line-soft)] bg-white px-4 py-3 text-sm outline-none"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="h-2 overflow-hidden rounded-full bg-black/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${toneClass.badge}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          当前分类：{categoryLabelMap[selectedCategory]} · 已完成 {completedCount} 项
        </p>
      </div>

      <ul className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1">
        {sortedTasks.length === 0 && (
          <div className="toss-card flex h-60 items-center justify-center px-8 text-center text-[15px] leading-7 text-[var(--text-muted)]">
            {emptyText}
          </div>
        )}

        {sortedTasks.map((task) => (
          <li key={task.id} className="toss-card p-5">
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => onToggle(task.id, task.is_completed)}
                className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition ${
                  task.is_completed
                    ? "border-transparent bg-[var(--text-main)] text-white"
                    : "border-black/15 bg-white text-transparent hover:border-black/25"
                }`}
              >
                <Check size={14} strokeWidth={3} />
              </button>

              <div className="min-w-0 flex-1">
                {editingId === task.id ? (
                  <div className="space-y-3">
                    <input
                      autoFocus
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-[14px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-[15px] outline-none"
                    />

                    <div className="flex flex-wrap gap-2">
                      {(["study", "work", "health", "other"] as TaskType[]).map(
                        (type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setEditTaskType(type)}
                            className={`rounded-full px-4 py-2 text-sm transition ${
                              editTaskType === type
                                ? taskTypeClassMap[type]
                                : "bg-white text-[var(--text-muted)] border border-[var(--line-soft)]"
                            }`}
                          >
                            {taskTypeLabelMap[type]}
                          </button>
                        )
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(["low", "medium", "high"] as TaskPriority[]).map(
                        (priority) => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => setEditPriority(priority)}
                            className={`rounded-full px-4 py-2 text-sm transition ${
                              editPriority === priority
                                ? priorityClassMap[priority]
                                : "bg-white text-[var(--text-muted)] border border-[var(--line-soft)]"
                            }`}
                          >
                            {priorityLabelMap[priority]}优先级
                          </button>
                        )
                      )}
                    </div>

                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="min-h-[90px] w-full rounded-[14px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-[15px] outline-none"
                    />

                    <div className="inline-flex rounded-full bg-black/5 p-1">
                      {(["daily", "scheduled", "yearly"] as TaskCategory[]).map(
                        (item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setEditCategory(item)}
                            className={`rounded-full px-4 py-2 text-sm transition ${
                              editCategory === item
                                ? "bg-white shadow-sm text-[var(--text-main)]"
                                : "text-[var(--text-muted)]"
                            }`}
                          >
                            {categoryLabelMap[item]}
                          </button>
                        )
                      )}
                    </div>

                    {editCategory === "scheduled" && (
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full rounded-[14px] border border-[var(--line-soft)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none"
                      />
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditSubmit(task.id)}
                        className="inline-flex items-center justify-center rounded-full bg-[var(--text-main)] p-2 text-white"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditTitle("");
                          setEditDescription("");
                          setEditCategory("daily");
                          setEditDate("");
                          setEditPriority("medium");
                          setEditTaskType("other");
                        }}
                        className="inline-flex items-center justify-center rounded-full border border-[var(--line-soft)] bg-white p-2 text-[var(--text-muted)]"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ) : task.category === "scheduled" ? (
                  <div className="flex items-start gap-4">
                    <div className="flex min-w-[72px] flex-col items-center rounded-[18px] bg-[var(--bg-soft)] px-3 py-3">
                      <span className="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">
                        {formatLargeDate(task.due_date)?.month || ""}
                      </span>
                      <span className="mt-1 text-3xl font-semibold leading-none tracking-[-0.06em] text-[var(--text-main)]">
                        {formatLargeDate(task.due_date)?.day || "--"}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[17px] leading-7 tracking-[-0.02em] transition ${
                            task.is_completed
                              ? "text-[var(--text-soft)] line-through"
                              : isOverdue(task)
                              ? "text-red-600"
                              : "text-[var(--text-main)]"
                          }`}
                        >
                          {task.title}
                        </span>

                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${taskTypeClassMap[task.task_type]}`}
                        >
                          {taskTypeLabelMap[task.task_type]}
                        </span>

                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${priorityClassMap[task.priority]}`}
                        >
                          {priorityLabelMap[task.priority]}
                        </span>

                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs text-[var(--text-main)] ${toneClass.soft}`}
                        >
                          {ownerLabelMap[task.owner]}
                        </span>

                        {formatDueDate(task.due_date) && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                              isOverdue(task)
                                ? "bg-red-50 text-red-600"
                                : "bg-black/[0.04] text-[var(--text-muted)]"
                            }`}
                          >
                            <CalendarDays size={12} />
                            {formatDueDate(task.due_date)}
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-2 text-sm ${
                          isOverdue(task)
                            ? "text-red-500"
                            : "text-[var(--text-muted)]"
                        }`}
                      >
                        {getCountdownText(task.due_date)}
                      </p>

                      {task.description && (
                        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[17px] leading-7 tracking-[-0.02em] transition ${
                          task.is_completed
                            ? "text-[var(--text-soft)] line-through"
                            : "text-[var(--text-main)]"
                        }`}
                      >
                        {task.title}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${taskTypeClassMap[task.task_type]}`}
                      >
                        {taskTypeLabelMap[task.task_type]}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${priorityClassMap[task.priority]}`}
                      >
                        {priorityLabelMap[task.priority]}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs text-[var(--text-main)] ${toneClass.soft}`}
                      >
                        {ownerLabelMap[task.owner]}
                      </span>

                      <span className="inline-flex items-center rounded-full bg-black/[0.04] px-2.5 py-1 text-xs text-[var(--text-muted)]">
                        {categoryLabelMap[task.category]}
                      </span>
                    </div>

                    {task.description && (
                      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                        {task.description}
                      </p>
                    )}
                  </>
                )}
              </div>

              {editingId !== task.id && (
                <div className="flex items-center gap-2">
                  {deleteConfirmId === task.id ? (
                    <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2">
                      <AlertTriangle size={14} className="text-red-500" />
                      <span className="text-xs text-red-600">确认删除？</span>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(task.id);
                          setDeleteConfirmId(null);
                        }}
                        className="text-xs font-medium text-red-600"
                      >
                        是
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-xs font-medium text-[var(--text-muted)]"
                      >
                        否
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(task)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-soft)] bg-white text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(task.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-soft)] bg-white text-[var(--text-muted)] transition hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}