"use client";
import { fetchPullRequests, fetchRepoDetail } from "@/app/api/repoApi";
import { PullRequest, Repo } from "@/lib/types";
import { GithubOutlined, StarOutlined, ForkOutlined ,SearchOutlined} from "@ant-design/icons"; 
import { Button, Card, Empty, Space, Spin, Table } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import useSWR from "swr";

const PullRequestsManagementPage = () => {
  const pathname = usePathname();
  const projectId = Number(pathname.split("/")[3]);

  const { data: repo } = useSWR<Repo>(`repo-${projectId}`, () => fetchRepoDetail(projectId));
  const { data: pullRequests, error: pullRequestsError  } = useSWR<PullRequest[]>(`pull-requests-${projectId}`, () => fetchPullRequests(projectId));

  const columns :any[] = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(), 
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width : '30%'
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      render :(state: string) => (
        <span className={`text-xs font-semibold text-white px-2 py-1 rounded-full bg-green-500`}>
          {state}
        </span>
      )
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Head',
      dataIndex: 'head',
      key: 'head',
    },
    {
      title: 'Base',
      dataIndex: 'base',
      key: 'base',
    },
    {
      title: 'Detail',
      key: 'url',
      render: (record: any) => (
        <Space size="middle">
          <Button type="primary" style={{ backgroundColor: '#1890ff', fontSize: '16px' }} >
            <Link href={record.url} target="_blank">
              <SearchOutlined />
            </Link>
          </Button>
        </Space>
      ),
    },

  ];

     return (
    <div className="site-layout-content">
      <h1 className="mb-4 text-xl font-semibold text-c-text">Repository</h1>
      {repo && "message" in repo ? (
        <Empty description="Failed to load repository details. Please check your repo URL in setting" />
      ) : repo ? (
        <Card
          title={
            <Link href={repo.url} target="_blank" className="text-xl cursor-pointer hover:text-blue-600">
              {repo?.owner}/{repo?.name} <GithubOutlined className="ml-2" />
            </Link>
          }
          bordered={false}
          className="mb-4 repo-card bg-gray-100 shadow-md rounded-lg"
        >
          <div className="px-4 ">
            {repo?.description && (
              <p className="text-gray-600">{repo?.description}</p>
            )}
            <div className="flex mt-4 items-center">
              {repo?.language && (
                <span className="mr-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white bg-blue-600">
                  {repo?.language}
                </span>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button type="primary" ghost icon={<StarOutlined />} >
                Star
                <span className="items-center ml-2 px-2 py-1 rounded-full text-xs font-medium text-gray-500 bg-gray-200">
                  {repo?.stars || 0}
                </span>
              </Button>
              <Button type="primary" ghost icon={<ForkOutlined />} >
                Fork
                <span className="items-center ml-2 px-2 py-1 rounded-full text-xs font-medium text-gray-500 bg-gray-200">
                  {repo?.forks || 0}
                </span>
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Spin />
      )}

      <h1 className="mb-4 text-xl font-semibold text-c-text">Pull requests</h1>
      <Table
         columns={columns}
          dataSource={pullRequests && Array.isArray(pullRequests) ? pullRequests : []}
          loading={!pullRequests && !pullRequestsError}
          rowKey="id"
      />
    </div>
  );
};

export default PullRequestsManagementPage;