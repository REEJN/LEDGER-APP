"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function uploadFile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { error: "No file selected" };

  const folderId = String(formData.get("folderId") || "") || null;
  const path = `${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("user-files")
    .upload(path, file);

  if (uploadError) return { error: uploadError.message };

  const { error: dbError } = await supabase.from("files").insert({
    user_id: user.id,
    folder_id: folderId,
    storage_path: path,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type,
  });

  if (dbError) return { error: dbError.message };
  revalidatePath("/dashboard/files");
  return { success: true };
}

export async function deleteFile(id: string, storagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("user-files").remove([storagePath]);
  const { error } = await supabase.from("files").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/files");
}

export async function getFileUrl(storagePath: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("user-files")
    .createSignedUrl(storagePath, 60 * 10);
  if (error) return null;
  return data.signedUrl;
}
