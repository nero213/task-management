import { createClient } from "@/libs/supabase/client";
import { Task, TaskStatus } from "@/types/database";

/**
 * Creates a new task in Supabase.
 */
export async function addTask(
  title: string,
  description?: string,
  status: TaskStatus = "todo",
): Promise<Task> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        title,
        description: description || null,
        status,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  return data;
}
