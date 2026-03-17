"use client";

import { useEffect, useMemo, useState } from "react";
import { User, Sparkles, Heart, MapPinned } from "lucide-react";
import type { Task, Tab } from "../types";
import { useTasks } from "../hooks/useTasks";
import { useDashboardNote } from "../hooks/useDashboardNote";
import { useDestinations } from "../hooks/useDestinations";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import OverviewHeader from "../components/overview/OverviewHeader";
import SpaceCard from "../components/overview/SpaceCard";
import DestinationsCard from "../components/overview/DestinationsCard";
import TravelPage from "../components/travel/TravelPage";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState("");

  const [destinationName, setDestinationName] = useState("");
const [destinationCountry, setDestinationCountry] = useState("");
const [destinationNote, setDestinationNote] = useState("");
const [destinationDate, setDestinationDate] = useState("");
const [destinationStatus, setDestinationStatus] =
  useState<"wishlist" | "visited">("wishlist");

const [editingDestinationId, setEditingDestinationId] = useState<number | null>(
  null
);
const [editingDestinationName, setEditingDestinationName] = useState("");
const [editingDestinationCountry, setEditingDestinationCountry] = useState("");
const [editingDestinationNote, setEditingDestinationNote] = useState("");
const [editingDestinationDate, setEditingDestinationDate] = useState("");
const [editingDestinationStatus, setEditingDestinationStatus] =
  useState<"wishlist" | "visited">("wishlist");

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

const nextDestination =
  destinations.find((item) => item.status === "wishlist") || destinations[0];

const formatTravelDate = (dateString?: string | null) => {
  if (!dateString) return "未设日期";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "未设日期";

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);
};

const handleAddDestination = async () => {
  if (!destinationName.trim()) return;

  await addDestination(
    destinationName,
    destinationNote,
    destinationDate || null,
    destinationCountry,
    destinationStatus
  );

  setDestinationName("");
  setDestinationCountry("");
  setDestinationNote("");
  setDestinationDate("");
  setDestinationStatus("wishlist");
};

  const startEditDestination = (
  id: number,
  name: string,
  note?: string | null,
  date?: string | null,
  country?: string | null,
  status?: "wishlist" | "visited"
) => {
  setEditingDestinationId(id);
  setEditingDestinationName(name);
  setEditingDestinationCountry(country || "");
  setEditingDestinationNote(note || "");
  setEditingDestinationDate(date || "");
  setEditingDestinationStatus(status || "wishlist");
};
  const saveDestinationEdit = async () => {
  if (editingDestinationId === null) return;


  await updateDestination(
    editingDestinationId,
    editingDestinationName,
    editingDestinationNote,
    editingDestinationDate || null,
    editingDestinationCountry,
    editingDestinationStatus
  );

  setEditingDestinationId(null);
  setEditingDestinationName("");
  setEditingDestinationCountry("");
  setEditingDestinationNote("");
  setEditingDestinationDate("");
  setEditingDestinationStatus("wishlist");
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

    {!nextDestination ? (
      <div className="mt-6 toss-card-sm px-5 py-6 text-sm text-[var(--text-muted)]">
        还没有旅行记录，可以先添加一条。
      </div>
    ) : (
      <div className="mt-6 toss-card-sm p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium uppercase tracking-[0.12em] text-[var(--text-soft)]">
              {nextDestination.status === "wishlist" ? "WISHLIST" : "VISITED"}
            </p>

            <h3 className="mt-3 text-[36px] font-bold tracking-[-0.05em] text-[var(--text-main)] md:text-[44px]">
              {nextDestination.name}
            </h3>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {nextDestination.country && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                  {nextDestination.country}
                </span>
              )}

              <span
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${
                  nextDestination.status === "wishlist"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {nextDestination.status === "wishlist" ? "想去" : "已去过"}
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-[var(--text-muted)]">
              {formatTravelDate(nextDestination.date)}
            </p>

            {nextDestination.note && (
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--text-muted)]">
                {nextDestination.note}
              </p>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</section>
              </div>
            )}

            {activeTab === "travel" && (
              <TravelPage
                destinations={destinations}
                destinationName={destinationName}
                destinationCountry={destinationCountry}
                destinationNote={destinationNote}
                destinationDate={destinationDate}
                destinationStatus={destinationStatus}
                setDestinationName={setDestinationName}
                setDestinationCountry={setDestinationCountry}
                setDestinationNote={setDestinationNote}
                setDestinationDate={setDestinationDate}
                setDestinationStatus={setDestinationStatus}
                onAddDestination={handleAddDestination}
                editingDestinationId={editingDestinationId}
                editingDestinationName={editingDestinationName}
                editingDestinationCountry={editingDestinationCountry}
                editingDestinationNote={editingDestinationNote}
                editingDestinationDate={editingDestinationDate}
                editingDestinationStatus={editingDestinationStatus}
                setEditingDestinationId={setEditingDestinationId}
                setEditingDestinationName={setEditingDestinationName}
                setEditingDestinationCountry={setEditingDestinationCountry}
                setEditingDestinationNote={setEditingDestinationNote}
                setEditingDestinationDate={setEditingDestinationDate}
                setEditingDestinationStatus={setEditingDestinationStatus}
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