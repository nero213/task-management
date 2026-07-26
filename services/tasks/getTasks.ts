import { createClient } from "@/libs/supabase/client";
import { Task } from "@/types/database";

/**
 * Fetches all tasks from Supabase ordered by newest first.
 */
export async function getTasks(): Promise<Task[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }

  return data || [];
}
