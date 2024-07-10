import { SprintStatus } from "./enum";

export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  job?: string;
  organization?: string;
};

export type Project = {
  id: number;
  name: string;
  image?: string;
  repo?: string;
  description?: string;
  isDeleted?: boolean;
  leader?: Leader;
};

export type ProjectDetail = {
  id: number;
  name: string;
  image?: string;
  repo?: string;
  description?: string;
  isDeleted?: boolean;
  productGoal?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Leader = {
  userId: number;
  projectId: number;
  name: string;
  avatar: string;
  email: string;
  isAdmin: boolean;
};

export type Member = {
  id: number;
  isAdmin: boolean;
  projectId: number;
  name: string;
  avatar: string;
  email: string;
  userId: number;
};

export type List = {
  id: number;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  projectId: number;
};

export type Issue = {
  id: number;
  order: number;
  priority: number;
  type: number;
  summary: string;
  descr?: string;
  createdAt: Date;
  updatedAt: Date;
  list?: List;
  listId: number;
  user?: User;
  reporterId: number;
  comments?: Comment[];
  assignees?: Assignee[];
};

export type Assignee = {
  id: number;
  createdAt: Date;
  user?: User;
  userId: number;
  issue?: Issue;
  issueId: number;
  project?: Project;
  projectId: number;
};

export type IssueComment = {
  id: number;
  descr: string;
  createdAt: Date;
  userId: number;
  name: string;
  avatar: string;
};

export type Repo = {
  name: string;
  url: string;
  description: string;
  owner: string;
  language: string;
  stars: number;
  forks: number;
};

export type PullRequest = {
  title: string;
  url: string;
  user: string;
  state: string;
  createdAt: string;
  head: string;
  base: string;
};

export type Sprint = {
  id: number;
  name: string;
  goal?: string;
  order: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  status: SprintStatus;
  userStories?: any;
  totalUserStoryPoints?: number;
};
