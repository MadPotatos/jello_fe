import { Backend_URL } from "@/lib/Constants";
import { Role } from "@/lib/enum";
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

export const removeMember = async (projectId: number, userId: number) => {
  const response = await fetch(`${Backend_URL}/member/${projectId}/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to remove member");
  }
};

export const updateRole = async (
  projectId: number,
  userId: number,
  role: Role
) => {
  const response = await fetch(
    `${Backend_URL}/member/role/${projectId}/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update role");
  }
};

export const getMembersByRole = async (
  projectId: number,
  role: Role | null
): Promise<Member[]> => {
  const response = await fetch(`${Backend_URL}/member/${role}/${projectId}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await response.json();
  return data.members;
};

export const checkRole = async (
  projectId: number,
  userId: number | undefined
) => {
  const response = await fetch(
    `${Backend_URL}/member/checkRole/${projectId}/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to check membership");
  }
  const data = await response.json();
  console.log(data);
  return data;
};
