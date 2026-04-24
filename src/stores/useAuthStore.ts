import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/auth/types/auth";
import { api } from "@/api/axiosInstance";

// 유저 상태
interface AuthState {
  user: User | null;
  accessToken: string | null; // key cloak 액세스 토큰
  refreshToken: string | null;
  tokenType: string | null; // key cloak 토큰 타입

  // Actions
  // key cloak 성공적으로 부르면 아래의 내용 받아오기
  setAuth: (
    accessToken: string,
    tokenType: string,
    refreshToken: string,
  ) => void;

  setUser: (user: User) => void;
  updateUser: (userInfo: Partial<User>) => void;
  isLoggedIn: () => boolean; // 로그인 여부 확인
  logout: () => Promise<void>; // 로그아웃 시 호출
}

// zustand 스토어 생성
export const useAuthStore = create<AuthState>()(
  // persist = 데이터를 로컬 스토리지에 저장해서 새로고침 해도 데이터 유지 가능!
  persist(
    (set, get) => ({
      // 초기 상태값
      user: null,
      accessToken: null,
      refreshToken: null,
      tokenType: null,

      // 상태 변경 함수
      // 유저 정보와 토큰을 따로 나눈다.
      // 토큰 정보는 key cloak에서 받아온다.
      setAuth: (
        accessToken: string,
        tokenType: string,
        refreshToken: string,
      ) => {
        set({
          accessToken,
          tokenType,
          refreshToken,
        });
      },

      setUser: (user: User) => {
        set({ user: { ...user } });
      },

      updateUser: (userInfo: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userInfo },
          });
        }
      },

      isLoggedIn: () => !!get().accessToken, // 로그인 여부 확인

      // 로그아웃
      logout: async () => {
        try {
          // 1. 백엔드에 로그아웃 요청
          const res = await api.get("/api/auth/logout");
          const { logoutUrl } = res.data;

          // 2. 로컬 상태 정리
          // Zustand 및 로컬 스토리지 상태 초기화
          set({
            user: null,
            accessToken: null,
            tokenType: null,
            refreshToken: null,
          });

          localStorage.clear();

          // 3. Keycloak SS0 세션 종료를 위해 리다이렉트
          // Keycloak 서버로 이동하여 세션을 강제로 끊고 다시 프론트엔드로 리다이렉트
          if (logoutUrl) {
            window.location.href = logoutUrl;
          } else {
            // URL을 못 받았을 경우 예외 처리
            window.location.href = "/";
          }
        } catch (error) {
          console.error("로그아웃 처리 중 에러 발생:", error);

          // 에러가 발생해도 로컬 상태는 초기화
          set({
            user: null,
            accessToken: null,
            tokenType: null,
            refreshToken: null,
          });
          // window.location.href = "/";
        }
      },
    }),
    { name: "auth-storage" },
  ),
);
