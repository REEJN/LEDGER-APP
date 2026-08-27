"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createNote(folderId: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("notes")
    .insert({ user_id: user.id, folder_id: folderId, title: "Untitled", content: "" })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? "Could not create note");
  revalidatePath("/dashboard");
  redirect(`/dashboard/notes/${data.id}`);
}

export async function updateNote(id: string, title: string, content: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath(`/dashboard/notes/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}