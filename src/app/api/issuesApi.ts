import { Backend_URL } from "@/lib/Constants";

export const fetchAllIssues = async (projectId: number) => {
  try {
    const response = await fetch(`${Backend_URL}/issues/all/${projectId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};

export const fetchIssuesInList = async (projectId: number) => {
  try {
    const response = await fetch(`${Backend_URL}/issues/list/${projectId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};

export const fetchIssuesInSprint = async (projectId: number) => {
  try {
    const response = await fetch(`${Backend_URL}/issues/sprint/${projectId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};

export const createIssue = async (
  values: any,
  accessToken: string | undefined
) => {
  const response = await fetch(`${Backend_URL}/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ ...values }),
  });
  if (!response.ok) {
    throw new Error("Failed to create issue");
  }
};

export const updateIssue = async (
  issueId: number,
  type: string,
  value: string,
  projectId: number,
  accessToken: string | undefined
) => {
  const response = await fetch(`${Backend_URL}/issues/${issueId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ type, value, projectId }),
  });
  if (!response.ok) {
    throw new Error("Failed to update issue");
  }
};

export const deleteIssue = async (
  issueId: number,
  accessToken: string | undefined
) => {
  const response = await fetch(`${Backend_URL}/issues/${issueId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete issue");
  }
};

export const reorderIssues = async (body: any) => {
  const response = await fetch(`${Backend_URL}/issues/reorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to reorder issues");
  }
};

export const updateIssueDate = async (issueId: number) => {
  const response = await fetch(`${Backend_URL}/issues/update/${issueId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to update issue date");
  }
};
