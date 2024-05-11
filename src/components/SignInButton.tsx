import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Space, Badge } from "antd";
import type { MenuProps } from "antd";
import { useSession, signOut } from "next-auth/react";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { BellTwoTone, DeleteOutlined } from "@ant-design/icons";
import { fetchUser } from "@/app/api/userApi";
import useSWR, { mutate } from "swr";
import { User } from "@/lib/types";
import { fetchNotifications, markAsRead } from "@/app/api/notificationApi";
import dayjs from "dayjs";

const SignInButton: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  const { data: user } = useSWR<User>(
    userId ? `user-profile-${userId}` : null,
    () => fetchUser(userId) || ({} as User)
  );

  const { data: notifications } = useSWR(
    userId ? `notifications-${userId}` : null,
    () => fetchNotifications(userId, session?.backendTokens.accessToken)
  );

  const handleSignOut = () => {
    signOut();
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const formatNotificationTime = (createdAt: string) => {
    const notificationDate = dayjs(createdAt);
    const now = dayjs();
    const diffInMinutes = now.diff(notificationDate, "minute");

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return Math.round(diffInMinutes) + " minutes ago";
    } else if (diffInMinutes < 1440) {
      return Math.round(diffInMinutes / 60) + " hours ago";
    } else {
      return notificationDate.format("MMM D, YYYY");
    }
  };

  const handleOpenNotification = async (
    notificationId: number,
    projectId: number,
    isRead: boolean,
    accessToken: string | undefined
  ) => {
    try {
      if (!isRead) {
        await markAsRead(notificationId, accessToken);
        mutate(`notifications-${userId}`);
      }
      handleNavigate("/projects/detail/" + projectId + "/board");
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="flex items-center">
          <Avatar size="large" src={user?.avatar ?? ""} alt={user?.name} />
          <div>
            <div className="pl-2 text-sky-600">{user?.name}</div>
            <div className="pl-2 text-gray-500">{user?.email}</div>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      key: "manage-account",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => handleNavigate("/user/" + user?.id),
    },
    {
      key: "trash",
      label: "Recycle Bin",
      icon: <DeleteOutlined />,
      onClick: () => handleNavigate("/trash/" + user?.id),
    },
    {
      key: "signout",
      label: "Sign Out",
      icon: <LogoutOutlined />,
      onClick: handleSignOut,
    },
  ];

  const notificationItems: MenuProps["items"] =
    notifications?.notifications?.map((notification: any) => ({
      key: "notification-" + notification.id,
      label: (
        <div className="flex justify-between w-full items-center ">
          <div className="flex items-center gap-3">
            <Avatar
              size="large"
              src={notification.Project.image ?? ""}
              alt={notification.Project.name}
            />
            <div className="grow-0 w-80">
              <div className="text-sky-600 text-lg">
                {notification.Project.name}
              </div>
              <div className="text-gray-500">{notification.message}</div>
              <div className="text-gray-400">
                {formatNotificationTime(notification.createdAt)}
              </div>
            </div>
          </div>
          <div>
            {!notification.isRead ? (
              <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      ),
      onClick: () =>
        handleOpenNotification(
          notification.id,
          notification.projectId,
          notification.isRead,
          session?.backendTokens.accessToken
        ),
    }));

  if (session?.user)
    return (
      <div className="flex gap-6 ml-auto items-center">
        <Dropdown
          menu={{
            items: notificationItems,
            style: { maxHeight: 300, overflowY: "auto" },
          }}
          trigger={["click"]}
          placement="bottom"
        >
          <Badge
            count={notifications?.unreadNotificationsCount}
            offset={[-8, 3]}
          >
            <BellTwoTone className="text-2xl px-2" />
          </Badge>
        </Dropdown>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar size="large" src={user?.avatar} alt={user?.name} />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    );

  return (
    <div className="flex gap-4 ml-auto items-center">
      <Button
        type="primary"
        style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
        onClick={() => handleNavigate("/api/auth/signin")}
        className="text-l font-bold"
      >
        Sign In
      </Button>
    </div>
  );
};

export default SignInButton;
