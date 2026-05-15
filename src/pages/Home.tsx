import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { useAuthStore } from "@/stores/useAuthStore";
import { GameCalendar } from "@/features/game/components/GameCalendar";
import { Ranking } from "@/features/ranking/components/Ranking";
import { MyRecords } from "@/features/post/components/list/MyPosts";
import IntroAnimation from "@/features/landing/components/IntroAnimation";
import { AttendanceCheckModal } from "@/components/modal/AttendanceCheckModal";
import { BettingSettlementModal } from "@/components/modal/BettingSettlementModal";
import { putMyUnreadBetting } from "@/features/betting/api/betting";
import type { BettingHistoryItem } from "@/features/betting/types/betting";

export default function Home() {
  const { user, updateUser } = useAuthStore();
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false);
  const [unreadBettings, setUnreadBettings] = useState<BettingHistoryItem[]>([]);

  // 세션 storage에 'visited' 기록이 있으면 바로 false, 없으면 true
  const [isLanding, setIsLanding] = useState(
    !sessionStorage.getItem("visited"),
  );
  const [isExiting, setIsExiting] = useState(false); // 위로 올라가는 애니메이션

  useEffect(() => {
    // 만약 방문했으면 실행하지마.
    if (sessionStorage.getItem("visited")) {
      setIsLanding(false);
      return;
    }

    // 5초 동안 인트로를 보여준 뒤, 애니메이션 시작
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsLanding(false);
        sessionStorage.setItem("visited", "true"); // 방문 기록 저장
      }, 800);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLanding === false && user) {
      // sessionStorage에서 미확인 배팅 정산 결과 불러오기
      const stored = sessionStorage.getItem("unreadBettings");
      const bettings: BettingHistoryItem[] = stored ? JSON.parse(stored) : [];
      if (bettings.length > 0) setUnreadBettings(bettings);

      // checkPoint > 0 이면 오늘 첫 출석 → 출석 모달 먼저
      if (user.checkPoint > 0) {
        setIsAttendanceModalOpen(true);
      } else if (bettings.length > 0) {
        // 출석 모달 없으면 배팅 정산 모달 바로 표시
        setIsBettingModalOpen(true);
      }
    }
  }, [user, isLanding]);

  const closeAttendanceModal = () => {
    setIsAttendanceModalOpen(false);
    updateUser({ checkPoint: 0 });
    // 출석 모달 닫힌 후 미확인 배팅 있으면 배팅 정산 모달 표시
    if (unreadBettings.length > 0) {
      setIsBettingModalOpen(true);
    }
  };

  const closeBettingModal = async () => {
    setIsBettingModalOpen(false);
    const ids = unreadBettings
      .map((b) => b.betHistoryId)
      .filter((id) => id != null);
    if (ids.length > 0) {
      try {
        await putMyUnreadBetting(ids);
      } catch (e) {
        console.error("배팅 정산 확인 처리 실패", e);
      }
    }
    sessionStorage.removeItem("unreadBettings");
    setUnreadBettings([]);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* 랜딩 레이어 */}
      {isLanding && (
        <div
          className={`fixed inset-0 z-999 bg-white landing-layer ${isExiting ? `${styles.landingExit}` : ""}`}>
          <IntroAnimation />
        </div>
      )}

      {/* 메인 콘텐츠 */}
      {/* 인트로가 아예 필요 없는 방문자라면 바로 보여주고, 인트로 중이면 opacity-0 유지 */}
      <main
        className={`mb-60 ${!isLanding ? `${styles.contentFadeIn}` : "opacity-0"}`}>
        {/* 캘린더 */}
        <GameCalendar />
        {/* 직관 기록 */}
        <MyRecords />
        {/* 직관왕 / 승률왕 */}
        <Ranking />

        {isAttendanceModalOpen && (
          <AttendanceCheckModal
            point={user?.checkPoint || 0}
            streak={user?.attendanceStreak || 0}
            onClose={closeAttendanceModal}
          />
        )}

        {isBettingModalOpen && unreadBettings.length > 0 && (
          <BettingSettlementModal
            bettings={unreadBettings}
            onClose={closeBettingModal}
          />
        )}
      </main>
    </div>
  );
}
