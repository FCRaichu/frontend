import { useState } from "react";
import type { GameResponse, GameAdminResultRequest } from "../types/admin";
import { getAllGames, settleBet, updateBetDB } from "../api/adminApi";

export const useAdminBetting = () => {
  const [games, setGames] = useState<GameResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 경기 목록 가져오기 (dropdown용)
  const fetchGames = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllGames();
      setGames(data);
    } catch (err) {
      setError("경기 목록을 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 경기 결과 입력 + 베팅 정산
  const handleSettle = async (
    gameId: number,
    request: GameAdminResultRequest,
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await settleBet(gameId, request);
      return true;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "정산 중 오류가 발생했습니다. (이미 정산된 경기일 수 있습니다)";
      setError(msg);
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // bet DB 초기화
  const handleUpdateBetDB = async (): Promise<string | null> => {
    try {
      setIsSubmitting(true);
      setError(null);
      const message = await updateBetDB();
      return message;
    } catch (err) {
      setError("bet DB 업데이트 중 오류가 발생했습니다.");
      console.error(err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    games,
    isLoading,
    isSubmitting,
    error,
    fetchGames,
    handleSettle,
    handleUpdateBetDB,
  };
};