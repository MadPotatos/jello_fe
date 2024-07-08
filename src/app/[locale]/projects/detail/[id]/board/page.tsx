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
import { fetchIssuesInList } from "@/app/api/issuesApi";
import { fetchCurrentSprint } from "@/app/api/sprintApi";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { IssuePriority, IssueType } from "@/lib/enum";

const CompleteSprintModel = dynamic(
  () => import("@/components/modal/CompleteSprintModal"),
  {
    ssr: false,
  }
);
const Tooltip = dynamic(() => import("antd").then((mod) => mod.Tooltip), {
  ssr: false,
});

const ProjectDetailPage = () => {
  const pathname = usePathname();
  const projectId = Number(pathname.split("/")[4]);
  const { data: session } = useSession();
  const [filteredIssues, setFilteredIssues] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [filterUseId, setFilterUserId] = useState<number>();
  const [filterTypes, setFilterTypes] = useState<IssueType[]>([]);
  const [filterPriorities, setFilterPriorities] = useState<IssuePriority[]>([]);
  const t = useTranslations();

  const { data: members } = useSWR<Member[]>(`members-${projectId}`, () =>
    fetchMembers(projectId)
  );
  const { data: lists } = useSWR<List[]>(`lists-${projectId}`, () =>
    fetchLists(projectId)
  );
  const { data: issues } = useSWR(`issues-${projectId}`, () =>
    fetchIssuesInList(projectId)
  );

  const { data: sprint } = useSWR<Sprint>(`current-sprint-${projectId}`, () =>
    fetchCurrentSprint(projectId)
  );

  const isAdmin = members?.some(
    (member) => member.userId === session?.user?.id && member.isAdmin
  );

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

  const handleComplete = () => {
    setIsCompleteModalVisible(false);
    mutate(`sprints-${projectId}`);
    mutate(`sprint-issues-${projectId}`);
    mutate(`current-sprint-${projectId}`, undefined, false);
    mutate(`issues-${projectId}`);
  };

  const filterIssues = (
    query: string,
    userId?: number,
    types: IssueType[] = [],
    priorities: IssuePriority[] = []
  ) => {
    if (!issues) return;

    const filtered = {} as any;
    Object.keys(issues).forEach((listId: string) => {
      filtered[listId] = issues[listId].filter((issue: any) => {
        const matchesSearchQuery = issue.summary
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesUserId = userId
          ? issue.assignees.some((assignee: any) => assignee.userId === userId)
          : true;
        const matchesType =
          types.length > 0 ? types.includes(issue.type) : true;
        const matchesPriority =
          priorities.length > 0 ? priorities.includes(issue.priority) : true;
        return (
          matchesSearchQuery && matchesUserId && matchesType && matchesPriority
        );
      });
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
              <ClockCircleOutlined /> {daysRemaining} {t("Board.daysRemaining")}
            </p>
            <Divider type="vertical" />
            <Tooltip title={t("Board.toolTip")}>
              <Button
                type="primary"
                size="large"
                shape="round"
                onClick={() => setIsCompleteModalVisible(true)}
                disabled={!isAdmin}
              >
                {t("Board.completeSprint")}
              </Button>
            </Tooltip>
          </div>
        </div>
      )}
      <h2 className="mb-4 text-xl text-c-text">{t("Board.kanbanBoard")}</h2>
      <Filter
        members={members}
        onSearch={handleSearch}
        onUserClick={handleUserClick}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
      />
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
