import { api } from "@api/axiosInstance";
import type { PostBettingRequest } from "../types/betting";

// GET: 현재 배팅 중인 정보 가져오기
export const getActiveBettingGames = async () => {
  const res = await api.get(`/api/bet`);
  return res.data;
};

// POST: 배팅하기
export const postBetting = async (betData: PostBettingRequest) => {
  const res = await api.post(`/api/bet`, betData);
  return res.data;
};

// GET: 이전 나의 배팅 기록들
export const getMyBettingHistory = async () => {
  const res = await api.get(`api/bet/history`);
  return res.data;
};

// GET: 나의 배팅 전적
export const getMyBettingStats = async () => {
  const res = await api.get(`api/bet/record`);
  return res.data;
};

// GET: 확인하지 않은 정산 결과 있으면 로그인 후 PUT 호출
export const getMyUnreadBetting = async () => {
  const res = await api.get(`api/bet/unread`);
  return res.data;
};

// PUT: 확인하지 않은 배팅 정산 결과를 확인 처리
export const putMyUnreadBetting = async (Ids: number[]) => {
  const res = await api.put(`api/bet/unread/check`, { Ids });
  return res.data;
};
