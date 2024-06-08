import React, { useState } from "react";
import { Input, Avatar, Button, Checkbox, MenuProps, Tooltip } from "antd";
import { UserAddOutlined, FilterOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { Member } from "@/lib/types";
import dynamic from "next/dynamic";
import { priorityOptions, typeOptions } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

const AddMemberModal = dynamic(
  () => import("@/components/modal/AddMemberModal"),
  {
    ssr: false,
  }
);

const UserPopover = dynamic(() => import("@/components/UserPopover"), {
  ssr: false,
});

const Dropdown = dynamic(() => import("antd").then((mod) => mod.Dropdown), {
  ssr: false,
});

interface FilterProps {
  members: Member[] | undefined;
  onSearch: (query: string) => void;
  onUserClick: (userId: number) => void;
  onFilterChange: (filter: { types: number[]; priorities: number[] }) => void;
  onClearFilter: () => void;
}

const Filter: React.FC<FilterProps> = ({
  members,
  onSearch,
  onUserClick,
  onFilterChange,
  onClearFilter,
}) => {
  const t = useTranslations();
  const { data: session } = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [filtering, setFiltering] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<number[]>([]);
  const pathname = usePathname();
  const projectId = Number(pathname.split("/")[4]);
  const isAdmin = members?.some(
    (member) => member.userId === session?.user?.id && member.isAdmin
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUserClick = (userId: number) => {
    setSelectedAvatar(userId);
    onUserClick(userId);
    setFiltering(true);
  };

  const handleSearchIssue = (query: string) => {
    onSearch(query);
  };

  const handleTypeChange = (checkedValues: number[]) => {
    setSelectedTypes(checkedValues);
    onFilterChange({ types: checkedValues, priorities: selectedPriorities });
    setFiltering(true);
  };

  const handlePriorityChange = (checkedValues: number[]) => {
    setSelectedPriorities(checkedValues);
    onFilterChange({ types: selectedTypes, priorities: checkedValues });
    setFiltering(true);
  };

  const clearFilter = () => {
    setSelectedAvatar(null);
    onUserClick(0);
    setFiltering(false);
    onSearch("");
    setSelectedTypes([]);
    setSelectedPriorities([]);
    onClearFilter();
  };

  const typeMenuItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Checkbox.Group
          options={typeOptions(t)}
          value={selectedTypes}
          onChange={handleTypeChange}
        />
      ),
    },
  ];

  const priorityMenuItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Checkbox.Group
          options={priorityOptions(t)}
          value={selectedPriorities}
          onChange={handlePriorityChange}
        />
      ),
    },
  ];

  return (
    <div className="flex justify-between items-center mb-4 pr-8">
      <div className="flex items-center">
        <Input.Search
          placeholder={t("Filter.searchIssues")}
          size="large"
          onSearch={handleSearchIssue}
        />
        <div className="ml-4">
          <Avatar.Group
            maxCount={5}
            size="large"
            maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
          >
            {members?.map((member: Member) => (
              <UserPopover user={member} key={member.userId}>
                <Avatar
                  key={member.userId}
                  src={member.avatar || "/images/default_avatar.jpg"}
                  alt={member.name}
                  size="large"
                  style={{
                    border:
                      selectedAvatar === member.userId
                        ? "3px solid #0064f2"
                        : "none",
                  }}
                  onClick={() => handleUserClick(member.userId)}
                />
              </UserPopover>
            ))}
          </Avatar.Group>
        </div>
        <Tooltip title={t("Filter.addMember")}>
          <Button
            type="text"
            shape="circle"
            icon={<UserAddOutlined />}
            disabled={!isAdmin}
            size="large"
            style={{ marginLeft: "10px", backgroundColor: "#d8d9dc" }}
            onClick={showModal}
          />
        </Tooltip>
        {filtering && (
          <Button
            type="text"
            size="large"
            onClick={clearFilter}
            style={{ marginLeft: "10px", color: "#f5222d" }}
          >
            {t("Filter.clearFilter")}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Dropdown
          menu={{
            items: typeMenuItems,
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<FilterOutlined />}>
            {t("Filter.type")}
          </Button>
        </Dropdown>
        <Dropdown
          menu={{
            items: priorityMenuItems,
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<FilterOutlined />}>
            {t("Filter.priority")}
          </Button>
        </Dropdown>
      </div>
      <AddMemberModal
        isVisible={isModalVisible}
        onCancel={handleCancel}
        projectId={projectId}
        members={members}
      />
    </div>
  );
};

export default Filter;
