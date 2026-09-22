import { ROOT_ID } from "./constants";
import type { WorkspaceItem, WorkspaceMap } from "./types";

function makeItem(
  id: string,
  name: string,
  type: WorkspaceItem["type"],
  parentId: string | null,
  content = "",
): WorkspaceItem {
  const now = Date.now();
  return {
    id,
    name,
    type,
    parentId,
    content,
    createdAt: now,
    updatedAt: now,
  };
}

export function createSeedWorkspace(): WorkspaceMap {
  const items: WorkspaceMap = {};

  const add = (item: WorkspaceItem) => {
    items[item.id] = item;
  };

  add(makeItem(ROOT_ID, "Workspace", "folder", null));
  add(makeItem("projects", "Projects", "folder", ROOT_ID));
  add(makeItem("webbly", "Webbly", "folder", "projects"));
  add(
    makeItem(
      "notes",
      "notes.txt",
      "file",
      "webbly",
      "Welcome to Mini Workspace Explorer.\n\nThis is a sample notes file. Edit me, then hit Save.\n",
    ),
  );
  add(
    makeItem(
      "tasks",
      "tasks.txt",
      "file",
      "webbly",
      "- Build the tree view\n- Add create / rename / delete\n- Persist to localStorage\n",
    ),
  );
  add(makeItem("personal", "Personal", "folder", "projects"));
  add(makeItem("documents", "Documents", "folder", ROOT_ID));
  add(
    makeItem(
      "readme",
      "README.txt",
      "file",
      ROOT_ID,
      "Mini Workspace Explorer\n\nClick folders in the sidebar.\nCreate files and folders from the toolbar.\nSearch from the top of the sidebar.\n",
    ),
  );

  return items;
}
