import { Backend_URL } from "@/lib/Constants";
import { Project, ProjectDetail } from "@/lib/types";

export const fetchProjects = async (userId: number): Promise<Project[]> => {
  const response = await fetch(`${Backend_URL}/project/all/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await response.json();
  return data.projects;
};

export const fetchProjectById = async (
  projectId: number
): Promise<ProjectDetail> => {
  const response = await fetch(`${Backend_URL}/project/${projectId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }
  const data = await response.json();
  return data;
};

export const fetchDeletedProjects = async (
  userId: number
): Promise<Project[]> => {
  const response = await fetch(`${Backend_URL}/project/deleted/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await response.json();
  return data.projects;
};

export const deleteProject = async (
  projectId: number,
  accessToken?: string
) => {
  const response = await fetch(`${Backend_URL}/project/delete/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
};

export const restoreProject = async (
  projectId: number,
  accessToken?: string
) => {
  const response = await fetch(`${Backend_URL}/project/restore/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to restore project");
  }
};

export const createProject = async (
  projectData: any,
  accessToken?: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${Backend_URL}/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(projectData),
    });

    return response.ok;
  } catch (error) {
    console.error("Error creating project:", error);
    return false;
  }
};

export const updateProject = async (
  projectId: number,
  projectData: any,
  accessToken?: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${Backend_URL}/project/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(projectData),
    });

    return response.ok;
  } catch (error) {
    console.error("Error updating project:", error);
    return false;
  }
};

export const updateProjectImage = async (
  projectId: number,
  image: string,
  accessToken?: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${Backend_URL}/project/${projectId}/image`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ image }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error updating project image:", error);
    return false;
  }
};
