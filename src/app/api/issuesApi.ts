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

export const fetchSubIssues = async (issueId: number) => {
  try {
    const response = await fetch(`${Backend_URL}/issues/sub/${issueId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sub issues:", error);
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

export const createTask = async (values: any) => {
  const response = await fetch(`${Backend_URL}/issues/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...values }),
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
};

export const fetchIssuesNotInSprint = async (userStoryId: number) => {
  try {
    const response = await fetch(
      `${Backend_URL}/issues/user-story/not-in-sprint/${userStoryId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching issues not in sprint:", error);
    throw error;
  }
};

export const addIssueToSprint = async (issueId: number, sprintId: number) => {
  try {
    const response = await fetch(
      `${Backend_URL}/issues/sprint/${issueId}/${sprintId}`,
      {
        method: "PUT",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add issue to sprint");
    }
  } catch (error) {
    console.error("Error adding issue to sprint:", error);
    throw error;
  }
};

export const fetchAssignedIssues = async (
  projectId: number,
  userId: number
) => {
  try {
    const response = await fetch(
      `${Backend_URL}/issues/assigned/${projectId}/${userId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching assigned issues:", error);
    throw error;
  }
};

export const fetchAllIssuesAndUserStory = async (projectId: number) => {
  try {
    const response = await fetch(
      `${Backend_URL}/issues/all-issues-and-user-story/${projectId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all issues and user story:", error);
    throw error;
  }
};
