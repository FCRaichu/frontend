export const formatDate = (
  dateValue: string | Date | undefined | null,
): string => {
  if (!dateValue) return "";

  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;

  // 유효하지 않은 날짜 체크
  if (isNaN(date.getTime())) return "유효하지 않은 날짜";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
