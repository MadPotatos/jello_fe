"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button, Divider, Spin } from "antd";
import Board from "./Board";
import Filter from "../Filter";
import { List, Member, Sprint } from "@/lib/types";
import useSWR, { mutate } from "swr";
import { fetchMembers } from "@/app/api/memberApi";
import { fetchLists } from "@/app/api/listApi";
import { fetchIssues } from "@/app/api/issuesApi";
import { fetchCurrentSprint } from "@/app/api/sprintApi";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const CompleteSprintModel = dynamic(
  () => import("@/components/CompleteSprintModel"),
  {
    ssr: false,
  }
);
const Tooltip = dynamic(() => import("antd").then((mod) => mod.Tooltip), {
  ssr: false,
});

const ProjectDetailPage = () => {
  const pathname = usePathname();
  const projectId = Number(pathname.split("/")[3]);
  const { data: session } = useSession();
  const [filteredIssues, setFilteredIssues] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);

  const { data: members } = useSWR<Member[]>(`members-${projectId}`, () =>
    fetchMembers(projectId)
  );
  const { data: lists } = useSWR<List[]>(`lists-${projectId}`, () =>
    fetchLists(projectId)
  );
  const { data: issues } = useSWR(`issues-${projectId}`, () =>
    fetchIssues(projectId)
  );

  const { data: sprint } = useSWR<Sprint>(`current-sprint-${projectId}`, () =>
    fetchCurrentSprint(projectId)
  );

  const isAdmin = members?.some(
    (member) => member.userId === session?.user?.id && member.isAdmin
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterIssues(query);
  };

  const handleComplete = () => {
    setIsCompleteModalVisible(false);
    mutate(`sprints-${projectId}`);
    mutate(`sprint-issues-${projectId}`);
    mutate(`current-sprint-${projectId}`, undefined, false);
    mutate(`issues-${projectId}`);
  };

  const filterIssues = (query: string) => {
    if (!issues) return;

    const filtered = {} as any;
    Object.keys(issues).forEach((listId: string) => {
      filtered[listId] = issues[listId].filter((issue: any) =>
        issue.summary.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredIssues(filtered);
  };

  if (!lists || !members || !issues) {
    return (
      <div className="site-layout-content">
        <div className="grid h-[40vh] w-full place-items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  const daysRemaining = sprint ? dayjs(sprint.endDate).diff(dayjs(), "day") : 0;

  return (
    <div className="site-layout-content">
      {sprint && (
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-c-text">
              {sprint.name}
            </h1>
            <p className="my-2 text-gray-600 text-sm text-c-text">
              {sprint.goal}
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-gray-600 text-c-text">
              <ClockCircleOutlined /> {daysRemaining} days remaining
            </p>
            <Divider type="vertical" />
            <Tooltip title="Only the admin can complete the sprint">
              <Button
                type="primary"
                size="large"
                shape="round"
                onClick={() => setIsCompleteModalVisible(true)}
                disabled={!isAdmin}
              >
                Complete Sprint
              </Button>
            </Tooltip>
          </div>
        </div>
      )}
      <h2 className="mb-4 text-xl text-c-text">Kanban Board</h2>
      <Filter members={members} onSearch={handleSearch} />
      <Board
        lists={lists}
        sprintId={sprint?.id}
        issues={
          Object.keys(filteredIssues).length > 0 ? filteredIssues : issues
        }
      />
      <CompleteSprintModel
        visible={isCompleteModalVisible}
        onComplete={handleComplete}
        onCancel={() => setIsCompleteModalVisible(false)}
        sprint={sprint}
        projectId={projectId}
        sprintLength={Object.keys(issues).length}
      />
    </div>
  );
};

export default ProjectDetailPage;
