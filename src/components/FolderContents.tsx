"use client";

import { countDirectChildren } from "@/lib/tree";
import type { WorkspaceItem, WorkspaceMap } from "@/lib/types";
import { FileIcon, FolderIcon } from "./Icons";

type FolderContentsProps = {
  items: WorkspaceMap;
  childrenItems: WorkspaceItem[];
  onOpenFolder: (id: string) => void;
  onOpenFile: (id: string) => void;
  onRename: (item: WorkspaceItem) => void;
  onDelete: (item: WorkspaceItem) => void;
};

export function FolderContents({
  items,
  childrenItems,
  onOpenFolder,
  onOpenFile,
  onRename,
  onDelete,
}: FolderContentsProps) {
  if (childrenItems.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium text-slate-700">This folder is empty</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Create a file or folder from the toolbar above.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {childrenItems.map((item) => {
        const childCount = countDirectChildren(items, item.id);
        const extra =
          item.type === "folder"
            ? `${childCount} item${childCount === 1 ? "" : "s"}`
            : `${item.content.length} character${item.content.length === 1 ? "" : "s"}`;

        return (
          <li key={item.id} className="group flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50">
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
              onClick={() =>
                item.type === "folder" ? onOpenFolder(item.id) : onOpenFile(item.id)
              }
            >
              {item.type === "folder" ? (
                <FolderIcon className="h-5 w-5 shrink-0 text-amber-500" />
              ) : (
                <FileIcon className="h-5 w-5 shrink-0 text-slate-400" />
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-slate-800">
                  {item.name}
                </span>
                <span className="block truncate text-xs text-slate-500">{extra}</span>
              </span>
            </button>
            <div className="flex shrink-0 gap-1 sm:opacity-0 sm:group-hover:opacity-100">
              <button
                type="button"
                className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-200"
                onClick={() => onRename(item)}
              >
                Rename
              </button>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                onClick={() => onDelete(item)}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
