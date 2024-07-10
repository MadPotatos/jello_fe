import { Backend_URL } from "@/lib/Constants";

export const fetchUserStory = async (
  projectId: number | undefined
): Promise<any> => {
  try {
    const response = await fetch(`${Backend_URL}/user-story/${projectId}`, {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user story:", error);
    throw error;
  }
};

export const createUserStory = async (body: any) => {
  try {
    const response = await fetch(`${Backend_URL}/user-story`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user story:", error);
    throw error;
  }
};

export const updateUserStory = async (body: any, userStoryId: number) => {
  try {
    const response = await fetch(`${Backend_URL}/user-story/${userStoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user story:", error);
    throw error;
  }
};

export const deleteUserStory = async (userStoryId: number) => {
  try {
    const response = await fetch(`${Backend_URL}/user-story/${userStoryId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting user story:", error);
    throw error;
  }
};
