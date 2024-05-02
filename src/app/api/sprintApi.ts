import { Backend_URL } from "@/lib/Constants";
import { Sprint } from "@/lib/types";

export const fetchSprints = async (projectId: number): Promise<Sprint[]> => {
  const response = await fetch(`${Backend_URL}/sprint/${projectId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch sprints");
  }
  return response.json();
};

export const fetchNotInProgressSprints = async (projectId: number) => {
  const response = await fetch(`${Backend_URL}/sprint/remain/${projectId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch sprints");
  }
  return response.json();
};

export const fetchCurrentSprint = async (projectId: number) => {
  const response = await fetch(`${Backend_URL}/sprint/current/${projectId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch current sprint");
  }
  return response.json();
};

export const createSprint = async (
  projectId: number,
  accessToken: string | undefined
) => {
  const response = await fetch(`${Backend_URL}/sprint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ projectId }),
  });
  if (!response.ok) {
    throw new Error("Failed to create sprint");
  }
};

export const updateSprint = async (
  sprintId: number,
  body: any,
  accessToken: string | undefined
) => {
  const response = await fetch(`${Backend_URL}/sprint/${sprintId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    return response.json();
  }
  return response;
};

export const deleteSprint = async (
  sprintId: number,
  accessToken: string | undefined
) => {
  const response = await fetch(`${Backend_URL}/sprint/${sprintId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete list");
  }
};

export const completeSprint = async (
  sprintId: number,
  destinationId: number,
  accessToken: string | undefined
) => {
  const response = await fetch(`${Backend_URL}/sprint/${sprintId}/complete`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ destinationId }),
  });
  if (!response.ok) {
    throw new Error("Failed to complete sprint");
  }
};
