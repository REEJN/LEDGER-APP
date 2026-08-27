"use client";

import { useState, useOptimistic, useTransition } from "react";
import {
  addTodoItem,
  toggleTodoItem,
  deleteTodoItem,
  deleteTodoList,
  renameTodoList,
} from "@/app/actions/todos";
import type { TodoItem, TodoList } from "@/lib/types";

export function TodoListView({
  list,
  items,
}: {
  list: TodoList;
  items: TodoItem[];
}) {
  const [title, setTitle] = useState(list.title);
  const [newItem, setNewItem] = useState("");
  const [, startTransition] = useTransition();

  const [optimisticItems, setOptimisticItems] = useOptimistic(items);

  const toggle = (id: string, isDone: boolean) => {
    setOptimisticItems((current) =>
      current.map((i) => (i.id === id ? { ...i, is_done: isDone } : i))
    );
    startTransition(async () => {
      await toggleTodoItem(id, list.id, isDone);
    });
  };

  const remove = (id: string) => {
    setOptimisticItems((current) => current.filter((i) => i.id !== id));
    startTransition(async () => {
      await deleteTodoItem(id, list.id);
    });
  };

  const remaining = optimisticItems.filter((i) => !i.is_done).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:px-8 sm:py-12">
      <div className="flex items-center justify-between mb-2">
        <span className="type-eyebrow" style={{ color: "var(--gold)" }}>
          {remaining} remaining
        </span>
        <form
          action={deleteTodoList.bind(null, list.id)}
          onSubmit={(e) => {
            if (!window.confirm("Delete this list and all its tasks? This cannot be undone.")) {
              e.preventDefault();
            }
          }}
        >
          <button
            type="submit"
            className="text-xs font-mono hover:opacity-80 cursor-pointer"
            style={{ color: "var(--danger)" }}
          >
            Delete list
          </button>
        </form>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => title !== list.title && renameTodoList(list.id, title)}
        className="w-full font-display text-3xl sm:text-4xl mb-8 outline-none bg-transparent focus-ring rounded-sm"
        style={{ color: "var(--ink)" }}
      />

      <form
        action={async (formData) => {
          const content = String(formData.get("content") || "").trim();
          if (!content) return;
          const res = await addTodoItem(list.id, content);
          if (!res?.error) setNewItem("");
        }}
        className="flex gap-2 mb-6"
      >
        <input
          name="content"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a task…"
          className="flex-1 px-3 py-2 rounded-md border bg-transparent outline-none focus-ring"
          style={{ borderColor: "var(--line)" }}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md font-medium hover:opacity-90 focus-ring cursor-pointer"
          style={{ background: "var(--plum)", color: "var(--on-plum)" }}
        >
          Add
        </button>
      </form>

      <ul className="space-y-1">
        {optimisticItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 px-3 py-2 rounded-md group hover:bg-[var(--hover)]"
          >
            <input
              type="checkbox"
              checked={item.is_done}
              onChange={(e) => toggle(item.id, e.target.checked)}
              className="w-4 h-4 cursor-pointer"
              style={{ accentColor: "var(--done)" }}
            />
            <span
              className="flex-1 transition-colors"
              style={{
                color: item.is_done ? "var(--ink-soft)" : "var(--ink)",
                textDecoration: item.is_done ? "line-through" : "none",
              }}
            >
              {item.content}
            </span>
            <button
              onClick={() => remove(item.id)}
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-xs font-mono hover:underline cursor-pointer"
              style={{ color: "var(--danger)" }}
            >
              remove
            </button>
          </li>
        ))}
        {optimisticItems.length === 0 && (
          <p className="px-3 text-sm" style={{ color: "var(--ink-soft)" }}>No tasks yet — add one above.</p>
        )}
      </ul>
    </div>
  );
}