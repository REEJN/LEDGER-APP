import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const [{ data: users }, { data: notes }, { data: files }, { data: todoLists }] =
    await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("notes").select("id, user_id"),
      supabase.from("files").select("id, user_id, file_size"),
      supabase.from("todo_lists").select("id, user_id"),
    ]);

  const countFor = (arr: { user_id: string }[] | null, uid: string) =>
    (arr ?? []).filter((r) => r.user_id === uid).length;

  const totalStorage = (files ?? []).reduce((sum, f) => sum + (f.file_size || 0), 0);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-8 sm:py-12 max-w-5xl mx-auto">
      <p className="type-eyebrow mb-2" style={{ color: "var(--gold)" }}>
        Admin
      </p>
      <h1 className="font-display text-3xl sm:text-4xl mb-8" style={{ color: "var(--ink)" }}>Workspace overview</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <StatCard label="Users" value={(users ?? []).length} />
        <StatCard label="Notes" value={(notes ?? []).length} />
        <StatCard label="To-do lists" value={(todoLists ?? []).length} />
        <StatCard label="Storage used" value={`${(totalStorage / (1024 * 1024)).toFixed(1)} MB`} />
      </div>

      <div className="rounded-lg border overflow-x-auto" style={{ borderColor: "var(--line)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--paper-raised)" }}>
              <th className="text-left px-4 py-3 type-eyebrow" style={{ color: "var(--ink-soft)" }}>User</th>
              <th className="text-left px-4 py-3 type-eyebrow" style={{ color: "var(--ink-soft)" }}>Role</th>
              <th className="text-left px-4 py-3 type-eyebrow" style={{ color: "var(--ink-soft)" }}>Notes</th>
              <th className="text-left px-4 py-3 type-eyebrow" style={{ color: "var(--ink-soft)" }}>Lists</th>
              <th className="text-left px-4 py-3 type-eyebrow" style={{ color: "var(--ink-soft)" }}>Files</th>
              <th className="text-left px-4 py-3 type-eyebrow" style={{ color: "var(--ink-soft)" }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id} className="border-t" style={{ borderColor: "var(--line)" }}>
                <td className="px-4 py-3">
                  <p style={{ color: "var(--ink)" }}>{u.full_name || "—"}</p>
                  <p className="text-xs" style={{ color: "var(--ink-soft)" }}>{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-mono"
                    style={{
                      background: u.role === "admin" ? "var(--gold-soft)" : "var(--line)",
                      color: "var(--ink)",
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">{countFor(notes, u.id)}</td>
                <td className="px-4 py-3">{countFor(todoLists, u.id)}</td>
                <td className="px-4 py-3">{countFor(files, u.id)}</td>
                <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--ink-soft)" }}>
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-5 rounded-lg border" style={{ background: "var(--paper-raised)", borderColor: "var(--line)" }}>
      <p className="type-eyebrow mb-1" style={{ color: "var(--ink-soft)" }}>{label}</p>
      <p className="font-display text-3xl" style={{ color: "var(--ink)" }}>{value}</p>
    </div>
  );
}
