import React, { useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Avatar, Button, Space, Badge, Divider } from "antd";
import type { MenuProps } from "antd";
import { useSession, signOut } from "next-auth/react";
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useRouter } from "next-nprogress-bar";
import { fetchUser } from "@/app/api/userApi";
import useSWR, { mutate } from "swr";
import { User } from "@/lib/types";
import {
  deleteNotification,
  fetchNotifications,
  markAllAsRead,
  markAsRead,
} from "@/app/api/notificationApi";
import dayjs from "dayjs";
import { connectSocket, disconnectSocket } from "@/lib/socketConnection";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { NotificationType } from "@/lib/enum";

const Dropdown = dynamic(() => import("antd").then((mod) => mod.Dropdown), {
  ssr: false,
});

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
  const t = useTranslations("Header");

  useEffect(() => {
    if (userId) {
      connectSocket(userId);

      return () => {
        disconnectSocket();
      };
    }
  }, [userId]);

  const handleSignOut = () => {
    disconnectSocket();
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
      return t("justNow");
    } else if (diffInMinutes < 60) {
      return Math.round(diffInMinutes) + t("minutesAgo");
    } else if (diffInMinutes < 1440) {
      return Math.round(diffInMinutes / 60) + t("hoursAgo");
    } else {
      return notificationDate.format("DD-MM-YYYY");
    }
  };
  const getNotificationMessage = (
    type: NotificationType,
    notification: any
  ) => {
    switch (type) {
      case NotificationType.ASSIGNED_TO_ISSUE:
        return `${t("assginToIssue")} ${notification.WorkItems.summary}`;
      case NotificationType.PROJECT_INVITE:
        return `${t("inviteToProject")} ${notification.Project.name}`;
      case NotificationType.SPRINT_STARTED:
        return `${t("sprintStart")} ${notification.Project.name}`;
      case NotificationType.SPRINT_COMPLETED:
        return `${t("sprintComplete")} ${notification.Project.name}`;
      default:
        return t("newNotification");
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

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(userId, session?.backendTokens.accessToken);
      mutate(`notifications-${userId}`);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (
    notificationId: number,
    accessToken: string | undefined
  ) => {
    try {
      await deleteNotification(notificationId, accessToken);
      mutate(`notifications-${userId}`);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="flex items-center">
          <Avatar
            size="large"
            src={user?.avatar || "/images/default_avatar.jpg"}
            alt={user?.name}
          />
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
      label: t("profile"),
      icon: <UserOutlined />,
      onClick: () => handleNavigate("/user/" + user?.id),
    },
    {
      key: "trash",
      label: t("recycleBin"),
      icon: <DeleteOutlined />,
      onClick: () => handleNavigate("/trash/" + user?.id),
    },
    {
      key: "signout",
      label: t("signout"),
      icon: <LogoutOutlined />,
      onClick: handleSignOut,
    },
  ];

  const notificationItemsWithHeader: MenuProps["items"] = [
    {
      key: "notification-header",
      label: (
        <div className="flex justify-between w-full items-center pb-4">
          <div className="text-lg font-bold">{t("notification")}</div>
          <Button
            type="link"
            onClick={() => handleMarkAllAsRead()}
            disabled={!notifications?.unreadNotificationsCount}
          >
            {t("markAllAsRead")}
          </Button>
        </div>
      ),
      disabled: true,
    },
    ...(notifications?.notifications?.length
      ? notifications.notifications.map((notification: any) => ({
          key: "notification-" + notification.id,
          label: (
            <div className="group relative">
              <div className="flex justify-between w-full items-center group-hover:bg-gray-100 p-2 rounded-md">
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
                    <div className="text-gray-500">
                      {" "}
                      {getNotificationMessage(
                        notification.type as NotificationType,
                        notification
                      )}
                    </div>
                    <div className="text-gray-400">
                      {formatNotificationTime(notification.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="group-hover:block hidden">
                    <Button
                      shape="circle"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(
                          notification.id,
                          session?.backendTokens.accessToken
                        );
                      }}
                    />
                  </div>
                  <div className="group-hover:hidden block">
                    <Button
                      shape="circle"
                      size="small"
                      className="opacity-0 pointer-events-none"
                    />
                  </div>

                  {!notification.isRead ? (
                    <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                  ) : (
                    <span className="h-3 w-3"></span>
                  )}
                </div>
              </div>
              <Divider className="m-2" />
            </div>
          ),
          onClick: () =>
            handleOpenNotification(
              notification.id,
              notification.projectId,
              notification.isRead,
              session?.backendTokens.accessToken
            ),
        }))
      : [
          {
            key: "no-new-notifications",
            label: (
              <div className="text-gray-500 text-lg text-center pb-4">
                {t("noNewNotifications")}
              </div>
            ),
            disabled: true,
          },
        ]),
  ];

  if (session?.user)
    return (
      <div className="flex gap-6 ml-auto items-center">
        <Dropdown
          menu={{
            items: notificationItemsWithHeader,
            style: { maxHeight: 450, overflowY: "auto" },
          }}
          trigger={["click"]}
          placement="bottom"
        >
          <Badge
            count={notifications?.unreadNotificationsCount}
            offset={[-8, 3]}
          >
            <Button
              type="default"
              icon={<BellOutlined />}
              color="blue-500"
              shape="circle"
              size="large"
              className="text-2xl"
            />
          </Badge>
        </Dropdown>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar
                size="large"
                src={user?.avatar || "/images/default_avatar.jpg"}
                alt={user?.name}
              />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    );

  return (
    <div className="flex gap-4 ml-auto items-center">
      <Button
        type="default"
        size="large"
        shape="round"
        onClick={() => handleNavigate("/auth/login")}
        className="text-l font-bold"
      >
        {t("signin")}
      </Button>
      <Button
        type="primary"
        size="large"
        shape="round"
        onClick={() => handleNavigate("/auth/signup")}
        className="text-l font-bold"
      >
        {t("signup")}
      </Button>
    </div>
  );
};

export default SignInButton;
