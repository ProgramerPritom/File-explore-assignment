import type { NameError, WorkspaceMap } from "./types";
import { MAX_NAME_LENGTH } from "./constants";

export function normalizeName(raw: string): string {
  return raw.trim();
}

export function findNameError(
  items: WorkspaceMap,
  parentId: string,
  rawName: string,
  ignoreId?: string,
): NameError {
  const name = normalizeName(rawName);

  if (!name) {
    return "empty";
  }

  if (name.includes("/") || name.includes("\\")) {
    return "slash";
  }

  if (name.length > MAX_NAME_LENGTH) {
    return "tooLong";
  }

  const lowered = name.toLowerCase();
  const clash = Object.values(items).some((item) => {
    if (item.parentId !== parentId) {
      return false;
    }
    if (ignoreId && item.id === ignoreId) {
      return false;
    }
    return item.name.toLowerCase() === lowered;
  });

  if (clash) {
    return "duplicate";
  }

  return null;
}

export function nameErrorMessage(error: NameError): string {
  if (error === "empty") {
    return "Please enter a name.";
  }
  if (error === "slash") {
    return "Names cannot contain slashes.";
  }
  if (error === "tooLong") {
    return `Keep names under ${MAX_NAME_LENGTH} characters.`;
  }
  if (error === "duplicate") {
    return "That name is already used in this folder.";
  }
  return "";
}
