import { useState } from "react";
import BettingOption from "./BettingOption";
import type { ActiveBettingData } from "../types/betting";
import { getWDLRate } from "@/utils/calcWDLRate";
import Button from "@/components/common/Button";
import { useAuthStore } from "@/stores/useAuthStore";
import BettingAmountButton from "./BettingAmountButton";
import { postBetting } from "../api/betting";

interface ActiveBettingFormProps {
  activeBettingData: ActiveBettingData;
  onBetSuccess: () => void;
}

export default function ActiveBettingForm({
  activeBettingData,
  onBetSuccess,
}: ActiveBettingFormProps) {
  const userPoint = useAuthStore((state) => state.user?.points) || 0;
  const [selectedOutcome, setSelectedOutcome] = useState<
    "win" | "draw" | "lose"
  >("win");
  const [betAmount, setBetAmount] = useState<string>("0");
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 클릭 방지

  // 포맷팅 유틸
  const formatNumber = (val: number) => val.toLocaleString();
  const parseNumber = (val: string) => parseInt(val.replace(/,/g, "")) || 0;

  const handleAddAmount = (amount: number) => {
    const current = parseNumber(betAmount);
    setBetAmount(formatNumber(current + amount));
  };

  const handleMaxAmount = () => {
    setBetAmount(formatNumber(Number(userPoint)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNum = e.target.value.replace(/[^0-9]/g, "");
    setBetAmount(formatNumber(Number(onlyNum)));
  };

  // 전체 승무패 비율
  const {
    winPoint,
    drawPoint,
    losePoint,
    myWinPoint,
    myDrawPoint,
    myLosePoint,
  } = activeBettingData;

  const totalPoint = winPoint + drawPoint + losePoint;

  const winRate =
    totalPoint > 0 ? `${getWDLRate(winPoint, totalPoint)}%` : "0%";
  const drawRate =
    totalPoint > 0 ? `${getWDLRate(drawPoint, totalPoint)}%` : "0%";
  const loseRate =
    totalPoint > 0 ? `${100 - parseInt(winRate) - parseInt(drawRate)}%` : "0%";

  // 내 배팅 비율
  const myTotalPoint = myWinPoint + myDrawPoint + myLosePoint;

  const myWinRate =
    myTotalPoint > 0 ? `${getWDLRate(myWinPoint, myTotalPoint)}%` : "0%";
  const myDrawRate =
    myTotalPoint > 0 ? `${getWDLRate(myDrawPoint, myTotalPoint)}%` : "0%";
  const myLoseRate =
    myTotalPoint > 0
      ? `${100 - parseInt(myWinRate) - parseInt(myDrawRate)}%`
      : "0%";

  // 배팅 API 호출
  const handleBetting = async () => {
    const numericAmount = parseNumber(betAmount);

    // 유효성 체크
    if (numericAmount <= 0) {
      alert("배팅 금액을 입력해주세요.");
      return;
    }
    if (numericAmount > userPoint) {
      alert("보유 포인트가 부족합니다.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 선택한 결과에만 포인트 몰빵, 나머진 0
      const betData = {
        gameId: activeBettingData.gameId,
        winPoint: selectedOutcome === "win" ? numericAmount : 0,
        drawPoint: selectedOutcome === "draw" ? numericAmount : 0,
        losePoint: selectedOutcome === "lose" ? numericAmount : 0,
      };

      await postBetting(betData);

      alert("배팅이 성공적으로 완료되었습니다.");

      // 초기화 및 리패치
      setBetAmount("0");
      onBetSuccess();
    } catch (error) {
      console.error("배팅 실패:", error);
      alert("배팅에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full mx-auto items-start">
      {/* 좌측: 배팅 현황 */}
      <div className="flex-2 bg-white rounded-2xl shadow-sm border border-border p-4 sm:p-6 md:p-8 flex flex-col gap-5 md:gap-7 self-start w-full lg:w-auto">
        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-textDark mb-1">
              현재 진행 중인 배팅
            </h3>
            <span className="text-sm text-textSub">
              참여자 {activeBettingData.totalBettors?.toLocaleString() || 0}명
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-textSub font-medium">
              총 누적 포인트
            </span>
            <p className="text-2xl font-black text-primary mt-0.5">
              {totalPoint.toLocaleString()}{" "}
              <span className="text-base font-bold">P</span>
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <BettingOption
            type="win"
            label="승리"
            amount={winPoint}
            isSelected={selectedOutcome === "win"}
            onClick={() => setSelectedOutcome("win")}
          />
          <BettingOption
            type="draw"
            label="무승부"
            amount={drawPoint}
            isSelected={selectedOutcome === "draw"}
            onClick={() => setSelectedOutcome("draw")}
          />
          <BettingOption
            type="lose"
            label="패배"
            amount={losePoint}
            isSelected={selectedOutcome === "lose"}
            onClick={() => setSelectedOutcome("lose")}
          />
        </div>

        <div className="w-full flex flex-col gap-6 pt-2">
          {/* 1. 전체 배팅 게이지 */}
          <div>
            <div className="flex justify-between text-xs font-bold text-textSub mb-2 px-1">
              <span className="font-bold text-secondary">전체 배팅 </span>

              <div className="flex gap-3 font-bold">
                <span className={winPoint > 0 ? "text-primary" : ""}>
                  승 {winRate}
                </span>
                <span className={drawPoint > 0 ? "text-textSub" : ""}>
                  무 {drawRate}
                </span>
                <span className={losePoint > 0 ? "text-blue-600" : ""}>
                  패 {loseRate}
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 rounded-full flex overflow-hidden bg-gray-100">
              <div
                className="bg-primary transition-all duration-700 ease-out"
                style={{ width: winRate }}
              />
              <div
                className="bg-[#DEE2E6] transition-all duration-700 ease-out"
                style={{ width: drawRate }}
              />
              <div
                className="bg-blue-600 transition-all duration-700 ease-out"
                style={{ width: loseRate }}
              />
            </div>
          </div>

          {/* 2. 내 배팅 게이지 (배팅 내역 있을 때만 노출) */}
          {myTotalPoint > 0 && (
            <div>
              <div className="flex justify-between items-end text-xs mb-2 px-1">
                <span className="font-bold text-textDark">
                  나의 배팅{" "}
                  <span className="text-textSub font-medium ml-1">
                    ({myTotalPoint.toLocaleString()} P)
                  </span>
                </span>

                {/* 0원인 항목은 텍스트 숨김 */}
                <div className="flex gap-3 font-bold">
                  {myWinPoint > 0 && (
                    <span className="text-primary">승 {myWinRate}</span>
                  )}
                  {myDrawPoint > 0 && (
                    <span className="text-textSub">무 {myDrawRate}</span>
                  )}
                  {myLosePoint > 0 && (
                    <span className="text-blue-600">패 {myLoseRate}</span>
                  )}
                </div>
              </div>

              {/* 호버 툴팁 */}
              <div className="relative group w-full">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg z-10 transition-opacity">
                  {`승:${myWinPoint.toLocaleString()}P / 무:${myDrawPoint.toLocaleString()}P / 패:${myLosePoint.toLocaleString()}P`}
                </div>

                <div className="w-full h-2.5 rounded-full flex overflow-hidden bg-gray-100 cursor-pointer">
                  <div
                    className="bg-primary transition-all duration-700 ease-out opacity-80"
                    style={{ width: myWinRate }}
                  />
                  <div
                    className="bg-[#DEE2E6] transition-all duration-700 ease-out"
                    style={{ width: myDrawRate }}
                  />
                  <div
                    className="bg-blue-600 transition-all duration-700 ease-out opacity-80"
                    style={{ width: myLoseRate }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 우측: 배팅 컨트롤 폼 */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-border p-4 sm:p-6 md:p-8 flex flex-col gap-4 md:gap-6 h-fit w-full lg:w-auto">
        <h3 className="font-bold text-xl">배팅하기</h3>

        <div className="relative">
          <input
            type="text"
            value={betAmount}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full pl-4 pr-10 py-4 border border-border rounded-xl font-bold text-right text-lg focus:outline-none focus:border-primary focus:ring-1 hover:ring-disabled disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-textSub font-bold">
            P
          </span>
        </div>

        <div className="flex gap-2 mb-2">
          <BettingAmountButton
            label="+ 100"
            onClick={() => handleAddAmount(100)}
          />
          <BettingAmountButton
            label="+ 1,000"
            onClick={() => handleAddAmount(1000)}
          />
          <BettingAmountButton label="MAX" isMax onClick={handleMaxAmount} />
        </div>

        <div className="bg-light p-3 rounded-xl flex gap-3 items-start border border-primary/10">
          <span className="text-primary font-black text-base">!</span>
          <p className="text-xs text-primary leading-relaxed font-medium">
            배팅은 제한 없이 걸 수 있지만, <br />한 번 완료된 배팅은 절대 취소할
            수 없습니다.
          </p>
        </div>

        <Button
          width="full"
          className={`py-5 text-lg! font-black! h-14! ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          onClick={handleBetting}
          disabled={isSubmitting}>
          {isSubmitting ? "배팅 중..." : "배팅하기"}
        </Button>
      </div>
    </div>
  );
}
