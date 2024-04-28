import { Backend_URL } from "@/lib/Constants";
import { Sprint } from "@/lib/types";

export const fetchSprints = async (projectId: number): Promise<Sprint[]> => {
  const response = await fetch(`${Backend_URL}/sprint/${projectId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch sprints");
  }
  return response.json();
};

export const createSprint = async (projectId: number) => {
  const response = await fetch(`${Backend_URL}/sprint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId }),
  });
  if (!response.ok) {
    throw new Error("Failed to create sprint");
  }
};

export const updateSprint = async (sprintId: number, body: any) => {
  const response = await fetch(`${Backend_URL}/sprint/${sprintId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to update sprint");
  }
};

export const deleteSprint = async (sprintId: number) => {
  const response = await fetch(`${Backend_URL}/sprint/${sprintId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete list");
  }
};
