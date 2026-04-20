import { useState } from "react";
import BettingOption from "./BettingOption";
import type { ActiveBettingData } from "../types/betting";
import { getWDLRate } from "@/utils/calcWDLRate";
import Button from "@/components/common/Button";
import { useAuthStore } from "@/stores/useAuthStore";
import BettingAmountButton from "./BettingAmountButton";

interface ActiveBettingFormProps {
  activeBettingData: ActiveBettingData;
}

export default function ActiveBettingForm({
  activeBettingData,
}: ActiveBettingFormProps) {
  const userPoint = useAuthStore((state) => state.user?.points);
  const [selectedOutcome, setSelectedOutcome] = useState<
    "win" | "draw" | "lose"
  >("win");
  const [betAmount, setBetAmount] = useState<string>("0");

  // --- 유틸 로직 ---
  const formatNumber = (val: number) => val.toLocaleString();
  const parseNumber = (val: string) => parseInt(val.replace(/,/g, "")) || 0;

  // --- 핸들러 영역 ---
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

  // --- 비율 계산 ---
  const { winPoint, drawPoint, losePoint } = activeBettingData;
  const winRate = `${getWDLRate(winPoint, winPoint + drawPoint + losePoint)}%`;
  const drawRate = `${getWDLRate(drawPoint, winPoint + drawPoint + losePoint)}%`;
  const loseRate = `${100 - parseInt(winRate) - parseInt(drawRate)}%`;

  // --- 배팅하기 버튼 ---
  const handleBetting = () => {
    // TODO: API 연동
    // TODO: 포인트별로 분기 처리
    alert(`${selectedOutcome}에 ${betAmount}P 배팅 시도`);
  };

  return (
    <div className="flex gap-6 w-full max-w-full mx-auto items-start">
      {/* 왼쪽: 배팅 현황 */}
      <div className="flex-2 bg-white rounded-2xl shadow-sm border border-border p-8 flex flex-col gap-6 self-start">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-xl text-textDark">
            현재 진행 중인 배팅
          </h3>
          <div className="text-right">
            <span className="text-sm text-textSub">
              참여자 {activeBettingData.totalBettors.toLocaleString()}명 • 누적
              포인트
            </span>
            <p className="text-3xl font-black text-primary mt-1">
              {(winPoint + drawPoint + losePoint).toLocaleString()} P
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

        <div className="w-full pt-2">
          <div className="flex justify-between text-sm font-bold mb-3 px-1">
            <span className="text-primary">승 {winRate}</span>
            <span className="text-textSub text-center">무 {drawRate}</span>
            <span className="text-blue-600 text-right">패 {loseRate}</span>
          </div>
          <div className="w-full h-4 rounded-full flex overflow-hidden bg-gray-100 shadow-inner">
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
      </div>

      {/* 오른쪽: 배팅하기 컨트롤 폼 */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-border p-8 flex flex-col gap-6 h-fit">
        <h3 className="font-bold text-xl">배팅하기</h3>

        <div className="relative">
          <input
            type="text"
            value={betAmount}
            onChange={handleInputChange}
            className="w-full pl-4 pr-10 py-4 border border-border rounded-xl font-bold text-right text-lg focus:outline-none focus:border-primary focus:ring-1 hover:ring-disabled"
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
          className="py-5 text-lg! font-black! h-14!"
          onClick={handleBetting}>
          배팅하기
        </Button>
      </div>
    </div>
  );
}
