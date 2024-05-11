import { Backend_URL } from "@/lib/Constants";

export const fetchNotifications = async (
  userId: number | undefined,
  accessToken: string | undefined
) => {
  try {
    const response = await fetch(`${Backend_URL}/notification/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markAsRead = async (
  notificationId: number,
  accessToken: string | undefined
) => {
  try {
    await fetch(`${Backend_URL}/notification/mark-as-read/${notificationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};
