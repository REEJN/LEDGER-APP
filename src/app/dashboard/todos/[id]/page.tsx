import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TodoListView } from "@/components/TodoListView";

export default async function TodoListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: list }, { data: items }] = await Promise.all([
    supabase.from("todo_lists").select("*").eq("id", id).single(),
    supabase.from("todo_items").select("*").eq("list_id", id).order("position"),
  ]);

  if (!list) notFound();

  return <TodoListView list={list} items={items ?? []} />;
}
