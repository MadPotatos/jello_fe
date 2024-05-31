import React from "react";
import { Avatar, Popover } from "antd";
import { useTranslations } from "next-intl";

interface UserPopoverProps {
  user: any;
  children: React.ReactNode;
}

const UserPopover: React.FC<UserPopoverProps> = ({ user, children }) => {
  const t = useTranslations("UserPopover");
  return (
    <Popover
      content={
        <div className="max-w-xs py-3 rounded-lg">
          <div className="flex photo-wrapper p-2 justify-center">
            <Avatar
              src={user.avatar || "/images/default_avatar.jpg"}
              size={64}
            />
          </div>
          <div className="p-2">
            <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
              {user.name}
            </h3>
            <div className="text-center text-gray-400 text-xs font-semibold">
              <p>{user.email}</p>
            </div>
            <div className="text-center my-3">
              <a
                className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                href={`/user/${user.userId}`}
              >
                {t("profile")}
              </a>
            </div>
          </div>
        </div>
      }
      title=""
      trigger="hover"
    >
      {children}
    </Popover>
  );
};

export default UserPopover;
