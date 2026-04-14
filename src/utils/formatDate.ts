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

export const formatGameDateTime = (dateString: string) => {
  const date = new Date(dateString);

  // 1. "yyyy.mm.dd" 포맷
  const formattedDate = date
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ".")
    .replace(/\.$/, ""); // 끝에 붙는 마침표와 공백 처리

  // 2. "hh:mm AM" 포맷
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { formattedDate, formattedTime };
};
