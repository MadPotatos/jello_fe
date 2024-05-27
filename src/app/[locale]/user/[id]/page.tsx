"use client";
import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Avatar,
  message,
  notification,
  Card,
  Image,
} from "antd";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { EditOutlined } from "@ant-design/icons";
import { Project, User } from "@/lib/types";
import { Typography } from "antd";
import useSWR, { mutate } from "swr";
import { fetchProjects } from "@/app/api/projectApi";
import { fetchUser, updateAvatar, updateUser } from "@/app/api/userApi";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const UploadImage = dynamic(() => import("@/components/UploadImage"), {
  ssr: false,
});

const Modal = dynamic(() => import("antd").then((mod) => mod.Modal), {
  ssr: false,
});

const { Title, Text } = Typography;

const { Item } = Form;

const Profile = () => {
  const [editable, setEditable] = useState(false);
  const { data: session, update } = useSession();
  const pathname = usePathname();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userId: number = parseInt(pathname.split("/")[3]);

  const { data: projects } = useSWR<Project[]>(`project-all-${userId}`, () =>
    fetchProjects(userId)
  );
  const { data: user } = useSWR<User>(
    `user-profile-${userId}`,
    () => fetchUser(userId) || ({} as User)
  );

  const [image, setImage] = useState<string>(user?.avatar || "");
  const t = useTranslations("Profile");

  const showSuccessNotification = () => {
    notification.success({
      message: t("profileUpdated"),
      description: t("profileUpdatedDesc"),
    });
  };

  const showEmailTakenNotification = () => {
    notification.error({
      message: t("emailTaken"),
      description: t("emailTakenDesc"),
    });
  };

  const handleUpdateInfo = async (values: any) => {
    try {
      await updateUser(user?.id, values, session?.backendTokens.accessToken);
      setEditable(false);
      showSuccessNotification();
      await update();
      mutate(`user-profile-${userId}`);
    } catch (error) {
      if ((error as Error).message === "Email already taken") {
        showEmailTakenNotification();
      } else {
        message.error(t("updateFailed"));
      }
    }
  };

  const handleUpdateAvatar = async () => {
    try {
      if (image !== "") {
        await updateAvatar(user?.id, image, session?.backendTokens.accessToken);
        handleCancel();
        showSuccessNotification();
        await update();
        mutate(`user-profile-${userId}`);
        mutate(`project-all-${userId}`);
      } else {
        message.warning(t("chooseNewAvatar"));
      }
    } catch (error) {
      message.error(t("avatarUpdateFailed"));
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImage("");
  };

  const handleEditCancel = () => {
    setEditable(false);
  };

  return (
    <div className="h-full bg-gradient-to-b from-white to-blue-200 py-8 px-28 flex flex-col items-center space-y-4">
      <Card
        className="w-full"
        cover={
          <Image
            alt="Profile Background"
            preview={false}
            src="/images/profile-background.jpg"
            className="rounded-tl-lg rounded-tr-lg"
          />
        }
      >
        <div className="flex flex-col items-center -mt-20">
          <Avatar
            src={user?.avatar || "/images/default_avatar.jpg"}
            alt={`${user?.name}'s avatar`}
            size={160}
            onClick={() => session?.user?.id === user?.id && showModal()}
            className="cursor-pointer"
            style={{ border: "4px solid #fff" }}
          />
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-2xl">{user?.name}</p>
          </div>
          <p className="text-gray-700">{user?.job}</p>
          <p className="text-sm text-gray-500">{user?.organization}</p>
        </div>
      </Card>
      <div className="flex space-x-4 w-full">
        <Card className="flex-1 mt-4">
          {editable ? (
            <Form
              onFinish={handleUpdateInfo}
              initialValues={{
                name: user?.name,
                email: user?.email,
                job: user?.job,
                organization: user?.organization,
              }}
            >
              <Item label="Full name" name="name" rules={[{ required: true }]}>
                <Input />
              </Item>
              <Item
                label="Email"
                name="email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Item>
              <Item label="Job title" name="job">
                <Input />
              </Item>
              <Item label="Organization" name="organization">
                <Input />
              </Item>
              <Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "#1890ff" }}
                >
                  {t("save")}
                </Button>
                <Button onClick={handleEditCancel} className="ml-2">
                  {t("cancel")}
                </Button>
              </Item>
            </Form>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xl text-gray-900 font-bold">
                  {t("personalInfo")}
                </h4>
                {session?.user?.id === user?.id && (
                  <EditOutlined
                    style={{
                      fontSize: "20px",
                      color: "#1890ff",
                      cursor: "pointer",
                    }}
                    onClick={() => setEditable(true)}
                  />
                )}
              </div>
              <ul className="mt-2 text-gray-700">
                <li className="flex border-y py-2">
                  <span className="font-bold w-24">{t("fullName")}</span>
                  <span className="text-gray-700">{user?.name}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">{t("email")}</span>
                  <span className="text-gray-700">{user?.email}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">{t("jobTitle")}</span>
                  <span className="text-gray-700">{user?.job}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">{t("organization")}</span>
                  <span className="text-gray-700">{user?.organization}</span>
                </li>
              </ul>
            </div>
          )}
        </Card>

        {/* Project List */}
        <Card className="flex-1 mt-4">
          <h4 className="text-xl text-gray-900 font-bold mb-3">
            {t("projects")}
          </h4>
          <div className="overflow-x-scroll max-w-3xl flex flex-row  space-x-4">
            {projects && projects.length > 0 ? (
              projects.map((project: Project) => (
                <div key={project.id} className="mb-4">
                  <Card className="shadow-lg border border-gray-300 rounded-lg w-72">
                    <div className="flex flex-col items-center">
                      <Title level={4} className="mb-2">
                        {project.name}
                      </Title>
                      <Image
                        alt={project.name}
                        src={project.image || "/images/logo2.jpeg"}
                        preview={false}
                        className="w-full object-cover mb-4"
                      />
                      <Text className="mb-4">{project.description}</Text>
                      <div className="flex items-center">
                        <span className="font-semibold"> {t("leader")}</span>
                        {project.leader && (
                          <Avatar
                            src={project.leader.avatar}
                            size={32}
                            className="ml-2"
                          />
                        )}
                        <Text className="ml-2">{project.leader?.name}</Text>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <p>{t("noProjects")}</p>
            )}
          </div>
        </Card>
      </div>

      <Modal
        title="Update Avatar"
        open={isModalVisible}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {t("cancel")}
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateAvatar}>
            {t("save")}
          </Button>,
        ]}
      >
        <UploadImage image={image} setImage={setImage} />
      </Modal>
    </div>
  );
};

export default Profile;
