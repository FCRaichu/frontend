import type { PostRequest } from "@/types/post";
import { api } from "../axiosInstance";

// 직관 기록 전체 조회
export const getMyAllRecords = async () => {
  const res = await api.get(`/api/posts`);
  return res;
};

// 직관 기록 작성
export const postMyRecord = async (data: PostRequest) => {
  const res = await api.post(`/api/posts`, data);
  return res;
};
