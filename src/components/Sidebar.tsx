"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { createNote } from "@/app/actions/notes";
import { createTodoList } from "@/app/actions/todos";
import { createFolder, renameFolder, deleteFolder } from "@/app/actions/folders";
import type { Note, TodoList, Folder, Profile } from "@/lib/types";
import { FileText, ListTodo, Folder as FolderIcon, File, Shield, Plus, LogOut, ChevronRight, ChevronDown, Pencil, Trash2, Calendar, Menu, X } from "lucide-react";
import { ThemePicker } from "@/components/ThemePicker";

export function Sidebar({
  notes,
  todoLists,
  folders,
  profile,
}: {
  notes: Note[];
  todoLists: TodoList[];
  folders: Folder[];
  profile: Profile | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname?.startsWith(path) ?? false;

  const [newFolderName, setNewFolderName] = useState("");
  const [addingFolder, setAddingFolder] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const toggleFolder = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newFolderName.trim();
    if (!name) return;
    await createFolder(name, null);
    setNewFolderName("");
    setAddingFolder(false);
    router.refresh();
  };

  const handleRenameFolder = async (folder: Folder) => {
    const name = window.prompt("Rename folder", folder.name);
    if (name && name !== folder.name) {
      await renameFolder(folder.id, name);
      router.refresh();
    }
  };

  const handleDeleteFolder = async (folder: Folder) => {
    if (!window.confirm(`Delete folder "${folder.name}"? Its contents stay in your sidebar.`)) return;
    await deleteFolder(folder.id);
    router.refresh();
  };

  const noteItemClass = (active: boolean) =>
    `flex items-center gap-1.5 px-2 py-1.5 rounded-md truncate text-sm transition-colors ${
      active ? "bg-[var(--active)]" : "hover:bg-[var(--hover)]"
    }`;

  const rootNotes = notes.filter((n) => n.folder_id == null);
  const rootLists = todoLists.filter((t) => t.folder_id == null);

  return (
    <>
      <header
        className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 h-14 border-b"
        style={{ background: "var(--paper-raised)", borderColor: "var(--line)" }}
      >
        <Link href="/dashboard" className="font-display text-lg" style={{ color: "var(--plum)" }}>
          Ledger
        </Link>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 -mr-2 rounded-md hover:bg-[var(--hover)] cursor-pointer"
          style={{ color: "var(--ink)" }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/40"
          onClick={closeMenu}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 max-w-[85vw] flex flex-col border-r bg-[var(--paper-raised)] transition-transform duration-200 lg:shrink-0 lg:h-screen lg:sticky lg:top-0 lg:w-72 lg:translate-x-0 lg:z-auto ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--paper-raised)", borderColor: "var(--line)" }}
      >
        <div className="px-4 pt-6 pb-5 border-b lg:pt-5" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="font-display text-xl" style={{ color: "var(--plum)" }}>
              Ledger
            </Link>
            <button
              onClick={closeMenu}
              className="lg:hidden p-1 rounded-md hover:bg-[var(--hover)] cursor-pointer"
              style={{ color: "var(--ink)" }}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {profile && (
            <p className="text-xs font-mono mt-1 truncate" style={{ color: "var(--ink-soft)" }}>
              {profile.email}
            </p>
          )}
        </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm">
        <div className="mb-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="type-eyebrow" style={{ color: "var(--ink-soft)" }}>Folders</span>
            <button
              onClick={() => setAddingFolder((v) => !v)}
              className="text-xs font-mono flex items-center gap-0.5 hover:opacity-80"
              style={{ color: "var(--plum)" }}
              title="New folder"
            >
              <Plus className="h-3 w-3" /> new
            </button>
          </div>
          {addingFolder && (
            <form onSubmit={handleCreateFolder} className="px-1 mb-2">
              <input
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-2 py-1.5 rounded-md border bg-transparent outline-none focus-ring text-sm"
                style={{ borderColor: "var(--line)" }}
              />
            </form>
          )}
          {folders.length === 0 && !addingFolder && (
            <p className="px-2 text-xs" style={{ color: "var(--ink-soft)" }}>No folders yet</p>
          )}
          {folders.map((folder) => {
            const folderNotes = notes.filter((n) => n.folder_id === folder.id);
            const folderLists = todoLists.filter((t) => t.folder_id === folder.id);
            const isOpen = expanded[folder.id] ?? true;
            return (
              <div key={folder.id}>
                <div className="group flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[var(--hover)]">
                  <button
                    className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    {isOpen ? (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--ink-soft)" }} />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--ink-soft)" }} />
                    )}
                    <FolderIcon className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--gold)" }} />
                    <span className="truncate font-medium" style={{ color: "var(--ink)" }}>{folder.name}</span>
                  </button>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRenameFolder(folder)}
                      className="p-1 rounded hover:bg-[var(--hover-strong)]"
                      title="Rename"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteFolder(folder)}
                      className="p-1 rounded hover:bg-[var(--hover-strong)]"
                      title="Delete"
                      style={{ color: "var(--danger)" }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="ml-4 border-l pl-2" style={{ borderColor: "var(--line)" }}>
                    {folderNotes.length === 0 && folderLists.length === 0 && (
                      <p className="px-1 py-1 text-xs" style={{ color: "var(--ink-soft)" }}>Empty</p>
                    )}
                    {folderNotes.map((n) => (
                      <Link
                        key={n.id}
                        href={`/dashboard/notes/${n.id}`}
                        onClick={closeMenu}
                        className={noteItemClass(isActive(`/dashboard/notes/${n.id}`))}
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{n.title || "Untitled"}</span>
                      </Link>
                    ))}
                    {folderLists.map((t) => (
                      <Link
                        key={t.id}
                        href={`/dashboard/todos/${t.id}`}
                        onClick={closeMenu}
                        className={noteItemClass(isActive(`/dashboard/todos/${t.id}`))}
                      >
                        <ListTodo className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{t.title}</span>
                      </Link>
                    ))}
                    <div className="flex items-center gap-2 px-1 py-1">
                      <form action={createNote.bind(null, folder.id)}>
                        <button className="text-xs font-mono hover:opacity-80" style={{ color: "var(--plum)" }} title="New note in folder">
                          + note
                        </button>
                      </form>
                      <form action={createTodoList.bind(null, folder.id)}>
                        <button className="text-xs font-mono hover:opacity-80" style={{ color: "var(--plum)" }} title="New list in folder">
                          + list
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="type-eyebrow" style={{ color: "var(--ink-soft)" }}>Notes</span>
            <form action={createNote.bind(null, null)}>
              <button type="submit" className="text-xs font-mono flex items-center gap-0.5 hover:opacity-80" style={{ color: "var(--plum)" }} title="New note">
                <Plus className="h-3 w-3" /> new
              </button>
            </form>
          </div>
          {rootNotes.length === 0 && (
            <p className="px-2 text-xs" style={{ color: "var(--ink-soft)" }}>No notes yet</p>
          )}
          {rootNotes.map((n) => (
            <Link key={n.id} href={`/dashboard/notes/${n.id}`} onClick={closeMenu} className={noteItemClass(isActive(`/dashboard/notes/${n.id}`))}>
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{n.title || "Untitled"}</span>
            </Link>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="type-eyebrow" style={{ color: "var(--ink-soft)" }}>To-do lists</span>
            <form action={createTodoList.bind(null, null)}>
              <button type="submit" className="text-xs font-mono flex items-center gap-0.5 hover:opacity-80" style={{ color: "var(--plum)" }} title="New list">
                <Plus className="h-3 w-3" /> new
              </button>
            </form>
          </div>
          {rootLists.length === 0 && (
            <p className="px-2 text-xs" style={{ color: "var(--ink-soft)" }}>No lists yet</p>
          )}
          {rootLists.map((t) => (
            <Link key={t.id} href={`/dashboard/todos/${t.id}`} onClick={closeMenu} className={noteItemClass(isActive(`/dashboard/todos/${t.id}`))}>
              <ListTodo className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{t.title}</span>
            </Link>
          ))}
        </div>

        <div className="mb-6">
          <Link href="/dashboard/files" onClick={closeMenu} className={`flex items-center gap-2 px-2 py-1.5 rounded-md font-medium transition-colors ${isActive("/dashboard/files") ? "bg-[var(--active)]" : "hover:bg-[var(--hover)]"}`}>
            <File className="h-3.5 w-3.5" /> Files
          </Link>
          <Link href="/dashboard/schedule" onClick={closeMenu} className={`flex items-center gap-2 px-2 py-1.5 rounded-md font-medium transition-colors ${isActive("/dashboard/schedule") ? "bg-[var(--active)]" : "hover:bg-[var(--hover)]"}`}>
            <Calendar className="h-3.5 w-3.5" /> Schedule
          </Link>
          {profile?.role === "admin" && (
            <Link href="/admin" onClick={closeMenu} className={`flex items-center gap-2 px-2 py-1.5 rounded-md font-medium transition-colors ${isActive("/admin") ? "bg-[var(--active)]" : "hover:bg-[var(--hover)]"}`}>
              <Shield className="h-3.5 w-3.5" /> Admin panel
            </Link>
          )}
        </div>
      </nav>

      <div className="px-3 py-3 border-t" style={{ borderColor: "var(--line)" }}>
        <ThemePicker />
        <form action={signOut}>
          <button type="submit" className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-[var(--hover)] focus-ring" style={{ color: "var(--danger)" }}>
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </form>
      </div>
      </aside>
    </>
  );
}