import Typography from "@/components/common/Typography";
import Button from "@/components/common/Button";

interface AttendanceModalProps {
  point: number;
  streak: number;
  onClose: () => void;
}

export const AttendanceCheckModal = ({
  point,
  streak,
  onClose,
}: AttendanceModalProps) => {
  // 요일에 상관없이, 현재 스트릭을 기준으로 7일 주기 중 며칠째인지 계산
  const currentCycleDays = streak === 0 ? 0 : streak % 7 === 0 ? 7 : streak % 7;

  // 프로그래스바 너비 퍼센트 계산
  const progressPercentage = (currentCycleDays / 7) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-4xl w-full max-w-100 flex flex-col items-center overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 w-full flex flex-col items-center">
          {/* 상단 스트릭 아이콘 */}
          <div className="relative mb-6">
            <span className="text-[80px] leading-none">🔥</span>
          </div>

          {/* 스트릭 숫자 */}
          <div className="flex flex-col items-center gap-1 mb-8">
            <Typography variant="display" color="text-primary">
              {streak}
            </Typography>
            <Typography
              variant="body-lg"
              color="text-disabledGray"
              className="font-medium!">
              일 연속 출석
            </Typography>
          </div>

          {/* 진행 상태 UI */}
          <div className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-8">
            <div className="flex justify-between items-center mb-2 text-sm font-semibold">
              <span className="text-slate-400">연속 출석 달성도</span>
              <span className="text-primary">{currentCycleDays} / 7일</span>
            </div>

            {/* 얇은 프로그래스바 */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-700 ease-out rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Button 컴포넌트 (호버 및 액티브 효과 추가) */}
          <Button
            onClick={onClose}
            width="full"
            className="bg-gray-900! text-white! rounded-xl! transition-all duration-200 hover:bg-black! active:scale-[0.98]!">
            + {point} 포인트 받기
          </Button>
        </div>
      </div>
    </div>
  );
};
