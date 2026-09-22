"use client";

import type { SearchHit } from "@/lib/types";
import { FileIcon, FolderIcon, SearchIcon } from "./Icons";

type SearchPanelProps = {
  query: string;
  hits: SearchHit[];
  onQueryChange: (value: string) => void;
  onPick: (id: string) => void;
};

export function SearchPanel({ query, hits, onQueryChange, onPick }: SearchPanelProps) {
  const active = query.trim().length > 0;

  return (
    <div className="relative px-3 pb-2 pt-3">
      <label className="relative block">
        <span className="sr-only">Search workspace</span>
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search files and folders"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
        />
      </label>

      {active ? (
        <div className="absolute left-3 right-3 top-full z-20 mt-1 max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {hits.length === 0 ? (
            <p className="px-3 py-3 text-sm text-slate-500">No matches for “{query.trim()}”.</p>
          ) : (
            <ul>
              {hits.map((hit) => (
                <li key={hit.item.id}>
                  <button
                    type="button"
                    className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-slate-50"
                    onClick={() => onPick(hit.item.id)}
                  >
                    {hit.item.type === "folder" ? (
                      <FolderIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    ) : (
                      <FileIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-800">
                        {hit.item.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500">{hit.pathLabel}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
