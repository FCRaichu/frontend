import { api } from "@/api/axiosInstance";
import type { AdminUser } from "../types/admin";

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const { data } = await api.get("/api/admin/users");
  return data;
};
