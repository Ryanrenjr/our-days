export type TaskOwner = "boy" | "girl" | "both";
export type TaskCategory = "daily" | "yearly" | "scheduled";
export type TaskPriority = "low" | "medium" | "high";
export type TaskType = "study" | "work" | "health" | "other";

export type Task = {
  id: number;
  title: string;
  description?: string | null;
  is_completed: boolean;
  owner: TaskOwner;
  category: TaskCategory;
  priority: TaskPriority;
  task_type: TaskType;
  due_date?: string | null;
  created_at?: string | null;
};

export type Tab = "overview" | "boy" | "girl" | "both" | "travel";

export type DashboardNote = {
  id: number;
  content: string;
  created_at?: string | null;
};