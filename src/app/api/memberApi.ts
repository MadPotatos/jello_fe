import { Backend_URL } from "@/lib/Constants";
import { Member } from "@/lib/types";

export const fetchMembers = async (projectId: number): Promise<Member[]> => {
  const response = await fetch(`${Backend_URL}/member/${projectId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await response.json();
  return data.members;
};
