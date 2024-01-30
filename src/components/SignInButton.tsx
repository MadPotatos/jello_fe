import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Menu, Space, Divider, theme } from 'antd';
import type { MenuProps } from 'antd';
import { useSession, signOut } from 'next-auth/react';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { NotificationOutlined,DeleteOutlined } from '@ant-design/icons';

const { useToken } = theme;

const SignInButton: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

   const appendTimestamp = (url: string) => {
    const timestamp = new Date().getTime();
    return `${url}?timestamp=${timestamp}`;
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div className="flex items-center">
          <Avatar size="large" src={appendTimestamp(session?.user?.avatar ?? '')} alt={session?.user?.name} />
          <div>
            <div className="text-sky-600">{session?.user?.name}</div>
            <div className="text-gray-500">{session?.user?.email}</div>
          </div>
        </div>
      ),
      disabled: true,
    },
    { key: 'manage-account', label: 'Profile', icon: <UserOutlined/>, onClick: () => handleNavigate('/user/'+ session?.user.id) },
    { key: 'trash', label: 'Recycle Bin', icon: <DeleteOutlined/>, onClick: () => handleNavigate('/trash/'+session?.user.id) },
    { key: 'signout', label: 'Sign Out', icon: <LogoutOutlined />, onClick: handleSignOut },
  ];

  const { token } = useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  if (session?.user)
    return (
      <div className="flex gap-4 ml-auto items-center">
        <NotificationOutlined className='text-lg px-2'/>
      <Dropdown
        menu={{ items }}
        dropdownRender={(menu) => (
          <div style={contentStyle}>
            {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
            <Divider style={{ margin: 0 }} />
          </div>
        )}
        trigger={['click']}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            
            <Avatar size="large" src={session?.user?.avatar} alt={session?.user?.name} />
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
        style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
        onClick={() => handleNavigate('/api/auth/signin')}
        className="text-l font-bold"
      >
        Sign In
      </Button>
    </div>
  );
};

export default SignInButton;
