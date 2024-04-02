import { Backend_URL } from "@/lib/Constants";
import { IssueComment } from "@/lib/types";

export const fetchComments = async (
  issueId: number
): Promise<IssueComment[]> => {
  try {
    const response = await fetch(`${Backend_URL}/comments/${issueId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const createComment = async (
  userId: number | undefined,
  issueId: number,
  descr: string,
  accessToken: string | undefined
) => {
  const response = await fetch(`${Backend_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ userId, issueId, descr }),
  });
  if (!response.ok) {
    throw new Error("Failed to create comment");
  }
};

export const deleteComment = async (
  commentId: number,
  accessToken: string | undefined
) => {
  const response = await fetch(`${Backend_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }
};
