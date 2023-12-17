import { useSession, signOut } from "next-auth/react";
import { Button, Avatar, Dropdown, Menu } from "antd";
import { SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import React from "react";

const SignInButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    { key: "manage-account", label: "Manage Account", icon: <SettingOutlined />, onClick: () => handleNavigate("/manage-account") },
    { key: "signout", label: "Sign Out", icon: <LogoutOutlined />, onClick: handleSignOut },
  ];

  if (session && session.user)
    return (
      <div className="flex gap-4 ml-auto items-center">
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="profile" disabled>
                <div className="flex items-center">
                  <Avatar
                    size="large"
                    src={session.user.avatar}
                    alt={session.user.name}
                    className="mr-2"
                  />
                  <div>
                    <div className="text-sky-600">{session.user.name}</div>
                    <div className="text-gray-500">{session.user.email}</div>
                  </div>
                </div>
              </Menu.Item>
              <Menu.Divider />
              {menuItems.map(item => (
                <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
          }
          trigger={['click']}
        >
          <Avatar size="large" src={session.user.avatar} alt={session.user.name} />
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


