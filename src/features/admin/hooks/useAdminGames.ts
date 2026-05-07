import { useState } from "react";
import type {
  AdminGame,
  GameResponse,
  GameAdminRequest,
} from "../types/admin";
import {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} from "../api/adminApi";

export const useAdminGames = () => {
  const [games, setGames] = useState<GameResponse[]>([]);
  const [selectedGame, setSelectedGame] = useState<AdminGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 경기 목록 조회
  const fetchGames = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllGames();
      setGames(data);
    } catch (err) {
      setError("경기 목록을 불러오지 못했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 경기 단건 조회 (상세)
  const fetchGameDetail = async (gameId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getGameById(gameId);
      setSelectedGame(data);
    } catch (err) {
      setError("경기 상세 정보를 불러오지 못했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 선택 해제
  const clearSelection = () => setSelectedGame(null);

  // 경기 생성
  const handleCreate = async (request: GameAdminRequest): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createGame(request);
      await fetchGames(); // 목록 갱신
      return true;
    } catch (err) {
      setError("경기 생성에 실패했습니다.");
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 경기 수정
  const handleUpdate = async (
    gameId: number,
    request: GameAdminRequest,
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      const updated = await updateGame(gameId, request);
      setSelectedGame(updated);
      await fetchGames();
      return true;
    } catch (err) {
      setError("경기 수정에 실패했습니다.");
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 경기 삭제
  const handleDelete = async (gameId: number): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await deleteGame(gameId);
      setSelectedGame(null);
      await fetchGames();
      return true;
    } catch (err) {
      setError("경기 삭제에 실패했습니다.");
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    games,
    selectedGame,
    isLoading,
    isSubmitting,
    error,
    fetchGames,
    fetchGameDetail,
    clearSelection,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};