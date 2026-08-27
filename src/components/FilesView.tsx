"use client";

import { useRef, useState, useTransition } from "react";
import { uploadFile, deleteFile, getFileUrl } from "@/app/actions/files";
import type { FileRecord } from "@/lib/types";
import { FileText, FileImage, FileArchive, Upload, ExternalLink, Trash2 } from "lucide-react";

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const imageExts = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico"];
const archiveExts = ["zip", "rar", "7z", "tar", "gz"];

function FileTypeIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (imageExts.includes(ext)) return <FileImage className={className} style={style} />;
  if (archiveExts.includes(ext)) return <FileArchive className={className} style={style} />;
  return <FileText className={className} style={style} />;
}

export function FilesView({ files }: { files: FileRecord[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-8 sm:py-12">
      <h1 className="font-display text-3xl sm:text-4xl mb-2" style={{ color: "var(--ink)" }}>Files</h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        Upload personal files — only you (and admins) can see them.
      </p>

      <form
        ref={formRef}
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            const res = await uploadFile(formData);
            if (res?.error) setError(res.error);
            formRef.current?.reset();
          });
        }}
        className="mb-8 p-6 rounded-lg border border-dashed flex flex-col sm:flex-row items-center gap-4 justify-between"
        style={{ borderColor: "var(--line)", background: "var(--paper-raised)" }}
      >
        <label className="flex items-center gap-3 text-sm w-full cursor-pointer">
          <Upload className="h-5 w-5 shrink-0" style={{ color: "var(--plum-soft)" }} />
          <input type="file" name="file" required className="text-sm w-full" />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-md font-medium disabled:opacity-50 hover:opacity-90 focus-ring cursor-pointer shrink-0"
          style={{ background: "var(--plum)", color: "var(--on-plum)" }}
        >
          {isPending ? "Uploading…" : "Upload"}
        </button>
      </form>

      {error && (
        <p className="mb-4 text-sm px-3 py-2 rounded-md" style={{ background: "var(--error-bg)", color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
        {files.map((f) => (
          <FileRow key={f.id} file={f} />
        ))}
        {files.length === 0 && (
          <p className="py-4 text-sm" style={{ color: "var(--ink-soft)" }}>No files uploaded yet.</p>
        )}
      </ul>
    </div>
  );
}

function FileRow({ file }: { file: FileRecord }) {
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${file.file_name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await deleteFile(file.id, file.storage_path);
    setDeleting(false);
  };

  return (
    <li className="flex items-center justify-between py-3 hover:bg-[var(--hover)] rounded-lg px-2 -mx-2 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <FileTypeIcon name={file.file_name} className="h-5 w-5 shrink-0" style={{ color: "var(--plum-soft)" }} />
        <div className="min-w-0">
          <p className="truncate font-medium" style={{ color: "var(--ink)" }}>{file.file_name}</p>
          <p className="text-xs font-mono" style={{ color: "var(--ink-soft)" }}>
            {formatSize(file.file_size)} · {new Date(file.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0 ml-4">
        <button
          onClick={async () => {
            setBusy(true);
            const url = await getFileUrl(file.storage_path);
            setBusy(false);
            if (url) window.open(url, "_blank");
          }}
          disabled={busy || deleting}
          className="text-xs font-mono flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50"
          style={{ color: "var(--plum)" }}
        >
          <ExternalLink className="h-3 w-3" />
          {busy ? "…" : "Open"}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs font-mono flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50"
          style={{ color: "var(--danger)" }}
        >
          {deleting ? "…" : <Trash2 className="h-3 w-3" />}
          Delete
        </button>
      </div>
    </li>
  );
}