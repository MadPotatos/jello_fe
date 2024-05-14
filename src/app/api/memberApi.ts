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

export const addMember = async (
  projectId: number,
  userId: number,
  accessToken: string | undefined
) => {
  const response = await fetch(`${Backend_URL}/member/${projectId}/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to add member");
  }
};

export const checkMembership = async (projectId: number, userId: number) => {
  const response = await fetch(
    `${Backend_URL}/member/check/${projectId}/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to check membership");
  }
  const data = await response.json();
  return data;
};
