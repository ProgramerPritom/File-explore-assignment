export type ItemType = "folder" | "file";

export type WorkspaceItem = {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  content: string;
  createdAt: number;
  updatedAt: number;
};

export type WorkspaceMap = Record<string, WorkspaceItem>;

export type PersistedWorkspace = {
  version: number;
  items: WorkspaceMap;
  selectedFolderId: string;
  expandedIds: string[];
};

export type NameError = "empty" | "slash" | "tooLong" | "duplicate" | null;

export type SearchHit = {
  item: WorkspaceItem;
  pathLabel: string;
};
