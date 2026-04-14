export default function MyBettingStats() {
  return (
    <>
      {/* 1. 상단 탑바 (배팅 요약 정보) */}
      <div className="bg-white rounded-xl shadow-sm border border-[#DEE2E6] p-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">내 배팅 요약</h2>
        <div className="flex gap-6 text-sm font-medium">
          <span className="text-[#6C757D]">
            배팅 참여 횟수: <span className="text-black">15회</span>
          </span>
          <span className="text-[#6C757D]">
            총 이득: <span className="text-[#D91920]">+ 45,000 P</span>
          </span>
          <span className="text-[#6C757D]">
            총 손해: <span className="text-blue-600">- 10,000 P</span>
          </span>
        </div>
      </div>
    </>
  );
}
