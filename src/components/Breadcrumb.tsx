"use client";

import type { WorkspaceItem } from "@/lib/types";

type BreadcrumbProps = {
  items: WorkspaceItem[];
  onSelect: (id: string) => void;
};

export function Breadcrumb({ items, onSelect }: BreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="min-w-0 flex-1 overflow-x-auto">
      <ol className="flex items-center gap-1 text-sm whitespace-nowrap">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          const isFolder = item.type === "folder";

          return (
            <li key={`${item.id}-${index}`} className="flex shrink-0 items-center gap-1">
              {index > 0 ? (
                <span className="px-0.5 text-slate-300" aria-hidden="true">
                  /
                </span>
              ) : null}
              {isFolder ? (
                <button
                  type="button"
                  className={`rounded px-1 py-0.5 hover:bg-slate-100 hover:text-sky-700 hover:underline ${
                    last ? "font-medium text-slate-800" : "text-slate-500"
                  }`}
                  aria-current={last ? "page" : undefined}
                  onClick={() => onSelect(item.id)}
                >
                  {item.name}
                </button>
              ) : (
                <span
                  className="rounded px-1 py-0.5 font-medium text-slate-800"
                  aria-current={last ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
