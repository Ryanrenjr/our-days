"use client";

import { useEffect, useMemo, useState } from "react";
import { User, Sparkles, Heart, MapPinned } from "lucide-react";
import type { Task, Tab } from "../types";
import { useTasks } from "../hooks/useTasks";
import { useDashboardNote } from "../hooks/useDashboardNote";
import {
  useDestinations,
  type DestinationStatus,
  type DestinationDatePrecision,
} from "../hooks/useDestinations";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import OverviewHeader from "../components/overview/OverviewHeader";
import SpaceCard from "../components/overview/SpaceCard";
import TravelPage from "../components/travel/TravelPage";

export default function ClientHome() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState("");

  const [destinationName, setDestinationName] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [destinationNote, setDestinationNote] = useState("");
  const [destinationDate, setDestinationDate] = useState("");
  const [destinationStatus, setDestinationStatus] =
    useState<DestinationStatus>("wishlist");
  const [destinationDatePrecision, setDestinationDatePrecision] =
    useState<DestinationDatePrecision>("day");

  const [editingDestinationId, setEditingDestinationId] = useState<number | null>(
    null
  );
  const [editingDestinationName, setEditingDestinationName] = useState("");
  const [editingDestinationCountry, setEditingDestinationCountry] = useState("");
  const [editingDestinationNote, setEditingDestinationNote] = useState("");
  const [editingDestinationDate, setEditingDestinationDate] = useState("");
  const [editingDestinationStatus, setEditingDestinationStatus] =
    useState<DestinationStatus>("wishlist");
  const [editingDestinationDatePrecision, setEditingDestinationDatePrecision] =
    useState<DestinationDatePrecision>("day");

  const taskState = useTasks();
  const tasks: Task[] = Array.isArray(taskState.tasks) ? taskState.tasks : [];

  const toggleTask = taskState.toggleTask;
  const handleAddTask = taskState.handleAddTask;
  const deleteTask = taskState.deleteTask;
  const saveEdit = taskState.saveEdit;

  const { note, updateNote } = useDashboardNote();
  const {
    destinations,
    addDestination,
    updateDestination,
    deleteDestination,
  } = useDestinations();

  useEffect(() => {
    if (note) {
      setNoteInput(note.content);
    }
  }, [note]);

  const now = useMemo(() => new Date(), []);
  const dayNumber = useMemo(() => {
    return new Intl.DateTimeFormat("en-GB", { day: "numeric" }).format(now);
  }, [now]);

  const monthWeekText = useMemo(() => {
    const month = new Intl.DateTimeFormat("en-GB", {
      month: "long",
    }).format(now);
    const weekday = new Intl.DateTimeFormat("zh-CN", {
      weekday: "long",
    }).format(now);
    return `${month} · ${weekday}`;
  }, [now]);

  const boyTasks = tasks.filter((t) => t.owner === "boy");
  const girlTasks = tasks.filter((t) => t.owner === "girl");
  const bothTasks = tasks.filter((t) => t.owner === "both");

  const boyPending = boyTasks.filter(
    (t) => t.category === "daily" && !t.is_completed
  ).length;
  const girlPending = girlTasks.filter(
    (t) => t.category === "daily" && !t.is_completed
  ).length;
  const bothPending = bothTasks.filter(
    (t) => t.category === "daily" && !t.is_completed
  ).length;

  const boyDaily = boyTasks.filter((t) => t.category === "daily");
  const girlDaily = girlTasks.filter((t) => t.category === "daily");
  const bothDaily = bothTasks.filter((t) => t.category === "daily");

  const boyDailyDone = boyDaily.filter((t) => t.is_completed).length;
  const girlDailyDone = girlDaily.filter((t) => t.is_completed).length;
  const bothDailyDone = bothDaily.filter((t) => t.is_completed).length;

  const boyDailyProgress =
    boyDaily.length === 0 ? 0 : Math.round((boyDailyDone / boyDaily.length) * 100);

  const girlDailyProgress =
    girlDaily.length === 0
      ? 0
      : Math.round((girlDailyDone / girlDaily.length) * 100);

  const bothDailyProgress =
    bothDaily.length === 0
      ? 0
      : Math.round((bothDailyDone / bothDaily.length) * 100);

  const formatTravelDate = (
    dateString?: string | null,
    precision: DestinationDatePrecision = "day"
  ) => {
    if (!dateString) return "未设日期";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "未设日期";

    if (precision === "month") {
      return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
      }).format(date);
    }

    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(date);
  };

  const getDestinationSortValue = (item: { date?: string | null }) => {
    if (!item.date) return Number.POSITIVE_INFINITY;
    const d = new Date(item.date);
    if (Number.isNaN(d.getTime())) return Number.POSITIVE_INFINITY;
    return d.getTime();
  };

  const sortedDestinations = [...destinations].sort((a, b) => {
    const current = new Date();
    const today = new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate()
    ).getTime();

    const aTime = getDestinationSortValue(a);
    const bTime = getDestinationSortValue(b);

    const aFuture = aTime >= today;
    const bFuture = bTime >= today;

    if (aFuture && !bFuture) return -1;
    if (!aFuture && bFuture) return 1;

    if (aFuture && bFuture) return aTime - bTime;

    return bTime - aTime;
  });

  const nextDestination = [...destinations]
    .filter((item) => item.status === "wishlist" && item.date)
    .sort((a, b) => {
      const aTime = new Date(a.date as string).getTime();
      const bTime = new Date(b.date as string).getTime();
      return aTime - bTime;
    })
    .find((item) => {
      const current = new Date();
      const today = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate()
      ).getTime();
      return new Date(item.date as string).getTime() >= today;
    });

  const fallbackDestination =
    [...destinations]
      .filter((item) => item.status === "wishlist")
      .sort((a, b) => {
        const aTime = a.date ? new Date(a.date).getTime() : Infinity;
        const bTime = b.date ? new Date(b.date).getTime() : Infinity;
        return aTime - bTime;
      })[0] || destinations[0];

  const featuredDestination = nextDestination || fallbackDestination;

  const handleAddDestination = async () => {
    if (!destinationName.trim()) return;

    await addDestination(
      destinationName,
      destinationNote,
      destinationDate || null,
      destinationCountry,
      destinationStatus,
      destinationDatePrecision
    );

    setDestinationName("");
    setDestinationCountry("");
    setDestinationNote("");
    setDestinationDate("");
    setDestinationStatus("wishlist");
    setDestinationDatePrecision("day");
  };

  const startEditDestination = (
    id: number,
    name: string,
    note?: string | null,
    date?: string | null,
    country?: string | null,
    status?: DestinationStatus,
    datePrecision?: DestinationDatePrecision
  ) => {
    setEditingDestinationId(id);
    setEditingDestinationName(name);
    setEditingDestinationCountry(country || "");
    setEditingDestinationNote(note || "");
    setEditingDestinationDate(date || "");
    setEditingDestinationStatus(status || "wishlist");
    setEditingDestinationDatePrecision(datePrecision || "day");
  };

  const saveDestinationEdit = async () => {
    if (editingDestinationId === null) return;

    await updateDestination(
      editingDestinationId,
      editingDestinationName,
      editingDestinationNote,
      editingDestinationDate || null,
      editingDestinationCountry,
      editingDestinationStatus,
      editingDestinationDatePrecision
    );

    setEditingDestinationId(null);
    setEditingDestinationName("");
    setEditingDestinationCountry("");
    setEditingDestinationNote("");
    setEditingDestinationDate("");
    setEditingDestinationStatus("wishlist");
    setEditingDestinationDatePrecision("day");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-[var(--accent-pink)] opacity-40 blur-3xl" />
        <div className="absolute top-[18%] right-[-40px] h-80 w-80 rounded-full bg-[var(--accent-blue)] opacity-40 blur-3xl" />
        <div className="absolute bottom-[-40px] left-[28%] h-72 w-72 rounded-full bg-[var(--accent-green)] opacity-30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab)}
        />

        <main className="flex-1 px-5 py-5 md:px-7 md:py-7 lg:px-8 lg:py-8">
          <div className="glass-panel h-full min-h-[calc(100vh-40px)] rounded-[34px] p-6 md:p-8 lg:p-10">
            {activeTab === "overview" && (
              <div className="animate-fade-up">
                <OverviewHeader
                  dayNumber={dayNumber}
                  monthWeekText={monthWeekText}
                  note={note?.content || ""}
                  noteInput={noteInput}
                  isEditingNote={isEditingNote}
                  setNoteInput={setNoteInput}
                  setIsEditingNote={setIsEditingNote}
                  onSaveNote={async () => {
                    await updateNote(noteInput);
                    setIsEditingNote(false);
                  }}
                />

                <section className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <SpaceCard
                    label="RYAN"
                    title="Ryan的空间"
                    description={`${boyPending} 个今日待办`}
                    progress={boyDailyProgress}
                    icon={User}
                    iconBgClass="bg-[var(--accent-blue)]"
                    ringToneClass="text-[var(--ring-blue)]"
                    onClick={() => setActiveTab("boy")}
                  />

                  <SpaceCard
                    label="SUKI"
                    title="Suki的空间"
                    description={`${girlPending} 个今日待办`}
                    progress={girlDailyProgress}
                    icon={Sparkles}
                    iconBgClass="bg-[var(--accent-pink)]"
                    ringToneClass="text-[var(--ring-pink)]"
                    onClick={() => setActiveTab("girl")}
                  />

                  <SpaceCard
                    label="TOGETHER"
                    title="共同计划"
                    description={`${bothPending} 个今日待办`}
                    progress={bothDailyProgress}
                    icon={Heart}
                    iconBgClass="bg-[var(--accent-green)]"
                    ringToneClass="text-[var(--ring-green)]"
                    onClick={() => setActiveTab("both")}
                    wideOnMedium
                  />
                </section>

                <section className="grid grid-cols-1 gap-5">
                  <div className="toss-card p-8 md:p-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                          NEXT DESTINATION
                        </p>
                        <h2 className="mt-3 text-[30px] font-bold tracking-[-0.04em] text-[var(--text-main)]">
                          下个目的地
                        </h2>
                      </div>

                      <button
                        onClick={() => setActiveTab("travel")}
                        className="rounded-full border border-[var(--line-soft)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
                      >
                        查看全部
                      </button>
                    </div>

                    {!featuredDestination ? (
                      <div className="mt-6 toss-card-sm px-5 py-6 text-sm text-[var(--text-muted)]">
                        还没有旅行记录，可以先添加一条。
                      </div>
                    ) : (
                      <div className="mt-6 toss-card-sm p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-medium uppercase tracking-[0.12em] text-[var(--text-soft)]">
                              {featuredDestination.status === "wishlist"
                                ? "WISHLIST"
                                : "VISITED"}
                            </p>

                            <h3 className="mt-3 text-[36px] font-bold tracking-[-0.05em] text-[var(--text-main)] md:text-[44px]">
                              {featuredDestination.name}
                            </h3>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              {featuredDestination.country && (
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                                  {featuredDestination.country}
                                </span>
                              )}

                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${
                                  featuredDestination.status === "wishlist"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-green-50 text-green-700"
                                }`}
                              >
                                {featuredDestination.status === "wishlist"
                                  ? "想去"
                                  : "已去过"}
                              </span>
                            </div>

                            <p className="mt-5 text-sm font-medium text-[var(--text-muted)]">
                              {formatTravelDate(
                                featuredDestination.date,
                                featuredDestination.date_precision
                              )}
                            </p>

                            {featuredDestination.note && (
                              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--text-muted)]">
                                {featuredDestination.note}
                              </p>
                            )}
                          </div>

                          <MapPinned
                            size={20}
                            className="text-[var(--text-soft)]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "travel" && (
  <TravelPage
    destinations={sortedDestinations}
    destinationName={destinationName}
    destinationCountry={destinationCountry}
    destinationNote={destinationNote}
    destinationDate={destinationDate}
    destinationStatus={destinationStatus}
    destinationDatePrecision={destinationDatePrecision}
    setDestinationName={setDestinationName}
    setDestinationCountry={setDestinationCountry}
    setDestinationNote={setDestinationNote}
    setDestinationDate={setDestinationDate}
    setDestinationStatus={setDestinationStatus}
    setDestinationDatePrecision={setDestinationDatePrecision}
    onAddDestination={handleAddDestination}
    editingDestinationId={editingDestinationId}
    editingDestinationName={editingDestinationName}
    editingDestinationCountry={editingDestinationCountry}
    editingDestinationNote={editingDestinationNote}
    editingDestinationDate={editingDestinationDate}
    editingDestinationStatus={editingDestinationStatus}
    editingDestinationDatePrecision={editingDestinationDatePrecision}
    setEditingDestinationId={setEditingDestinationId}
    setEditingDestinationName={setEditingDestinationName}
    setEditingDestinationCountry={setEditingDestinationCountry}
    setEditingDestinationNote={setEditingDestinationNote}
    setEditingDestinationDate={setEditingDestinationDate}
    setEditingDestinationStatus={setEditingDestinationStatus}
    setEditingDestinationDatePrecision={setEditingDestinationDatePrecision}
    onStartEdit={startEditDestination}
    onSaveEdit={saveDestinationEdit}
    onDelete={deleteDestination}
  />
)}

            {activeTab === "boy" && (
              <TaskList
                tasks={tasks}
                ownerFilter="boy"
                title="Ryan的空间"
                subtitle="把今天要完成的事，一件件轻轻放进来。"
                icon={User}
                tone="blue"
                emptyText="这里还没有新的安排，先记录今天最重要的一件事吧。"
                onToggle={toggleTask}
                onAdd={handleAddTask}
                onDelete={deleteTask}
                onEdit={saveEdit}
              />
            )}

            {activeTab === "girl" && (
              <TaskList
                tasks={tasks}
                ownerFilter="girl"
                title="Suki的空间"
                subtitle="她的学习、目标和日常节奏，都可以安静地放在这里。"
                icon={Sparkles}
                tone="pink"
                emptyText="这里还没有新的安排，先写下一件想完成的小事吧。"
                onToggle={toggleTask}
                onAdd={handleAddTask}
                onDelete={deleteTask}
                onEdit={saveEdit}
              />
            )}

            {activeTab === "both" && (
              <TaskList
                tasks={tasks}
                ownerFilter="both"
                title="共同计划"
                subtitle="一起要去的地方，一起要做的事，都值得好好记录。"
                icon={Heart}
                tone="green"
                emptyText="这里还没有共同计划，先写下一件你们想一起完成的事。"
                onToggle={toggleTask}
                onAdd={handleAddTask}
                onDelete={deleteTask}
                onEdit={saveEdit}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}