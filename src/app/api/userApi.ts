import { Backend_URL } from "@/lib/Constants";
import { User } from "@/lib/types";

export const updateUser = async (
  userId: number | undefined,
  userData: any,
  accessToken: string | undefined
) => {
  try {
    const response = await fetch(`${Backend_URL}/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (response.status === 409) {
      throw new Error("Email already taken");
    }
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateAvatar = async (
  userId: number | undefined,
  avatar: string,
  accessToken: string | undefined
) => {
  try {
    const response = await fetch(`${Backend_URL}/user/${userId}/avatar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ avatar }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
};

export const fetchUser = async (userId: number | undefined): Promise<User> => {
  try {
    const response = await fetch(`${Backend_URL}/user/profile/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const searchUsers = async (name: string): Promise<User[]> => {
  try {
    const response = await fetch(
      `${Backend_URL}/user/searchbyName?name=${name}`
    );
    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updatePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
  token: string | undefined
) => {
  try {
    const response = await fetch(
      `${Backend_URL}/user/${userId}/changePassword`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      }
    );
    if (!response.ok) {
      return response.json();
    }
    return response;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};
