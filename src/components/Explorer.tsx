"use client";

import { useCallback, useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { ItemType, WorkspaceItem } from "@/lib/types";
import { Breadcrumb } from "./Breadcrumb";
import { ConfirmDialog } from "./ConfirmDialog";
import { FileEditor } from "./FileEditor";
import { FolderContents } from "./FolderContents";
import { CloseIcon, MenuIcon, PlusIcon } from "./Icons";
import { NameDialog } from "./NameDialog";
import { SearchPanel } from "./SearchPanel";
import { TreeView } from "./TreeView";

type DialogState =
  | { kind: "none" }
  | { kind: "create"; type: ItemType }
  | { kind: "rename"; item: WorkspaceItem }
  | { kind: "delete"; item: WorkspaceItem };

type PendingNav =
  | { kind: "folder"; id: string }
  | { kind: "file"; id: string }
  | { kind: "search"; id: string };

export function Explorer() {
  const workspace = useWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({ kind: "none" });
  const [editorDirty, setEditorDirty] = useState(false);
  const [pendingNav, setPendingNav] = useState<PendingNav | null>(null);

  const onDirtyChange = useCallback((dirty: boolean) => {
    setEditorDirty(dirty);
  }, []);

  if (!workspace.selectedFolder) {
    return (
      <div className="flex h-dvh items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading workspace…
      </div>
    );
  }

  const folder = workspace.selectedFolder;

  function closeDialog() {
    setDialog({ kind: "none" });
  }

  function handleCreate(type: ItemType, name: string) {
    const result = workspace.createItem(type, name);
    if (!result.ok) {
      return result.error;
    }
    closeDialog();
    return null;
  }

  function handleRename(item: WorkspaceItem, name: string) {
    const result = workspace.renameItem(item.id, name);
    if (!result.ok) {
      return result.error;
    }
    closeDialog();
    return null;
  }

  function handleDelete(item: WorkspaceItem) {
    workspace.deleteItem(item.id);
    closeDialog();
  }

  function applyNav(nav: PendingNav) {
    if (nav.kind === "folder") {
      workspace.selectFolder(nav.id);
      setSidebarOpen(false);
      return;
    }
    if (nav.kind === "file") {
      workspace.openFileById(nav.id);
      setSidebarOpen(false);
      return;
    }
    workspace.revealSearchHit(nav.id);
    setSidebarOpen(false);
  }

  function guardNav(nav: PendingNav) {
    if (workspace.currentFile && editorDirty) {
      setPendingNav(nav);
      return;
    }
    applyNav(nav);
  }

  return (
    <div className="flex h-dvh min-h-0 bg-slate-100 text-slate-900">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/30 md:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-3">
          <div>
            <p className="text-sm font-semibold tracking-tight">Mini Workspace</p>
            <p className="text-xs text-slate-500">Explorer</p>
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <SearchPanel
          query={workspace.searchQuery}
          hits={workspace.searchHits}
          onQueryChange={workspace.setSearchQuery}
          onPick={(id) => guardNav({ kind: "search", id })}
        />

        <div className="min-h-0 flex-1 overflow-auto pb-4">
          <TreeView
            items={workspace.items}
            selectedFolderId={workspace.selectedFolderId}
            openFileId={workspace.openFileId}
            expandedIds={workspace.expandedIds}
            onSelectFolder={(id) => guardNav({ kind: "folder", id })}
            onToggleFolder={workspace.toggleFolder}
            onOpenFile={(id) => guardNav({ kind: "file", id })}
          />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-3 py-2.5 md:px-4">
          <button
            type="button"
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <Breadcrumb
            items={
              workspace.currentFile
                ? [...workspace.breadcrumb, workspace.currentFile]
                : workspace.breadcrumb
            }
            onSelect={(id) => guardNav({ kind: "folder", id })}
          />
        </header>

        <div className="flex min-h-0 flex-1 flex-col bg-white md:m-3 md:rounded-xl md:border md:border-slate-200 md:shadow-sm">
          {workspace.currentFile ? (
            <FileEditor
              key={workspace.currentFile.id}
              file={workspace.currentFile}
              onSave={(content) =>
                workspace.saveFileContent(workspace.currentFile!.id, content)
              }
              onClose={workspace.closeFile}
              onDirtyChange={onDirtyChange}
            />
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5">
                <div>
                  <h1 className="text-sm font-semibold text-slate-800">{folder.name}</h1>
                  <p className="text-xs text-slate-500">
                    {workspace.children.length === 0
                      ? "Empty folder"
                      : `${workspace.children.length} item${
                          workspace.children.length === 1 ? "" : "s"
                        }`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDialog({ kind: "create", type: "folder" })}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    New folder
                  </button>
                  <button
                    type="button"
                    onClick={() => setDialog({ kind: "create", type: "file" })}
                    className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-2.5 py-1.5 text-sm font-medium text-white hover:bg-sky-700"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    New file
                  </button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto">
                <FolderContents
                  items={workspace.items}
                  childrenItems={workspace.children}
                  onOpenFolder={(id) => guardNav({ kind: "folder", id })}
                  onOpenFile={(id) => guardNav({ kind: "file", id })}
                  onRename={(item) => setDialog({ kind: "rename", item })}
                  onDelete={(item) => setDialog({ kind: "delete", item })}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {dialog.kind === "create" ? (
        <NameDialog
          title={dialog.type === "folder" ? "New folder" : "New text file"}
          label="Name"
          initialValue={dialog.type === "file" ? "untitled.txt" : "Untitled folder"}
          confirmLabel="Create"
          onCancel={closeDialog}
          onSubmit={(name) => handleCreate(dialog.type, name)}
        />
      ) : null}

      {dialog.kind === "rename" ? (
        <NameDialog
          title={`Rename ${dialog.item.type}`}
          label="New name"
          initialValue={dialog.item.name}
          confirmLabel="Rename"
          onCancel={closeDialog}
          onSubmit={(name) => handleRename(dialog.item, name)}
        />
      ) : null}

      {dialog.kind === "delete" ? (
        <ConfirmDialog
          title={`Delete ${dialog.item.type}?`}
          message={
            dialog.item.type === "folder"
              ? `“${dialog.item.name}” and everything inside it will be removed. This cannot be undone.`
              : `“${dialog.item.name}” will be permanently deleted.`
          }
          confirmLabel="Delete"
          danger
          onCancel={closeDialog}
          onConfirm={() => handleDelete(dialog.item)}
        />
      ) : null}

      {pendingNav ? (
        <ConfirmDialog
          title="Unsaved changes"
          message="You have unsaved edits. Leave this file without saving?"
          confirmLabel="Discard"
          danger
          onCancel={() => setPendingNav(null)}
          onConfirm={() => {
            const nav = pendingNav;
            setPendingNav(null);
            setEditorDirty(false);
            applyNav(nav);
          }}
        />
      ) : null}
    </div>
  );
}
