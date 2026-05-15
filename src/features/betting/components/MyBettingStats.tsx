import type { myBettingStats } from "../types/betting";

interface MyBettingStatsProps {
  myBettingStats: myBettingStats;
}

export default function MyBettingStats({
  myBettingStats,
}: MyBettingStatsProps) {
  return (
    <>
      {/* 1. 상단 탑바 (배팅 요약 정보) */}
      <div className="bg-white rounded-xl shadow-sm border border-[#DEE2E6] p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0">
        <h2 className="font-bold text-lg shrink-0">내 배팅 요약</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
          <span className="text-[#6C757D]">
            배팅 참여 횟수:{" "}
            <span className="text-black">{myBettingStats.totalNumber}회</span>
          </span>
          <span className="text-[#6C757D]">
            총 이득:{" "}
            <span className="text-[#D91920]">
              + {myBettingStats.gain.toLocaleString()} P
            </span>
          </span>
          <span className="text-[#6C757D]">
            총 손해:{" "}
            <span className="text-blue-600">
              - {myBettingStats.loss.toLocaleString()} P
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
