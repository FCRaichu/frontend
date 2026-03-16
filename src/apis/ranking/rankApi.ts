import axios from "axios";

const currentYear = new Date().getFullYear();

// 직관왕
export const getAttendanceRanking = async () => {
  const res = await axios.get(
    `/api/rankings/attendance?year=${currentYear.toString()}`,
  );
  return res.data;
};
// 직관왕
export const getWinRateRanking = async () => {
  const res = await axios.get(
    `/api/rankings/win-rate?year=${currentYear.toString()}`,
  );
  return res.data;
};
