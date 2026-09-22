import { ROOT_ID } from "./constants";
import type { SearchHit, WorkspaceItem, WorkspaceMap } from "./types";

export function getChildren(
  items: WorkspaceMap,
  parentId: string,
): WorkspaceItem[] {
  return Object.values(items)
    .filter((item) => item.parentId === parentId)
    .sort(compareItems);
}

export function compareItems(a: WorkspaceItem, b: WorkspaceItem): number {
  if (a.type !== b.type) {
    return a.type === "folder" ? -1 : 1;
  }
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

export function getFolderChildren(
  items: WorkspaceMap,
  parentId: string,
): WorkspaceItem[] {
  return getChildren(items, parentId).filter((item) => item.type === "folder");
}

export function getAncestorIds(
  items: WorkspaceMap,
  itemId: string,
): string[] {
  const chain: string[] = [];
  let current = items[itemId];

  while (current) {
    chain.unshift(current.id);
    if (!current.parentId) {
      break;
    }
    current = items[current.parentId];
  }

  return chain;
}

export function getBreadcrumb(items: WorkspaceMap, folderId: string): WorkspaceItem[] {
  return getAncestorIds(items, folderId)
    .map((id) => items[id])
    .filter((item): item is WorkspaceItem => Boolean(item));
}

export function getPathLabel(items: WorkspaceMap, itemId: string): string {
  const ancestors = getAncestorIds(items, itemId)
    .map((id) => items[id]?.name)
    .filter(Boolean);

  return ancestors.join(" / ");
}

export function collectDescendantIds(
  items: WorkspaceMap,
  folderId: string,
): string[] {
  const collected: string[] = [];
  const stack = [folderId];

  while (stack.length > 0) {
    const currentId = stack.pop() as string;
    const kids = Object.values(items).filter((item) => item.parentId === currentId);
    for (const kid of kids) {
      collected.push(kid.id);
      if (kid.type === "folder") {
        stack.push(kid.id);
      }
    }
  }

  return collected;
}

export function searchItems(items: WorkspaceMap, query: string): SearchHit[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [];
  }

  return Object.values(items)
    .filter((item) => item.id !== ROOT_ID)
    .filter((item) => item.name.toLowerCase().includes(needle))
    .sort(compareItems)
    .map((item) => ({
      item,
      pathLabel: getPathLabel(items, item.id),
    }));
}

export function countDirectChildren(items: WorkspaceMap, folderId: string): number {
  return Object.values(items).filter((item) => item.parentId === folderId).length;
}
