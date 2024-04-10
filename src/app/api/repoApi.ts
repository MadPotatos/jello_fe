import { Backend_URL } from "@/lib/Constants";
import { PullRequest, Repo } from "@/lib/types";

export const fetchRepoDetail = async (projectId: number): Promise<Repo> => {
  try {
    const response = await fetch(`${Backend_URL}/repo/detail/${projectId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching repo detail:", error);
    throw error;
  }
};

export const fetchPullRequests = async (
  projectId: number
): Promise<PullRequest[]> => {
  try {
    const response = await fetch(
      `${Backend_URL}/repo/pull-requests/${projectId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pull requests:", error);
    throw error;
  }
};
