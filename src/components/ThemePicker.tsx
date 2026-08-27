"use client";

import { useEffect, useRef, useState } from "react";
import { themes, useTheme } from "@/components/ThemeProvider";
import { Palette, Check } from "lucide-react";

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = themes.find((t) => t.id === theme)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-[var(--hover)] transition-colors cursor-pointer"
        style={{ color: "var(--ink)" }}
      >
        <span className="flex items-center gap-2 min-w-0">
          <Palette className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Theme</span>
        </span>
        <span
          className="h-4 w-4 rounded-full border shrink-0"
          style={{ background: current.swatch, borderColor: "var(--line)" }}
        />
      </button>

      {open && (
        <div
          className="absolute bottom-full left-0 mb-1 w-52 rounded-lg border shadow-lg z-20 p-1.5"
          style={{ background: "var(--paper-raised)", borderColor: "var(--line)" }}
        >
          <p className="px-2 py-1 type-eyebrow" style={{ color: "var(--ink-soft)" }}>Color theme</p>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-[var(--hover)] transition-colors cursor-pointer"
              style={{ color: "var(--ink)" }}
            >
              <span
                className="h-4 w-4 rounded-full border shrink-0"
                style={{ background: t.swatch, borderColor: "var(--line)" }}
              />
              <span className="flex-1 text-left">{t.label}</span>
              {t.id === theme && <Check className="h-4 w-4" style={{ color: "var(--plum)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}