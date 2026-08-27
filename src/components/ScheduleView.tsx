"use client";

import { useMemo, useState, useTransition } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek } from "date-fns";
import { createEvent, deleteEvent } from "@/app/actions/schedules";
import type { CalendarEvent } from "@/lib/types";
import { ChevronLeft, ChevronRight, Plus, Trash2, CalendarDays } from "lucide-react";

export function ScheduleView({ events }: { events: CalendarEvent[] }) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [, startTransition] = useTransition();

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      (map[e.date] ??= []).push(e);
    }
    return map;
  }, [events]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-8 sm:py-12">
      <h1 className="font-display text-3xl sm:text-4xl mb-6" style={{ color: "var(--ink)" }}>
        Schedule
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl" style={{ color: "var(--ink)" }}>
              {format(cursor, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setCursor(subMonths(cursor, 1))} className="p-1.5 rounded-md border hover:bg-[var(--hover)]" style={{ borderColor: "var(--line)" }} aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" style={{ color: "var(--ink)" }} />
              </button>
              <button onClick={() => setCursor(startOfMonth(new Date()))} className="px-2 py-1 text-xs font-mono rounded-md border hover:bg-[var(--hover)]" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>
                Today
              </button>
              <button onClick={() => setCursor(addMonths(cursor, 1))} className="p-1.5 rounded-md border hover:bg-[var(--hover)]" style={{ borderColor: "var(--line)" }} aria-label="Next month">
                <ChevronRight className="h-4 w-4" style={{ color: "var(--ink)" }} />
              </button>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--line)", background: "var(--paper-raised)" }}>
            <div className="grid grid-cols-7 border-b" style={{ borderColor: "var(--line)" }}>
              {weekDays.map((d) => (
                <div key={d} className="px-2 py-2 text-center type-eyebrow" style={{ color: "var(--ink-soft)" }}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day, i) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayEvents = eventsByDate[dateKey] ?? [];
                const inMonth = isSameMonth(day, cursor);
                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[4.5rem] sm:min-h-[5.5rem] border-t px-1 py-1 ${i % 7 !== 6 ? "border-r" : ""}`}
                    style={{
                      borderColor: "var(--line)",
                      background: inMonth ? undefined : "var(--muted-bg)",
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-mono mb-1"
                      style={{
                        color: isToday(day) ? "var(--on-plum)" : inMonth ? "var(--ink)" : "var(--ink-soft)",
                        background: isToday(day) ? "var(--plum)" : undefined,
                      }}
                    >
                      {format(day, "d")}
                    </span>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map((e) => (
                        <div
                          key={e.id}
                          className="px-1.5 py-0.5 rounded text-[0.7rem] truncate"
                          style={{ background: "var(--gold-soft)", color: "var(--ink)" }}
                        >
                          {e.start_time ? `${e.start_time} ` : ""}{e.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[0.7rem] px-1" style={{ color: "var(--ink-soft)" }}>
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <form
            action={(formData) => {
              startTransition(async () => {
                await createEvent(formData);
              });
            }}
            className="space-y-3 mb-8 p-5 rounded-xl border"
            style={{ borderColor: "var(--line)", background: "var(--paper-raised)" }}
          >
            <h3 className="font-display text-lg mb-1" style={{ color: "var(--ink)" }}>Add event</h3>
            <input
              name="title"
              placeholder="Event title"
              required
              className="w-full px-3 py-2 rounded-md border bg-transparent outline-none focus-ring text-sm"
              style={{ borderColor: "var(--line)" }}
            />
            <input
              name="date"
              type="date"
              required
              defaultValue={format(cursor, "yyyy-MM-dd")}
              className="w-full px-3 py-2 rounded-md border bg-transparent outline-none focus-ring text-sm"
              style={{ borderColor: "var(--line)" }}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                name="start_time"
                type="time"
                placeholder="Start"
                className="px-3 py-2 rounded-md border bg-transparent outline-none focus-ring text-sm"
                style={{ borderColor: "var(--line)" }}
              />
              <input
                name="end_time"
                type="time"
                placeholder="End"
                className="px-3 py-2 rounded-md border bg-transparent outline-none focus-ring text-sm"
                style={{ borderColor: "var(--line)" }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-md font-medium hover:opacity-90 focus-ring flex items-center justify-center gap-1 cursor-pointer"
              style={{ background: "var(--plum)", color: "var(--on-plum)" }}
            >
              <Plus className="h-4 w-4" /> Add event
            </button>
          </form>

          <h3 className="font-display text-lg mb-3" style={{ color: "var(--ink)" }}>Upcoming</h3>
          {events.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              <CalendarDays className="inline h-4 w-4 mr-1" />No events yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {events.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border"
                  style={{ borderColor: "var(--line)", background: "var(--paper-raised)" }}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-sm" style={{ color: "var(--ink)" }}>{e.title}</p>
                    <p className="text-xs font-mono" style={{ color: "var(--ink-soft)" }}>
                      {format(new Date(e.date + "T00:00:00"), "MMM d, yyyy")}
                      {e.start_time ? ` · ${e.start_time}${e.end_time ? `–${e.end_time}` : ""}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      if (window.confirm(`Delete event "${e.title}"?`)) {
                        startTransition(async () => {
                          await deleteEvent(e.id);
                        });
                      }
                    }}
                    className="p-1 rounded hover:bg-[var(--hover-strong)] shrink-0"
                    style={{ color: "var(--danger)" }}
                    aria-label="Delete event"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}