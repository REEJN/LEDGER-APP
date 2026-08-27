"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const startTime = String(formData.get("start_time") || "").trim() || null;
  const endTime = String(formData.get("end_time") || "").trim() || null;

  if (!title || !date) return { error: "Title and date are required" };

  const { error } = await supabase.from("events").insert({
    user_id: user.id,
    title,
    date,
    start_time: startTime,
    end_time: endTime,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/schedule");
  return { success: true };
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/schedule");
  return { success: true };
}