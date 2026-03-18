import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type {
  Task,
  TaskOwner,
  TaskCategory,
  TaskPriority,
  TaskType,
} from "../types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const getTodayStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const cleanupOldDailyTasks = async () => {
    const todayStart = getTodayStart();

    const { data, error } = await supabase
      .from("tasks")
      .select("id, created_at, category")
      .eq("category", "daily");

    if (error) {
      console.error("cleanupOldDailyTasks select error:", error.message);
      return;
    }

    if (!data || data.length === 0) return;

    const idsToDelete = data
      .filter((task) => {
        if (!task.created_at) return false;

        const createdAt = new Date(task.created_at);
        if (Number.isNaN(createdAt.getTime())) return false;

        return createdAt.getTime() < todayStart.getTime();
      })
      .map((task) => task.id);

    if (idsToDelete.length === 0) return;

    const { error: deleteError } = await supabase
      .from("tasks")
      .delete()
      .in("id", idsToDelete);

    if (deleteError) {
      console.error("cleanupOldDailyTasks delete error:", deleteError.message);
    }
  };

  const fetchTasks = async () => {
    await cleanupOldDailyTasks();

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("fetchTasks error:", error.message);
      return;
    }

    setTasks(data || []);
  };

  const toggleTask = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, is_completed: newStatus } : task
      )
    );

    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: newStatus })
      .eq("id", id);

    if (error) {
      console.error("toggleTask error:", error.message);
      fetchTasks();
    }
  };

  const handleAddTask = async (
    title: string,
    owner: TaskOwner,
    category: TaskCategory,
    due_date?: string | null,
    description?: string,
    priority: TaskPriority = "medium",
    task_type: TaskType = "other"
  ) => {
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      owner,
      category,
      description: description?.trim() || null,
      priority,
      task_type,
      is_completed: false,
      due_date: category === "scheduled" ? due_date || null : null,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert([payload])
      .select();

    if (error) {
      console.error("handleAddTask error:", error.message);
      return;
    }

    if (data && data.length > 0) {
      setTasks((prev) => [...prev, data[0]]);
    }
  };

  const deleteTask = async (id: number) => {
    const previousTasks = tasks;

    setTasks((prev) => prev.filter((task) => task.id !== id));

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("deleteTask error:", error.message);
      setTasks(previousTasks);
    }
  };

  const saveEdit = async (
    id: number,
    updates: {
      title: string;
      category: TaskCategory;
      due_date?: string | null;
      description?: string;
      priority: TaskPriority;
      task_type: TaskType;
    }
  ) => {
    if (!updates.title.trim()) return;

    const payload = {
      title: updates.title.trim(),
      category: updates.category,
      description: updates.description?.trim() || null,
      priority: updates.priority,
      task_type: updates.task_type,
      due_date:
        updates.category === "scheduled" ? updates.due_date || null : null,
    };

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              title: payload.title,
              category: payload.category,
              description: payload.description,
              priority: payload.priority,
              task_type: payload.task_type,
              due_date: payload.due_date,
            }
          : task
      )
    );

    const { error } = await supabase
      .from("tasks")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.error("saveEdit error:", error.message);
      fetchTasks();
    }
  };

  return {
    tasks,
    fetchTasks,
    toggleTask,
    handleAddTask,
    deleteTask,
    saveEdit,
  };
}