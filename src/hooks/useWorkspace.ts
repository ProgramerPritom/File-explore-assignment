"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ROOT_ID, STORAGE_VERSION } from "@/lib/constants";
import { createId } from "@/lib/ids";
import { findNameError, normalizeName } from "@/lib/names";
import { loadWorkspace, saveWorkspace } from "@/lib/storage";
import {
  collectDescendantIds,
  getAncestorIds,
  getBreadcrumb,
  getChildren,
  searchItems,
} from "@/lib/tree";
import type { ItemType, NameError, PersistedWorkspace, WorkspaceItem } from "@/lib/types";

type CreateResult = { ok: true; item: WorkspaceItem } | { ok: false; error: NameError };
type RenameResult = { ok: true } | { ok: false; error: NameError };

function readSnapshot() {
  return loadWorkspace();
}

export function useWorkspace() {
  const [snapshot] = useState(readSnapshot);
  const [items, setItems] = useState(snapshot.items);
  const [selectedFolderId, setSelectedFolderId] = useState(snapshot.selectedFolderId);
  const [expandedIds, setExpandedIds] = useState(() => new Set(snapshot.expandedIds));
  const [openFileId, setOpenFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const next: PersistedWorkspace = {
      version: STORAGE_VERSION,
      items,
      selectedFolderId,
      expandedIds: Array.from(expandedIds),
    };
    saveWorkspace(next);
  }, [items, selectedFolderId, expandedIds]);

  const selectedFolder = items[selectedFolderId] ?? items[ROOT_ID] ?? null;
  const currentFile = openFileId ? (items[openFileId] ?? null) : null;
  const children = selectedFolder ? getChildren(items, selectedFolder.id) : [];
  const breadcrumb = selectedFolder ? getBreadcrumb(items, selectedFolder.id) : [];
  const searchHits = useMemo(
    () => searchItems(items, searchQuery),
    [items, searchQuery],
  );

  const expandTo = useCallback(
    (folderId: string) => {
      setExpandedIds((current) => {
        const next = new Set(current);
        for (const id of getAncestorIds(items, folderId)) {
          next.add(id);
        }
        return next;
      });
    },
    [items],
  );

  const selectFolder = useCallback(
    (folderId: string) => {
      const folder = items[folderId];
      if (!folder || folder.type !== "folder") {
        return;
      }
      setSelectedFolderId(folderId);
      setOpenFileId(null);
      expandTo(folderId);
    },
    [items, expandTo],
  );

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const openFileById = useCallback(
    (fileId: string) => {
      const file = items[fileId];
      if (!file || file.type !== "file") {
        return;
      }
      const parentId = file.parentId ?? ROOT_ID;
      setSelectedFolderId(parentId);
      setOpenFileId(fileId);
      expandTo(parentId);
    },
    [items, expandTo],
  );

  const closeFile = useCallback(() => {
    setOpenFileId(null);
  }, []);

  const createItem = useCallback(
    (type: ItemType, rawName: string): CreateResult => {
      const parentId = selectedFolderId;
      const parent = items[parentId];
      if (!parent || parent.type !== "folder") {
        return { ok: false, error: "empty" };
      }

      const error = findNameError(items, parentId, rawName);
      if (error) {
        return { ok: false, error };
      }

      const now = Date.now();
      const item: WorkspaceItem = {
        id: createId(),
        name: normalizeName(rawName),
        type,
        parentId,
        content: "",
        createdAt: now,
        updatedAt: now,
      };

      setItems((current) => ({ ...current, [item.id]: item }));
      setExpandedIds((current) => new Set(current).add(parentId));

      if (type === "file") {
        setOpenFileId(item.id);
      }

      return { ok: true, item };
    },
    [items, selectedFolderId],
  );

  const renameItem = useCallback(
    (itemId: string, rawName: string): RenameResult => {
      const item = items[itemId];
      if (!item) {
        return { ok: false, error: "empty" };
      }

      const parentId = item.parentId ?? ROOT_ID;
      const error = findNameError(items, parentId, rawName, itemId);
      if (error) {
        return { ok: false, error };
      }

      const name = normalizeName(rawName);
      setItems((current) => ({
        ...current,
        [itemId]: { ...current[itemId], name, updatedAt: Date.now() },
      }));
      return { ok: true };
    },
    [items],
  );

  const deleteItem = useCallback(
    (itemId: string) => {
      if (itemId === ROOT_ID) {
        return;
      }

      const target = items[itemId];
      if (!target) {
        return;
      }

      const idsToRemove = new Set<string>([itemId]);
      if (target.type === "folder") {
        for (const id of collectDescendantIds(items, itemId)) {
          idsToRemove.add(id);
        }
      }

      const parentId = target.parentId ?? ROOT_ID;
      const selectedIsGone = idsToRemove.has(selectedFolderId);
      const openIsGone = openFileId !== null && idsToRemove.has(openFileId);

      setItems((current) => {
        const next = { ...current };
        for (const id of idsToRemove) {
          delete next[id];
        }
        return next;
      });

      setExpandedIds((current) => {
        const next = new Set(current);
        for (const id of idsToRemove) {
          next.delete(id);
        }
        return next;
      });

      if (selectedIsGone) {
        const fallback =
          items[parentId] && !idsToRemove.has(parentId) ? parentId : ROOT_ID;
        setSelectedFolderId(fallback);
      }

      if (openIsGone) {
        setOpenFileId(null);
      }
    },
    [items, selectedFolderId, openFileId],
  );

  const saveFileContent = useCallback((fileId: string, content: string) => {
    setItems((current) => {
      const file = current[fileId];
      if (!file || file.type !== "file") {
        return current;
      }
      return {
        ...current,
        [fileId]: { ...file, content, updatedAt: Date.now() },
      };
    });
  }, []);

  const revealSearchHit = useCallback(
    (itemId: string) => {
      const item = items[itemId];
      if (!item) {
        return;
      }
      setSearchQuery("");
      if (item.type === "folder") {
        selectFolder(item.id);
      } else {
        openFileById(item.id);
      }
    },
    [items, selectFolder, openFileById],
  );

  return {
    items,
    selectedFolder,
    selectedFolderId,
    currentFile,
    openFileId,
    children,
    breadcrumb,
    expandedIds,
    searchQuery,
    searchHits,
    setSearchQuery,
    selectFolder,
    toggleFolder,
    openFileById,
    closeFile,
    createItem,
    renameItem,
    deleteItem,
    saveFileContent,
    revealSearchHit,
  };
}
