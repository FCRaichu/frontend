import type { LoginRequest } from "@/types/auth";
import { api } from "../axiosInstance";

export const postLogin = async (data: LoginRequest) => {
  const res = await api.post(`/api/users/login`, data);
  return res;
};
