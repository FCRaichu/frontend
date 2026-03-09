import type { LoginRequest, SignUpRequest } from "@/types/auth";
import { api } from "../axiosInstance";

// 로그인 로직
export const postLogin = async (data: LoginRequest) => {
  const res = await api.post(`/api/users/login`, data);
  return res;
};

// 회원가입 로직
export const postSingUp = async (data: SignUpRequest) => {
  const res = await api.post(`/api/users/join`, data);
  return res; // 성공 시 201 Created 응답 반환
};
