import { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";

import { getRecordById } from "@/features/post/api/postApi";
import type { Post } from "@/features/post/types/post";
import { StepTracker } from "@/features/post/components/write/StepTracker";
import DatePicker from "@/features/post/components/write/DatePicker";
import Typography from "@/components/common/Typography";

export default function PostWriteBaseLayout() {
  // ⭐️ 이전 페이지에서 gameId를 넘겨준 경우 state 받아와서 분기 처리
  const location = useLocation();
  const { postId } = useParams();
  const isEditMode = !!postId;

  const { gameId } = location.state || {};
  const [step, setStep] = useState<1 | 2>(1); // (1) 날짜 선택 / (2) 글 작성
  // DONE: 티켓, 시즌 관련 전부 삭제
  const [selectedGameId, setSelectedGameId] = useState<number>(
    Number(gameId) || 0,
  ); // 초기값으로 state에서 넘겨받은 gameId 설정

  // 수정 모드일 때 데이터 담을 상태
  const [initialData, setInitialData] = useState<Post | null>(null);

  // 데이터 로딩 될 때까지 기다리기
  const [isLoading, setIsLoading] = useState(isEditMode);

  // 전체 step의 개수, 스텝별 이름, 현재 스텝 step tracker 컴포넌트에 넘겨줄 건데
  // 그럼 부모에서 현재 스텝이 얼마인지 관리해줘야 함.
  // 1. useLocation 써서 받아오는 게 나을지
  // 2. context 써서 set 해주는 게 나을지
  // 1번 방식이 덜 복잡하고 컴포넌트 간 데이터 이동이 없어서 더 나을 듯? 공부해보자.
  useEffect(() => {
    if (location.pathname.endsWith("/post")) {
      setStep(1);
    } else {
      setStep(2);
    }
  }, [location.pathname]);

  // edit을 위해 원래 데이터를 불러와서 하위 컴포넌트에 전달해 줘야 한다. context로!!
  useEffect(() => {
    if (!isEditMode) {
      setIsLoading(false);
      return;
    }
    if (!isEditMode) return;

    const fetchOriginalPost = async () => {
      try {
        const res = await getRecordById(Number(postId));
        setInitialData(res);
        setSelectedGameId(res.gameId);
      } catch (e) {
        console.error("원본 포스트 로드 실패:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOriginalPost();
  }, [postId, isEditMode]);

  // DONE: gameId가 로딩중이거나 체크 중일 때 빈 화면 방지
  if (isLoading)
    return (
      <div className="pt-20 text-center">데이터를 불러오는 중입니다...</div>
    );

  return (
    <div
      className={`
      flex flex-col items-center w-full mx-auto pt-4 md:pt-12 px-4 md:px-6
    `}
    >
      <Typography variant="h1" className="mb-2 md:mb-8 text-lg sm:text-2xl md:text-3xl">
        {isEditMode ? "직관 기록 수정하기" : "직관 기록하기"}
      </Typography>

      {/* 단계를 보여주는 UI */}
      {/* step tracker에 현재 스텝과 스텝별 이름 전달 */}
      <StepTracker
        step={step}
        stepName={
          isEditMode ? ["경기 확인", "내용 수정"] : ["경기 선택", "직관 기록"]
        }
      />

      {/* DONE: 날짜 선택 컴포넌트 */}
      <DatePicker
        value={selectedGameId}
        onChange={setSelectedGameId}
        isEditMode={isEditMode}
        initialGameId={initialData?.gameId}
      />

      {/* context로 하위 단계 컴포넌트들에 데이터 전달 */}
      <Outlet
        context={{
          selectedGameId: selectedGameId,
          initialData,
          isEditMode,
        }}
      />
    </div>
  );
}
