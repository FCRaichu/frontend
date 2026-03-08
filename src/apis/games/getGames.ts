import { api } from "../axiosInstance";

// 경기 일정 전체 조회
export const getGames = async () => {
  const res = await api.get(`/api/games`);
  return res;
};
