import { useState } from "react";
import type {
  AdminPlayer,
  CreatePlayerRequest,
  UpdatePlayerRequest,
} from "../types/admin";
import {
  getAllPlayers,
  createPlayer,
  updatePlayer,
} from "../api/adminApi";

export const useAdminPlayers = () => {
  const [players, setPlayers] = useState<AdminPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<AdminPlayer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllPlayers();
      setPlayers(data);
    } catch (err) {
      setError("선수 목록을 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPlayer = (player: AdminPlayer) => {
    setSelectedPlayer(player);
  };

  const clearSelection = () => {
    setSelectedPlayer(null);
  };

  const handleCreate = async (
    request: CreatePlayerRequest,
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createPlayer(request);
      await fetchPlayers();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "선수 생성에 실패했습니다.");
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (
    id: number,
    request: UpdatePlayerRequest,
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await updatePlayer(id, request);
      await fetchPlayers();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "선수 수정에 실패했습니다.");
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    players,
    selectedPlayer,
    isLoading,
    isSubmitting,
    error,
    fetchPlayers,
    selectPlayer,
    clearSelection,
    handleCreate,
    handleUpdate,
  };
};