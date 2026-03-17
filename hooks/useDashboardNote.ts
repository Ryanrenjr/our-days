import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { DashboardNote } from "../types";

export function useDashboardNote() {
  const [note, setNote] = useState<DashboardNote | null>(null);

  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {
    const { data, error } = await supabase
      .from("dashboard_notes")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error("fetchNote error:", error.message);
      return;
    }

    setNote(data);
  };

  const updateNote = async (content: string) => {
    if (!note) return;

    const trimmed = content.trim();
    if (!trimmed) return;

    setNote({ ...note, content: trimmed });

    const { error } = await supabase
      .from("dashboard_notes")
      .update({ content: trimmed })
      .eq("id", note.id);

    if (error) {
      console.error("updateNote error:", error.message);
      fetchNote();
    }
  };

  return {
    note,
    updateNote,
  };
}