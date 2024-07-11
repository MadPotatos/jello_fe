"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input, Button, Form, message, Avatar, Modal } from "antd";
import { Member, ProjectDetail } from "@/lib/types";
import useSWR, { mutate } from "swr";
import {
  fetchProjectById,
  updateProject,
  updateProjectImage,
} from "@/app/api/projectApi";
import { fetchMembers } from "@/app/api/memberApi";
import { validateRepository } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { EditTwoTone } from "@ant-design/icons";

const UploadImage = dynamic(() => import("@/components/UploadImage"), {
  ssr: false,
});

const MembersModal = dynamic(() => import("@/components/modal/MembersModal"), {
  ssr: false,
});

const ProjectSettingPage = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);
  const t = useTranslations("projectSettings");

  const projectId: number = parseInt(pathname.split("/")[4]);
  const { data: project } = useSWR<ProjectDetail>(`project-${projectId}`, () =>
    fetchProjectById(projectId)
  );
  const { data: members } = useSWR<Member[]>(`members-${projectId}`, () =>
    fetchMembers(projectId)
  );

  const [image, setImage] = useState<string>(project?.image || "");

  const isAdmin = members?.some(
    (member) => member.userId === session?.user?.id && member.isAdmin
  );
  const [form] = Form.useForm();

  const handleUpdateProject = async (values: any) => {
    try {
      await updateProject(
        projectId,
        values,
        session?.backendTokens.accessToken
      );
      message.success(t("updateSuccess"));
      mutate(`project-${projectId}`);
    } catch (error) {
      message.error(t("updateError"));
    }
  };

  const handleUpdateImage = async (id: number, image: string) => {
    try {
      if (image === "") {
        message.error(t("selectImageError"));
        return;
      }
      await updateProjectImage(id, image, session?.backendTokens.accessToken);
      message.success(t("imageUpdateSuccess"));
      setIsImageModalVisible(false);
      mutate(`project-${projectId}`);
    } catch (error) {
      console.error("Error updating image:", error);
      throw error;
    }
  };

  const handleCancelImageModal = () => {
    setIsImageModalVisible(false);
  };

  const handleCancelMembersModal = () => {
    setIsMembersModalVisible(false);
  };

  useEffect(() => {
    form.setFieldsValue({
      name: project?.name,
      repo: project?.repo,
      descr: project?.description,
      productGoal: project?.productGoal,
    });
  }, [project]);

  return (
    <div className="site-layout-content">
      <h1 className="mb-4 text-xl font-semibold text-c-text">{t("title")}</h1>
      <div className="flex mt-10 px-5 justify-center">
        <Form
          layout="vertical"
          className="min-w-[25rem] flex-col gap-4"
          onFinish={handleUpdateProject}
          form={form}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <Avatar
              src={project?.image}
              alt={project?.name}
              size={150}
              shape="square"
            />

            {isAdmin && (
              <Button
                type="text"
                size="large"
                onClick={() => setIsImageModalVisible(true)}
                style={{ backgroundColor: "#ccc" }}
              >
                {t("changeImage")}
              </Button>
            )}
          </div>

          <div className="mt-6 text-center">
            <Form.Item
              label={t("name")}
              name="name"
              rules={[{ required: true, message: t("nameError") }]}
            >
              <Input disabled={!isAdmin} />
            </Form.Item>
            <Form.Item
              label={t("repo")}
              name="repo"
              rules={[{ validator: validateRepository }]}
            >
              <Input disabled={!isAdmin} />
            </Form.Item>
            <Form.Item
              label={t("description")}
              name="descr"
              rules={[
                {
                  required: true,
                  message: t("descriptionError"),
                },
              ]}
            >
              <Input.TextArea disabled={!isAdmin} rows={4} />
            </Form.Item>
            <Form.Item label={t("productGoal")} name="productGoal">
              <Input disabled={!isAdmin} />
            </Form.Item>
            {isAdmin && (
              <Button type="primary" htmlType="submit" size="large">
                {t("save")}
              </Button>
            )}
          </div>
          <h2 className="mt-8 font-bold">{t("members")}</h2>
          <div className="py-4 flex items-center">
            <Avatar.Group
              maxCount={6}
              maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
              size={40}
            >
              {members && members.length > 0 ? (
                members.map((member: any) => (
                  <Avatar
                    key={member.userId}
                    src={member.avatar || "/images/default_avatar.jpg"}
                  />
                ))
              ) : (
                <p>{t("noMembers")}</p>
              )}
            </Avatar.Group>
            {isAdmin && (
              <Button
                type="text"
                size="large"
                onClick={() => setIsMembersModalVisible(true)}
              >
                <EditTwoTone />
              </Button>
            )}
          </div>
        </Form>
      </div>
      <Modal
        title={t("updateImageTitle")}
        open={isImageModalVisible}
        onOk={() => handleUpdateImage(projectId, image)}
        onCancel={handleCancelImageModal}
      >
        <UploadImage image={image} setImage={setImage} />
      </Modal>
      <MembersModal
        isVisible={isMembersModalVisible}
        members={members || []}
        projectId={projectId}
        onClose={handleCancelMembersModal}
      />
    </div>
  );
};

export default ProjectSettingPage;
