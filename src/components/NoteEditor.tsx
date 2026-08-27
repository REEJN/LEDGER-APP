"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { updateNote, deleteNote } from "@/app/actions/notes";
import type { Note } from "@/lib/types";

export function NoteEditor({ note }: { note: Note }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [, startTransition] = useTransition();
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    if (title === note.title && content === note.content) return;

    timeout.current = setTimeout(() => {
      setStatus("saving");
      startTransition(async () => {
        const res = await updateNote(note.id, title, content);
        setStatus(res?.error ? "error" : "saved");
        if (!res?.error) {
          setTimeout(() => setStatus("idle"), 2000);
        }
      });
    }, 600);

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-8 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <span
          className="text-xs font-mono"
          style={{
            color: status === "error" ? "var(--danger)" : "var(--ink-soft)",
          }}
        >
          {status === "saving"
            ? "Saving…"
            : status === "saved"
              ? "All changes saved"
              : status === "error"
                ? "Couldn't save"
                : "\u00A0"}
        </span>
        <form
          action={deleteNote.bind(null, note.id)}
          onSubmit={(e) => {
            if (!window.confirm("Delete this note? This cannot be undone.")) {
              e.preventDefault();
            }
          }}
        >
          <button
            type="submit"
            className="text-xs font-mono hover:opacity-80 cursor-pointer"
            style={{ color: "var(--danger)" }}
          >
            Delete note
          </button>
        </form>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        className="w-full font-display text-3xl sm:text-4xl mb-6 outline-none bg-transparent focus-ring rounded-sm"
        style={{ color: "var(--ink)" }}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing…"
        rows={20}
        className="w-full outline-none bg-transparent resize-none leading-relaxed text-base focus-ring rounded-sm"
        style={{ color: "var(--ink)" }}
      />
    </div>
  );
}
