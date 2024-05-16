"use client";
import { fetchMembers } from "@/app/api/memberApi";
import { Member } from "@/lib/types";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Filter from "../Filter";
import { fetchAllIssues } from "@/app/api/issuesApi";
import { Avatar, Spin, Table, Tag } from "antd";
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

const IssueDetailModal = dynamic(() => import("@/components/IssueDetail"), {
  ssr: false,
});

const AllIssuesListPage = () => {
  const pathname = usePathname();
  const projectId = Number(pathname.split("/")[3]);
  const [filteredIssues, setFilteredIssues] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

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
  };

  useEffect(() => {
    setFilteredIssues(issues);
  }, [issues]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterIssues(query);
  };

  const filterIssues = (query: string) => {
    if (!issues) return;
    const filtered = issues?.filter((issue: any) =>
      issue.summary.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredIssues(filtered);
  };

  const columns: any[] = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (text: string, record: any) => (
        <div>{getColoredIconByIssueType(record.type)}</div>
      ),
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
      width: "20%",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      align: "center",
      render: (text: string, record: any) => (
        <div>{getColoredIconByPriority(record.priority)}</div>
      ),
    },
    {
      title: "Status",
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
      title: "Sprint",
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
          Assignee
        </span>
      ),
      dataIndex: "assignee",
      key: "assignee",
      render: (text: string, record: any) => (
        <Avatar.Group
          maxCount={2}
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
          Created
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string, record: any) => (
        <span>{dayjs(record.createdAt).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-3">
          <CalendarOutlined />
          Updated
        </span>
      ),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text: string, record: any) => (
        <span>{dayjs(record.updatedAt).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-3">
          <UserOutlined />
          Reporter
        </span>
      ),
      dataIndex: "reporter",
      key: "reporter",
      render: (text: string, record: any) => (
        <div className="flex items-center">
          <Avatar
            src={record.User.avatar || "/images/default_avatar.jpg"}
            size={48}
            style={{ marginRight: "10px" }}
          />
          <span>{record.User.name}</span>
        </div>
      ),
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
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Backlog</h1>
      <Filter members={members} onSearch={handleSearch} />
      <Table
        columns={columns}
        dataSource={filteredIssues}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
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
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
};

export default AllIssuesListPage;
