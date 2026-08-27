import { createClient } from "@/lib/supabase/server";
import { ScheduleView } from "@/components/ScheduleView";

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  return <ScheduleView events={events ?? []} />;
}