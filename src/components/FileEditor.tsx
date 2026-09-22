"use client";

import { useEffect, useState } from "react";
import type { WorkspaceItem } from "@/lib/types";
import { ConfirmDialog } from "./ConfirmDialog";

type FileEditorProps = {
  file: WorkspaceItem;
  onSave: (content: string) => void;
  onClose: () => void;
  onDirtyChange: (dirty: boolean) => void;
};

export function FileEditor({ file, onSave, onClose, onDirtyChange }: FileEditorProps) {
  const [draft, setDraft] = useState(file.content);
  const [savedFlash, setSavedFlash] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const dirty = draft !== file.content;

  function markDirty(nextDraft: string) {
    setDraft(nextDraft);
    onDirtyChange(nextDraft !== file.content);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (draft !== file.content) {
          onSave(draft);
          onDirtyChange(false);
          setSavedFlash(true);
          window.setTimeout(() => setSavedFlash(false), 1400);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft, file.content, onSave, onDirtyChange]);

  function handleSave() {
    onSave(draft);
    onDirtyChange(false);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1400);
  }

  function handleClose() {
    if (dirty) {
      setLeaveOpen(true);
      return;
    }
    onClose();
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
          <p className="text-xs text-slate-500">
            {dirty ? "Unsaved changes" : savedFlash ? "Saved" : "All changes saved"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty}
            className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
      <textarea
        value={draft}
        onChange={(event) => markDirty(event.target.value)}
        spellCheck={false}
        className="min-h-0 flex-1 resize-none bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-800 outline-none"
        aria-label={`Contents of ${file.name}`}
      />

      {leaveOpen ? (
        <ConfirmDialog
          title="Unsaved changes"
          message={`“${file.name}” has unsaved edits. Close without saving?`}
          confirmLabel="Discard"
          danger
          onCancel={() => setLeaveOpen(false)}
          onConfirm={() => {
            setLeaveOpen(false);
            onDirtyChange(false);
            onClose();
          }}
        />
      ) : null}
    </section>
  );
}
