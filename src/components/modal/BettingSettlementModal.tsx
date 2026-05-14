import Button from "@/components/common/Button";
import { formatGameDateTime } from "@/utils/formatDate";
import type { BettingHistoryItem } from "@/features/betting/types/betting";

interface Props {
  bettings: BettingHistoryItem[];
  onClose: () => void;
}

const RESULT_CONFIG = {
  W: {
    label: "승리",
    emoji: "🏆",
    textColor: "text-primary",
    badgeBg: "bg-light border-primary",
    cardBg: "bg-light/50 border-primary/30",
  },
  D: {
    label: "무승부",
    emoji: "🤝",
    textColor: "text-gray-600",
    badgeBg: "bg-gray-100 border-gray-300",
    cardBg: "bg-gray-50 border-gray-200",
  },
  L: {
    label: "패배",
    emoji: "😢",
    textColor: "text-blue-600",
    badgeBg: "bg-blue-50 border-blue-300",
    cardBg: "bg-blue-50/50 border-blue-200",
  },
};

export const BettingSettlementModal = ({ bettings, onClose }: Props) => {
  const totalPayout = bettings.reduce((sum, b) => sum + b.payoutPoint, 0);
  const wonCount = bettings.filter((b) => b.payoutPoint > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-4xl w-full max-w-100 flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 w-full flex flex-col items-center">
          {/* 헤더 */}
          <div className="flex flex-col items-center gap-1 mb-6">
            <p className="text-h3 font-bold text-textDark">배팅 정산 결과</p>
            <p className="text-body-sm text-disabledGray">
              {bettings.length}건 중{" "}
              <span className="text-primary font-semibold">{wonCount}건</span>{" "}
              성공했어요
            </p>
          </div>

          {/* 배팅 결과 리스트 */}
          <div className="w-full flex flex-col gap-2.5 mb-5 max-h-64 overflow-y-auto">
            {bettings.map((bet, idx) => {
              const config = RESULT_CONFIG[bet.gameResult];
              const { formattedDate } = formatGameDateTime(bet.gameDate);
              const isPositive = bet.payoutPoint > 0;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border px-4 py-3.5 flex items-center justify-between ${config.cardBg}`}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-textSub font-medium">
                      {formattedDate}
                    </span>
                    <span className="font-bold text-sm text-textDark">
                      vs {bet.opponent}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${config.badgeBg} ${config.textColor}`}>
                      {config.emoji} {config.label}
                    </span>
                    <span
                      className={`text-sm font-black ${isPositive ? "text-primary" : "text-textSub"}`}>
                      {isPositive ? "+" : ""}
                      {bet.payoutPoint.toLocaleString()} P
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 총 정산 요약 */}
          <div className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-400">
                총 정산 포인트
              </span>
              <span
                className={`text-lg font-black ${
                  totalPayout > 0
                    ? "text-primary"
                    : totalPayout < 0
                      ? "text-blue-600"
                      : "text-textSub"
                }`}>
                {totalPayout > 0 ? "+" : ""}
                {totalPayout.toLocaleString()} P
              </span>
            </div>
          </div>

          <Button
            onClick={onClose}
            width="full"
            className="bg-gray-900! text-white! rounded-xl! transition-all duration-200 hover:bg-black! active:scale-[0.98]!">
            확인했어요
          </Button>
        </div>
      </div>
    </div>
  );
};
