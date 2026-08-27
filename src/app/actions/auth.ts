"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?message=${encodeURIComponent(error.message)}`);

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const fullName = String(formData.get("fullName") || "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) redirect(`/signup?message=${encodeURIComponent(error.message)}`);

  redirect("/login?message=Check your email to confirm your account");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
