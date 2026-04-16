export interface AdminUser {
  id: string;
  userId: string;
  nickname: string;
  role: "USER" | "ADMIN";
  points: number;
}
