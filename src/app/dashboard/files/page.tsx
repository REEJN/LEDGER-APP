import { createClient } from "@/lib/supabase/server";
import { FilesView } from "@/components/FilesView";

export default async function FilesPage() {
  const supabase = await createClient();
  const { data: files } = await supabase
    .from("files")
    .select("*")
    .order("created_at", { ascending: false });

  return <FilesView files={files ?? []} />;
}
