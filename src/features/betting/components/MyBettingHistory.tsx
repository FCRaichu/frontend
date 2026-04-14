import { useState } from "react";

// 배팅 내역 데이터 타입 (필요시 types로 이동)
interface BettingHistoryItem {
  gameDate: string;
  opponent: string;
  betPoint: number;
  rates: { win: number; draw: number; lose: number };
  gameResult: "win" | "lose" | "draw";
  payout: number;
}

export default function MyBettingHistory() {
  const [isOpen, setIsOpen] = useState(false);

  // 임시 데이터 (실제로는 props로 받거나 query로 fetch)
  const historyData = [
    {
      gameDate: "2026.01.01",
      opponent: "전북 현대",
      betPoint: 300,
      rates: { win: 40, draw: 30, lose: 30 },
      gameResult: "win",
      payout: 600,
    },
    {
      gameDate: "2026.01.01",
      opponent: "울산 HD",
      betPoint: 500,
      rates: { win: 20, draw: 10, lose: 70 },
      gameResult: "lose",
      payout: 0,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* 토글 헤더 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
        <h3 className="font-bold text-xl text-textDark">나의 배팅 기록</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-textSub font-medium">
            {isOpen ? "접기" : "전체 보기"}
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-textSub transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>

      {/* 토글 내용 영역 */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[1000px] border-t border-border" : "max-h-0"
        }`}>
        <div className="p-4 sm:p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-sm">
              <thead className="bg-gray-50 border-y border-border text-textSub">
                <tr>
                  <th className="py-4 px-4 font-bold">경기일</th>
                  <th className="py-4 px-4 font-bold">상대팀</th>
                  <th className="py-4 px-4 font-bold">경기 결과</th>
                  <th className="py-4 px-4 font-bold">전체 배팅 금액</th>
                  <th className="py-4 px-4 font-bold">나의 포인트 분배</th>
                  <th className="py-4 px-4 font-bold">결과</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-textDark">
                {historyData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-4 font-medium">{item.gameDate}</td>
                    <td className="py-5 px-4 font-bold text-base">
                      {item.opponent}
                    </td>
                    <td className="py-5 px-4 font-medium">{item.gameResult}</td>
                    <td className="py-5 px-4 font-black">
                      {item.betPoint.toLocaleString()} P
                    </td>
                    <td className="py-5 px-4">
                      {/* 미니 게이지 바 */}
                      <div className="w-32 mx-auto h-2 rounded-full flex overflow-hidden bg-gray-100 shadow-inner">
                        <div
                          className="bg-primary"
                          style={{ width: `${item.rates.win}%` }}></div>
                        <div
                          className="bg-border"
                          style={{ width: `${item.rates.draw}%` }}></div>
                        <div
                          className="bg-blue-600"
                          style={{ width: `${item.rates.lose}%` }}></div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      {item.payout > 0 ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-block px-3 py-1 border border-primary text-primary bg-light rounded-full text-xs font-black">
                            예측 성공
                          </span>
                          <span className="text-xs text-primary font-bold">
                            +{item.payout} P
                          </span>
                        </div>
                      ) : (
                        <span className="inline-block px-3 py-1 border border-textSub text-textSub rounded-full text-xs font-bold">
                          예측 실패
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
