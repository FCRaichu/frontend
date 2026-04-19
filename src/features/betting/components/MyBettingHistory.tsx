import { mockBettingHistoryData } from "@/mocks/data/betting";
import { getWDLRate } from "@/utils/calcWDLRate";
import { formatGameDateTime } from "@/utils/formatDate";
import { useState } from "react";

export default function MyBettingHistory() {
  const [isOpen, setIsOpen] = useState(false);

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
            className={`text-textSub transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>

      {/* 토글 내용 영역 */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-500 border-t border-border" : "max-h-0"
        }`}>
        <div className="p-4 sm:p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-sm">
              <thead className="bg-gray-50 border-y border-border text-textSub">
                <tr>
                  <th className="py-4 px-4 font-bold">경기일</th>
                  <th className="py-4 px-4 font-bold">상대팀</th>
                  <th className="py-4 px-4 font-bold">경기 결과</th>
                  <th className="py-4 px-4 font-bold">총 배팅 금액</th>
                  <th className="py-4 px-4 font-bold">나의 포인트 분배</th>
                  <th className="py-4 px-4 font-bold">결과</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-textDark">
                {mockBettingHistoryData.map((item, idx) => {
                  // -- 개별 아이템(item)의 승무패 비율 계산 --
                  const total = item.winPoint + item.drawPoint + item.losePoint;

                  // total이 0일 경우를 대비한 방어 로직
                  const winRate =
                    total > 0 ? getWDLRate(item.winPoint, total) : 0;
                  const drawRate =
                    total > 0 ? getWDLRate(item.drawPoint, total) : 0;
                  const loseRate = 100 - Number(winRate) - Number(drawRate);

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-4 font-medium">
                        {formatGameDateTime(item.gameDate).formattedDate}
                      </td>
                      <td className="py-5 px-4 font-bold text-base">
                        {item.opponent}
                      </td>
                      <td className="py-5 px-4 font-medium">
                        {item.gameResult}
                      </td>
                      <td className="py-5 px-4 font-black">
                        {item.totalPoint.toLocaleString()} P
                      </td>
                      <td className="py-5 px-4">
                        {/* 미니 게이지 바 */}
                        <div className="relative group flex flex-col items-center">
                          <div className="absolute -top-8 hidden group-hover:flex bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                            {`승:${item.winPoint.toLocaleString()}P / 무:${item.drawPoint.toLocaleString()}P / 패:${item.losePoint.toLocaleString()}P`}
                          </div>

                          {/* 게이지 바 비주얼 */}
                          <div className="w-32 mx-auto h-2 rounded-full flex overflow-hidden bg-gray-100 shadow-inner">
                            <div
                              className="bg-primary hover:brightness-90 transition-all"
                              style={{ width: `${winRate}%` }}></div>
                            <div
                              className="bg-border hover:brightness-90 transition-all"
                              style={{ width: `${drawRate}%` }}></div>
                            <div
                              className="bg-blue-600 hover:brightness-90 transition-all"
                              style={{ width: `${loseRate}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        {item.payoutPoint > 0 ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-block px-3 py-1 border border-primary text-primary bg-light rounded-full text-xs font-black">
                              성공
                            </span>
                            <span className="text-xs text-primary font-bold">
                              + {item.payoutPoint.toLocaleString()}P
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-block px-3 py-1 border border-textSub text-textSub rounded-full text-xs font-bold">
                              실패
                            </span>
                            <span className="text-xs text-textSub font-bold">
                              {item.payoutPoint.toLocaleString()}P
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
