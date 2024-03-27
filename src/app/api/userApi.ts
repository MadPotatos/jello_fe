import { Backend_URL } from "@/lib/Constants";
import { fetcher } from "@/lib/utils";

export async function getUser(id: number) {
  const url = `${Backend_URL}/user/profile/${id}`;
  return await fetcher(url);
}
