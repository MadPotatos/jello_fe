import { Backend_URL } from "@/lib/Constants";
import { List } from "@/lib/types";

export const fetchLists = async (projectId: number): Promise<List[]> => {
  try {
    const response = await fetch(`${Backend_URL}/list/${projectId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw error;
  }
};

export const createList = async (projectId: number) => {
  const response = await fetch(`${Backend_URL}/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId }),
  });
  if (!response.ok) {
    throw new Error("Failed to create list");
  }
};

export const updateList = async (listId: number, name: string) => {
  const response = await fetch(`${Backend_URL}/list/${listId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to update list name");
  }
};

export const deleteList = async (listId: number) => {
  const response = await fetch(`${Backend_URL}/list/${listId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete list");
  }
};

export const reorderLists = async (body: any) => {
  const response = await fetch(`${Backend_URL}/list/reorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to reorder lists");
  }
};
