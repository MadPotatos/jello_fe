import { Backend_URL } from "@/lib/Constants";
import { Sprint } from "@/lib/types";

export const fetchSprints = async (projectId: number): Promise<Sprint[]> => {
  const response = await fetch(`${Backend_URL}/sprints/${projectId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch sprints");
  }
  return response.json();
};
