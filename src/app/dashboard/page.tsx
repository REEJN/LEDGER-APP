import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createNote } from "@/app/actions/notes";
import { createTodoList } from "@/app/actions/todos";

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: recentFiles }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user?.id)
      .single(),
    supabase.from("files").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const name = profile?.full_name || profile?.email?.split("@")[0] || "there";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-8 sm:py-16">
      <p className="type-eyebrow mb-2" style={{ color: "var(--gold)" }}>
        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl mb-8" style={{ color: "var(--ink)" }}>
        Welcome back, {name}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
        <form action={createNote.bind(null, null)}>
          <button className="w-full text-left p-5 rounded-lg border transition hover:shadow-sm focus-ring" style={{ background: "var(--paper-raised)", borderColor: "var(--line)" }} title="New note">
            <p className="font-display text-lg mb-1">New note</p>
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Jot something down</p>
          </button>
        </form>
        <form action={createTodoList.bind(null, null)}>
          <button className="w-full text-left p-5 rounded-lg border transition hover:shadow-sm focus-ring" style={{ background: "var(--paper-raised)", borderColor: "var(--line)" }} title="New to-do list">
            <p className="font-display text-lg mb-1">New list</p>
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Track your tasks</p>
          </button>
        </form>
        <Link href="/dashboard/files" className="w-full text-left p-5 rounded-lg border transition hover:shadow-sm focus-ring block" style={{ background: "var(--paper-raised)", borderColor: "var(--line)" }}>
          <p className="font-display text-lg mb-1">Upload file</p>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Add a document</p>
        </Link>
      </div>

      <h2 className="font-display text-xl mb-3" style={{ color: "var(--ink)" }}>Recent files</h2>
      {recentFiles && recentFiles.length > 0 ? (
        <ul className="divide-y rounded-lg border overflow-hidden" style={{ borderColor: "var(--line)", background: "var(--paper-raised)" }}>
          {recentFiles.map((f) => (
            <li key={f.id}>
              <Link href="/dashboard/files" className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[var(--hover)] transition-colors">
                <span className="truncate min-w-0 font-medium" style={{ color: "var(--ink)" }}>{f.file_name}</span>
                <span className="text-xs font-mono shrink-0" style={{ color: "var(--ink-soft)" }}>
                  {formatSize(f.file_size)} · {new Date(f.created_at).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>No files uploaded yet.</p>
      )}
    </div>
  );
}
