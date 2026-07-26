import { createClient } from "@/libs/supabase/client";
import { Task, TaskStatus } from "@/types/database";

/**
 * Updates specific fields of an existing task in Supabase.
 */
export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id" | "created_at">>,
): Promise<Task> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }

  return data;
}
