import { api } from "@api/axiosInstance";

// GET: 배팅 가능한 경기 정보 불러오기
export const getActiveBettingGames = async () => {
  const res = await api.get(`/api/bet`);
  console.log(res.data);
  return res.data;
};

// donation
export const postDonation = async (playerId: number, points: number) => {
  const res = await api.post(`/api/donation/${playerId}?point=${points}`);
  return res.data;
};
