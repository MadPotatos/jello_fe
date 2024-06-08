import React from "react";
import { Modal, Button, Avatar, message, notification } from "antd";
import { Member } from "@/lib/types";
import { useTranslations } from "next-intl";
import { mutate } from "swr";
import { removeMember } from "@/app/api/memberApi";
import { useRouter } from "next-nprogress-bar";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;
interface MembersModalProps {
  isVisible: boolean;
  members: Member[];
  projectId: number;
  onClose: () => void;
}

const MembersModal: React.FC<MembersModalProps> = ({
  isVisible,
  members,
  projectId,
  onClose,
}) => {
  const t = useTranslations("projectSettings");
  const router = useRouter();

  const handleDeleteMember = async (memberId: number) => {
    try {
      confirm({
        title: t("removeMember"),
        icon: <ExclamationCircleOutlined />,
        content: t("removeMemberDesc"),
        okText: t("remove"),
        cancelText: t("cancel"),
        onOk: async () => {
          await removeMember(projectId, memberId);
          notification.success({
            message: t("memberRemoveSuccess"),
          });
          onClose();
          mutate(`members-${projectId}`);
          mutate(`issues-${projectId}`);
          mutate(`sprint-issues-${projectId}`);
          mutate(`all-issues-${projectId}`);
        },
      });
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <Modal
      title={t("editMembers")}
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      {members && members.length > 0 ? (
        members.map((member: any) => (
          <div
            key={member.userId}
            className="flex items-center justify-between mb-4"
          >
            <Avatar
              src={member.avatar || "/images/default_avatar.jpg"}
              size={40}
            />
            <div className="ml-4">
              <p>{member.name}</p>
              <p>{member.email}</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="link"
                onClick={() => router.push(`/user/${member.userId}`)}
                target="_blank"
              >
                {t("viewProfile")}
              </Button>
              {!member.isAdmin ? (
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteMember(member.userId)}
                >
                  {t("remove")}
                </Button>
              ) : (
                <Button style={{ visibility: "hidden" }}>{t("remove")}</Button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>{t("noMembers")}</p>
      )}
    </Modal>
  );
};

export default MembersModal;
