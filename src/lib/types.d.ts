export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Project = {
  id: string;
  name: string;
  image?: string;
  repo?: string;
  description?: string;
  leaderName?: string;
  leaderAvatar?: string;
};
