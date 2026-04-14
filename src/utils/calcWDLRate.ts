export const getWDLRate = (point: number, totalPoint: number) => {
  if (totalPoint === 0) return "0%";
  const percentage = Math.round((point / totalPoint) * 100);
  return `${percentage}%`;
};
