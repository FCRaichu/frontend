import ActiveBettingForm from "@/features/betting/components/ActiveBettingForm";
import ActiveBettingHeader from "@/features/betting/components/ActiveBettingHeader";
import MyBettingHistory from "@/features/betting/components/MyBettingHistory";
import MyBettingStats from "@/features/betting/components/MyBettingStats";

export default function Betting() {
  const activeBettingData = {
    userId: "7070b486-a9dd-4aee-9fe9-eddb7713c8e9", // 유저 db 테이블 pk
    betId: 5, // 베팅 db 테이블 pk
    gameId: 1, // 게임 db 테이블 pk
    gameDate: "2026-02-10T19:00:00",
    opponent: "전북",

    totalBettors: 10, // 총 베팅한 사람 수
    totalPoint: 6000, // 베팅 걸린 전체(모든 유저의) 포인트
    winPoint: 3000,
    drawPoint: 2000,
    losePoint: 1000,

    myWinPoint: 2000, // 내가 win에 건 포인트
    myDrawPoint: 1000,
    myLosePoint: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-10 font-sans text-gray-800">
      <ActiveBettingHeader
        gameDate={activeBettingData.gameDate}
        opponent={activeBettingData.opponent}
      />
      <div className="w-full max-w-5xl flex flex-col gap-6 mt-6">
        <ActiveBettingForm activeBettingData={activeBettingData} />
        <MyBettingStats />
        <MyBettingHistory />
      </div>
    </div>
  );
}
