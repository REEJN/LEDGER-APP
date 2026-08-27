"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createFolder(name: string, parentId: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("folders")
    .insert({ user_id: user.id, name: name || "New Folder", parent_id: parentId });

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
}

export async function renameFolder(id: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("folders")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
}

export async function deleteFolder(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("folders").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
}
