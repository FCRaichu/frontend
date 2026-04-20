import {
  getActiveBettingGames,
  getMyBettingStats,
} from "@/features/betting/api/betting";
import ActiveBettingForm from "@/features/betting/components/ActiveBettingForm";
import ActiveBettingHeader from "@/features/betting/components/ActiveBettingHeader";
import MyBettingHistory from "@/features/betting/components/MyBettingHistory";
import MyBettingStats from "@/features/betting/components/MyBettingStats";
import type {
  ActiveBettingData,
  myBettingStats,
} from "@/features/betting/types/betting";
import { useEffect, useState } from "react";

export default function Betting() {
  const [activeBettingData, setActiveBettingData] =
    useState<ActiveBettingData>();

  const [myBettingStats, setMyBettingStats] = useState<myBettingStats>({
    userId: "",
    totalNumber: 0,
    gain: 0,
    loss: 0,
  });

  const fetchActiveBetting = async () => {
    try {
      const res = await getActiveBettingGames();
      const stats = await getMyBettingStats();
      setActiveBettingData(res);
      setMyBettingStats(stats);
    } catch (e) {
      console.error("배팅 정보 불러오기 실패", e);
    }
  };

  useEffect(() => {
    fetchActiveBetting();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-10 font-sans text-gray-800">
      {activeBettingData ? (
        <>
          <ActiveBettingHeader
            gameDate={activeBettingData.gameDate}
            opponent={activeBettingData.opponent}
          />
          <div className="w-full max-w-5xl flex flex-col gap-6 mt-6">
            <ActiveBettingForm
              activeBettingData={activeBettingData}
              onBetSuccess={fetchActiveBetting}
            />
            <MyBettingStats myBettingStats={myBettingStats} />
            <MyBettingHistory />
          </div>
        </>
      ) : (
        <p className="text-body-lg text-gray-500 mt-20">
          배팅 정보가 없습니다.
        </p>
      )}
    </div>
  );
}
