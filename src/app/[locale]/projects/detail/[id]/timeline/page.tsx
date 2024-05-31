"use client";
import React from "react";
import TimelineChart from "./TimelineChart";
import dayjs from "dayjs";
import useSWR from "swr";
import { Sprint } from "@/lib/types";
import { fetchSprints } from "@/app/api/sprintApi";
import { usePathname } from "next/navigation";
import { Spin } from "antd";
import { useTranslations } from "next-intl";

const TimelinePage: React.FC = () => {
  const pathname = usePathname();
  const projectId = Number(pathname.split("/")[4]);
  const t = useTranslations("TimelineChart");
  const { data: sprints } = useSWR<Sprint[]>(`sprints-${projectId}`, () =>
    fetchSprints(projectId)
  );

  const data = sprints
    ?.filter((sprint) => sprint.name && sprint.startDate && sprint.endDate)
    .map((sprint) => ({
      x: sprint.name,
      y: [dayjs(sprint.startDate).valueOf(), dayjs(sprint.endDate).valueOf()],
      goal: sprint.goal ?? "",
    }));
  if (!sprints)
    return (
      <div className="site-layout-content">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          {t("timeline")}
        </h1>
        <Spin />
      </div>
    );
  return (
    <div className="site-layout-content">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        {t("timeline")}
      </h1>
      <TimelineChart data={data} />
    </div>
  );
};

export default TimelinePage;
