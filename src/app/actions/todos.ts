"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTodoList(folderId: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("todo_lists")
    .insert({ user_id: user.id, folder_id: folderId, title: "Untitled List" })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? "Could not create list");
  revalidatePath("/dashboard");
  redirect(`/dashboard/todos/${data.id}`);
}

export async function renameTodoList(id: string, title: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("todo_lists")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath(`/dashboard/todos/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTodoList(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("todo_lists").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function addTodoItem(listId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { count } = await supabase
    .from("todo_items")
    .select("*", { count: "exact", head: true })
    .eq("list_id", listId);

  const { error } = await supabase
    .from("todo_items")
    .insert({ list_id: listId, user_id: user.id, content, position: count ?? 0 });

  if (error) return { error: error.message };
  revalidatePath(`/dashboard/todos/${listId}`);
  return { success: true };
}

export async function toggleTodoItem(id: string, listId: string, isDone: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("todo_items")
    .update({ is_done: isDone })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath(`/dashboard/todos/${listId}`);
  return { success: true };
}

export async function deleteTodoItem(id: string, listId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("todo_items").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath(`/dashboard/todos/${listId}`);
  return { success: true };
}