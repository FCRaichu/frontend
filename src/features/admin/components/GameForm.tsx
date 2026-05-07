import { useEffect, useState } from "react";
import type { AdminGame, GameAdminRequest, GameResult } from "../types/admin";

interface Props {
  initialGame: AdminGame | null; // null이면 생성 모드
  isSubmitting: boolean;
  onSubmit: (request: GameAdminRequest) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

// "2025-10-17T19:30" 형식으로 변환 (datetime-local input용)
const toDatetimeLocal = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

export const GameForm = ({
  initialGame,
  isSubmitting,
  onSubmit,
  onCancel,
  onDelete,
}: Props) => {
  const [date, setDate] = useState("");
  const [stadium, setStadium] = useState("");
  const [round, setRound] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [result, setResult] = useState<GameResult | "">("");

  // initialGame이 바뀔 때마다 폼 리셋
  useEffect(() => {
    if (initialGame) {
      setDate(toDatetimeLocal(initialGame.date));
      setStadium(initialGame.stadium);
      setRound(String(initialGame.round));
      setHomeTeam(initialGame.homeTeam);
      setAwayTeam(initialGame.awayTeam);
      setHomeScore(
        initialGame.homeScore !== null ? String(initialGame.homeScore) : "",
      );
      setAwayScore(
        initialGame.awayScore !== null ? String(initialGame.awayScore) : "",
      );
      setResult(initialGame.result ?? "");
    } else {
      // 생성 모드: 빈 폼
      setDate("");
      setStadium("");
      setRound("");
      setHomeTeam("");
      setAwayTeam("");
      setHomeScore("");
      setAwayScore("");
      setResult("");
    }
  }, [initialGame]);

  const handleSubmit = () => {
    if (!date || !stadium || !round || !homeTeam || !awayTeam) {
      alert("일정, 경기장, 라운드, 홈팀, 원정팀은 필수입니다.");
      return;
    }

    const request: GameAdminRequest = {
      date: date,
      stadium,
      round: Number(round),
      homeTeam,
      awayTeam,
      homeScore: homeScore === "" ? null : Number(homeScore),
      awayScore: awayScore === "" ? null : Number(awayScore),
      result: result || null,
    };

    onSubmit(request);
  };

  const isEditMode = !!initialGame;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold">
        {isEditMode ? `경기 #${initialGame.id} 수정` : "새 경기 추가"}
      </h3>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">일정</span>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-2 py-1.5"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">경기장</span>
        <input
          type="text"
          value={stadium}
          onChange={(e) => setStadium(e.target.value)}
          placeholder="예: 서울월드컵경기장"
          className="border rounded px-2 py-1.5"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">라운드</span>
        <input
          type="number"
          min={1}
          value={round}
          onChange={(e) => setRound(e.target.value)}
          className="border rounded px-2 py-1.5"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-col gap-1 text-sm flex-1">
          <span className="font-medium">홈팀</span>
          <input
            type="text"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            className="border rounded px-2 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm flex-1">
          <span className="font-medium">원정팀</span>
          <input
            type="text"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            className="border rounded px-2 py-1.5"
          />
        </label>
      </div>

      <div className="flex gap-3">
        <label className="flex flex-col gap-1 text-sm flex-1">
          <span className="font-medium">홈 점수</span>
          <input
            type="number"
            min={0}
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            placeholder="미입력"
            className="border rounded px-2 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm flex-1">
          <span className="font-medium">원정 점수</span>
          <input
            type="number"
            min={0}
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            placeholder="미입력"
            className="border rounded px-2 py-1.5"
          />
        </label>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium">결과 (FC 서울 기준)</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setResult("")}
            className={`flex-1 py-1.5 border rounded text-sm ${
              result === ""
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-50"
            }`}>
            미정
          </button>
          {(["W", "D", "L"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setResult(r)}
              className={`flex-1 py-1.5 border rounded text-sm ${
                result === r
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-50"
              }`}>
              {r === "W" ? "승" : r === "D" ? "무" : "패"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-black text-white py-2 rounded disabled:opacity-50">
          {isSubmitting ? "처리 중..." : isEditMode ? "수정 저장" : "경기 생성"}
        </button>

        {isEditMode && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isSubmitting}
            className="px-4 bg-red-500 text-white py-2 rounded disabled:opacity-50">
            삭제
          </button>
        )}

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 border py-2 rounded disabled:opacity-50">
            취소
          </button>
        )}
      </div>
    </div>
  );
};
