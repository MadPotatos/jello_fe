"use client";
import { fetchMembers } from "@/app/api/memberApi";
import { Member } from "@/lib/types";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Filter from "../Filter";
import { fetchAllIssues } from "@/app/api/issuesApi";
import { Avatar, Spin, Table, Tag, Progress } from "antd";
import { List as ListType } from "@/lib/types";
import dayjs from "dayjs";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  getColoredIconByIssueType,
  getColoredIconByPriority,
} from "@/lib/utils";
import dynamic from "next/dynamic";
import { fetchLists } from "@/app/api/listApi";
import { useTranslations } from "next-intl";
import { IssuePriority, IssueType } from "@/lib/enum";

const IssueDetailModal = dynamic(
  () => import("@/components/modal/IssueDetailModal"),
  {
    ssr: false,
  }
);

const AllIssuesListPage = () => {
  const t = useTranslations("allIssues");
  const pathname = usePathname();
  const projectId = Number(pathname.split("/")[4]);
  const [filteredIssues, setFilteredIssues] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [selectedRowKey, setSelectedRowKey] = useState<number | null>(null);
  const [filterUseId, setFilterUserId] = useState<number>();
  const [filterTypes, setFilterTypes] = useState<IssueType[]>([]);
  const [filterPriorities, setFilterPriorities] = useState<IssuePriority[]>([]);

  const { data: members } = useSWR<Member[]>(`members-${projectId}`, () =>
    fetchMembers(projectId)
  );
  const { data: issues } = useSWR<any>(`all-issues-${projectId}`, () =>
    fetchAllIssues(projectId)
  );

  const { data: lists } = useSWR<ListType[]>(`lists-${projectId}`, () =>
    fetchLists(projectId)
  );

  const handleIssueClick = (issue: any) => {
    setSelectedIssue(issue);
    setDetailModalVisible(true);
    setSelectedRowKey(issue.id);
  };

  useEffect(() => {
    setFilteredIssues(issues);
  }, [issues]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterIssues(query, filterUseId, filterTypes, filterPriorities);
  };

  const handleUserClick = (userId: number) => {
    setFilterUserId(userId);
    filterIssues(searchQuery, userId, filterTypes, filterPriorities);
  };

  const handleFilterChange = (filter: {
    types: IssueType[];
    priorities: IssuePriority[];
  }) => {
    setFilterTypes(filter.types);
    setFilterPriorities(filter.priorities);
    filterIssues(searchQuery, filterUseId, filter.types, filter.priorities);
  };
  const handleClearFilter = () => {
    setFilterTypes([]);
    setFilterPriorities([]);
    setFilterUserId(undefined);
    filterIssues(searchQuery);
  };

  const filterIssues = (
    query: string,
    userId?: number,
    types: IssueType[] = [],
    priorities: IssuePriority[] = []
  ) => {
    if (!issues) return;
    const filtered = issues?.filter((issue: any) => {
      const matchesSearchQuery = issue.summary
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesUserId = userId
        ? issue.assignees.some((assignee: any) => assignee.userId === userId)
        : true;
      const matchesType = types.length > 0 ? types.includes(issue.type) : true;
      const matchesPriority =
        priorities.length > 0 ? priorities.includes(issue.priority) : true;
      return (
        matchesSearchQuery && matchesUserId && matchesType && matchesPriority
      );
    });
    setFilteredIssues(filtered);
  };

  const columns: any[] = [
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (text: string, record: any) => (
        <div>{getColoredIconByIssueType(record.type)}</div>
      ),
      sorter: (a: any, b: any) => a.type - b.type,
    },
    {
      title: t("summary"),
      dataIndex: "summary",
      key: "summary",
      width: "20%",
    },
    {
      title: t("priority"),
      dataIndex: "priority",
      key: "priority",
      align: "center",
      render: (text: string, record: any) => (
        <div>{getColoredIconByPriority(record.priority)}</div>
      ),
      sorter: (a: any, b: any) => a.priority - b.priority,
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text: string, record: any) =>
        record.List ? (
          <Tag color="blue" className="text-sm pb-1 pt-0.5 rounded-full">
            {record.List.name}
          </Tag>
        ) : (
          <></>
        ),
    },
    {
      title: t("sprint"),
      dataIndex: "sprint",
      key: "sprint",
      align: "center",
      render: (text: string, record: any) =>
        record.Sprint ? (
          <Tag color="blue" className="text-sm pb-1 pt-0.5 rounded-full">
            {record.Sprint.name}
          </Tag>
        ) : (
          <></>
        ),
    },
    {
      title: (
        <span className="flex items-center gap-3">
          <TeamOutlined />
          {t("assignee")}
        </span>
      ),
      dataIndex: "assignee",
      key: "assignee",
      render: (text: string, record: any) => (
        <Avatar.Group
          maxCount={2}
          size="large"
          maxStyle={{
            color: "#f56a00",
            backgroundColor: "#fde3cf",
          }}
          style={{ minWidth: "80px" }}
        >
          {record.assignees && record.assignees.length > 0 ? (
            record.assignees.map((assignee: any) => (
              <Avatar
                key={assignee.userId}
                src={assignee.User.avatar || "/images/default_avatar.jpg"}
              />
            ))
          ) : (
            <span></span>
          )}
        </Avatar.Group>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-3">
          <CalendarOutlined />
          {t("dueDate")}
        </span>
      ),
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text: string, record: any) => (
        <span>
          {record.dueDate ? dayjs(record.dueDate).format("DD/MM/YYYY") : ""}
        </span>
      ),
      sorter: (a: any, b: any) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix();
      },
    },
    {
      title: (
        <span className="flex items-center gap-3">
          <UserOutlined />
          {t("reporter")}
        </span>
      ),
      dataIndex: "reporter",
      key: "reporter",
      width: "210px",
      render: (text: string, record: any) => (
        <div className="flex items-center">
          <Avatar
            src={record.User.avatar || "/images/default_avatar.jpg"}
            size="large"
            style={{ marginRight: "10px" }}
          />
          <span>{record.User.name}</span>
        </div>
      ),
    },
    {
      title: t("progress"),
      dataIndex: "progress",
      key: "progress",
      width: "210px",
      render: (text: string, record: any) => (
        <Progress percent={record.progress} status="active" />
      ),
      sorter: (a: any, b: any) => a.progress - b.progress,
    },
  ];

  if (!members || !issues) {
    return (
      <div className="site-layout-content">
        <div className="grid h-[40vh] w-full place-items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="site-layout-content">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        {t("issues")}
      </h1>
      <Filter
        members={members}
        onSearch={handleSearch}
        onUserClick={handleUserClick}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
      />
      <div className="py-4">
        <Table
          columns={columns}
          dataSource={filteredIssues}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: "max-content" }}
          rowClassName={(record) =>
            record.id === selectedRowKey ? "bg-blue-100" : ""
          }
          onRow={(record) => {
            return {
              onClick: () => handleIssueClick(record),
              className: "hover:bg-gray-100 cursor-pointer",
            };
          }}
        />
        {selectedIssue && (
          <IssueDetailModal
            issue={selectedIssue}
            lists={lists}
            visible={true}
            onClose={() => {
              setSelectedIssue(null);
              setSelectedRowKey(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AllIssuesListPage;
