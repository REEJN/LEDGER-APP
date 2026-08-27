import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: notes }, { data: todoLists }, { data: folders }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("notes").select("*").order("updated_at", { ascending: false }),
      supabase.from("todo_lists").select("*").order("updated_at", { ascending: false }),
      supabase.from("folders").select("*").order("name", { ascending: true }),
    ]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        notes={notes ?? []}
        todoLists={todoLists ?? []}
        folders={folders ?? []}
        profile={profile ?? null}
      />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
