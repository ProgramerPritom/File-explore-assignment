"use client";

import { ROOT_ID } from "@/lib/constants";
import { countDirectChildren, getChildren, getFolderChildren } from "@/lib/tree";
import type { WorkspaceItem, WorkspaceMap } from "@/lib/types";
import { ChevronIcon, FileIcon, FolderIcon } from "./Icons";

type TreeViewProps = {
  items: WorkspaceMap;
  selectedFolderId: string;
  openFileId: string | null;
  expandedIds: Set<string>;
  onSelectFolder: (id: string) => void;
  onToggleFolder: (id: string) => void;
  onOpenFile: (id: string) => void;
};

export function TreeView({
  items,
  selectedFolderId,
  openFileId,
  expandedIds,
  onSelectFolder,
  onToggleFolder,
  onOpenFile,
}: TreeViewProps) {
  const root = items[ROOT_ID];
  if (!root) {
    return null;
  }

  return (
    <nav aria-label="Workspace tree" className="px-1 py-1">
      <TreeFolder
        folder={root}
        items={items}
        depth={0}
        selectedFolderId={selectedFolderId}
        openFileId={openFileId}
        expandedIds={expandedIds}
        onSelectFolder={onSelectFolder}
        onToggleFolder={onToggleFolder}
        onOpenFile={onOpenFile}
      />
    </nav>
  );
}

type TreeFolderProps = {
  folder: WorkspaceItem;
  items: WorkspaceMap;
  depth: number;
  selectedFolderId: string;
  openFileId: string | null;
  expandedIds: Set<string>;
  onSelectFolder: (id: string) => void;
  onToggleFolder: (id: string) => void;
  onOpenFile: (id: string) => void;
};

function TreeFolder({
  folder,
  items,
  depth,
  selectedFolderId,
  openFileId,
  expandedIds,
  onSelectFolder,
  onToggleFolder,
  onOpenFile,
}: TreeFolderProps) {
  const open = expandedIds.has(folder.id);
  const selected = selectedFolderId === folder.id && !openFileId;
  const kids = getFolderChildren(items, folder.id);
  const files = getChildren(items, folder.id).filter((item) => item.type === "file");
  const hasKids = countDirectChildren(items, folder.id) > 0;

  return (
    <div>
      <div
        className={`group flex items-center rounded-md ${
          selected ? "bg-sky-100 text-sky-900" : "text-slate-700 hover:bg-slate-100"
        }`}
        style={{ paddingLeft: depth * 12 }}
      >
        <button
          type="button"
          className="flex h-7 w-6 shrink-0 items-center justify-center text-slate-400"
          aria-label={open ? `Collapse ${folder.name}` : `Expand ${folder.name}`}
          onClick={() => onToggleFolder(folder.id)}
        >
          {hasKids ? <ChevronIcon className="h-3.5 w-3.5" open={open} /> : <span className="w-3.5" />}
        </button>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-1.5 py-1 pr-2 text-left text-sm"
          onClick={() => onSelectFolder(folder.id)}
        >
          <FolderIcon className={`h-4 w-4 shrink-0 ${selected ? "text-sky-600" : "text-amber-500"}`} />
          <span className="truncate font-medium">{folder.name}</span>
        </button>
      </div>

      {open ? (
        <div>
          {kids.map((child) => (
            <TreeFolder
              key={child.id}
              folder={child}
              items={items}
              depth={depth + 1}
              selectedFolderId={selectedFolderId}
              openFileId={openFileId}
              expandedIds={expandedIds}
              onSelectFolder={onSelectFolder}
              onToggleFolder={onToggleFolder}
              onOpenFile={onOpenFile}
            />
          ))}
          {files.map((file) => {
            const active = openFileId === file.id;
            return (
              <button
                key={file.id}
                type="button"
                className={`flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left text-sm ${
                  active
                    ? "bg-sky-100 text-sky-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                style={{ paddingLeft: (depth + 1) * 12 + 24 }}
                onClick={() => onOpenFile(file.id)}
              >
                <FileIcon className={`h-4 w-4 shrink-0 ${active ? "text-sky-600" : "text-slate-400"}`} />
                <span className="truncate">{file.name}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
