import { STORAGE_KEY, STORAGE_VERSION, ROOT_ID } from "./constants";
import { createSeedWorkspace } from "./seed";
import type { PersistedWorkspace, WorkspaceMap } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function looksLikeWorkspace(value: unknown): value is PersistedWorkspace {
  if (!isRecord(value)) {
    return false;
  }
  if (typeof value.version !== "number") {
    return false;
  }
  if (!isRecord(value.items)) {
    return false;
  }
  if (typeof value.selectedFolderId !== "string") {
    return false;
  }
  if (!Array.isArray(value.expandedIds)) {
    return false;
  }
  return true;
}

export function loadWorkspace(): PersistedWorkspace {
  if (typeof window === "undefined") {
    return defaultSnapshot();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultSnapshot();
    }

    const parsed: unknown = JSON.parse(raw);
    if (!looksLikeWorkspace(parsed)) {
      return defaultSnapshot();
    }

    if (!parsed.items[ROOT_ID] || parsed.items[ROOT_ID].type !== "folder") {
      return defaultSnapshot();
    }

    const selected =
      parsed.items[parsed.selectedFolderId]?.type === "folder"
        ? parsed.selectedFolderId
        : ROOT_ID;

    return {
      version: STORAGE_VERSION,
      items: parsed.items as WorkspaceMap,
      selectedFolderId: selected,
      expandedIds: parsed.expandedIds.filter(
        (id): id is string => typeof id === "string" && Boolean(parsed.items[id]),
      ),
    };
  } catch {
    return defaultSnapshot();
  }
}

export function saveWorkspace(snapshot: PersistedWorkspace): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    console.log('Quota or private-mode failures should not crash the UI.')
  }
}

export function defaultSnapshot(): PersistedWorkspace {
  return {
    version: STORAGE_VERSION,
    items: createSeedWorkspace(),
    selectedFolderId: ROOT_ID,
    expandedIds: [ROOT_ID, "projects", "webbly"],
  };
}


