import { api } from "@/api/axiosInstance";

import type {
  AdminUser,
  AdminPost,
  AdminGame,
  GameResponse,
  GameAdminRequest,
  GameAdminResultRequest,
  AdminPlayer,
  CreatePlayerRequest,
  UpdatePlayerRequest,
} from "../types/admin";

// 회원 전체 조회
export const getAllUsers = async (): Promise<AdminUser[]> => {
  const { data } = await api.get("/api/admin/users");
  return data;
};

// 직관 인증 게시글 전체 조회
export const getAllPosts = async (): Promise<AdminPost[]> => {
  const { data } = await api.get("/api/admin/verifications/posts/all");
  return data;
};

// 경기 전체 조회 (배팅 관리에서 dropdown용으로 사용)
export const getAllGames = async (): Promise<GameResponse[]> => {
  const { data } = await api.get("/api/games/all");
  return data;
};

// 경기 결과 입력 + 베팅 정산
export const settleBet = async (
  gameId: number,
  request: GameAdminResultRequest,
): Promise<void> => {
  await api.put(`/api/admin/bet/settle/${gameId}`, request);
};

// bet 테이블에 없는 경기들 초깃값 생성
export const updateBetDB = async (): Promise<string> => {
  const { data } = await api.post<string>("/api/admin/bet/db-update");
  return data;
};

// 경기 단건 조회 (admin용 - Game entity 반환)
export const getGameById = async (gameId: number): Promise<AdminGame> => {
  const { data } = await api.get(`/api/admin/game/${gameId}`);
  return data;
};

// 경기 생성
export const createGame = async (
  request: GameAdminRequest,
): Promise<void> => {
  await api.post("/api/admin/game", request);
};

// 경기 수정
export const updateGame = async (
  gameId: number,
  request: GameAdminRequest,
): Promise<AdminGame> => {
  const { data } = await api.put(`/api/admin/game/${gameId}`, request);
  return data;
};

// 경기 삭제 (soft delete)
export const deleteGame = async (gameId: number): Promise<void> => {
  await api.delete(`/api/admin/game/${gameId}`);
};

// 선수 전체 조회
export const getAllPlayers = async (): Promise<AdminPlayer[]> => {
  const { data } = await api.get("/api/players");
  return data;
};

// 선수 생성 (multipart/form-data)
export const createPlayer = async (
  request: CreatePlayerRequest,
): Promise<void> => {
  const formData = new FormData();
  formData.append("name", request.name);
  formData.append("backNumber", String(request.backNumber));
  formData.append("position", request.position);
  formData.append("status", request.status);
  formData.append("image", request.image);

  await api.post("/api/admin/player", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 선수 수정 (multipart/form-data, 이미지 옵셔널)
export const updatePlayer = async (
  id: number,
  request: UpdatePlayerRequest,
): Promise<void> => {
  const formData = new FormData();
  if (request.name !== undefined) formData.append("name", request.name);
  if (request.backNumber !== undefined)
    formData.append("backNumber", String(request.backNumber));
  if (request.position !== undefined) formData.append("position", request.position);
  if (request.status !== undefined) formData.append("status", request.status);
  if (request.image !== undefined) formData.append("image", request.image);

  await api.put(`/api/admin/player/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};