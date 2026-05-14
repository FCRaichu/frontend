/**
 * ============================================================================
 * [ Axios Interceptor 및 다중 요청 제어(Queue) 동작 흐름 ]
 * ============================================================================
 * * 1. 기본 통신 흐름
 * 1-1. Request(요청): 서버로 출발하기 직전, Zustand 스토어의 최신 액세스 토큰을 헤더에 탑재.
 * 1-2. Response(응답): 응답을 받기 직전, 에러 코드(401, 400 등)를 검사하여 예외 처리.
 * * 2. 다중 요청 제어 (Race Condition 방어) 목적
 * - 문제: 토큰이 만료된 시점에 여러 API가 동시에 호출되면, 모두 401을 맞고 동시에 Refresh API를 여러 번 호출하는 대참사 발생.
 * - 해결: 단 한 번만 Refresh API를 호출하고(Lock), 나머지 요청들은 Queue에 모아두었다가 새 토큰이 나오면 일제히 재요청.
 * * 3. 401 에러 발생 시 상세 처리 흐름
 * 3-1. 최초 401 감지 (`!originalRequest._retry`)
 * - 요청에 `_retry = true` 꼬리표를 달아 무한 루프 방지.
 * * 3-2. 누군가 이미 갱신 중일 때 (`isRefreshing === true`)
 * - 다른 API가 이미 Refresh를 하러 갔다면, 나중에 올 새 토큰을 기다리며 refreshSubscribers 방에 입장. (Promise 반환)
 * * 3-3. 내가 처음으로 갱신하러 갈 때 (`isRefreshing === false`)
 * - 문을 잠금 (`isRefreshing = true`).
 * - HttpOnly 쿠키(리프레시 토큰 등)를 싣고 Refresh API 호출.
 * * 3-4. Refresh 성공 시
 * - 새 액세스 토큰을 스토어에 저장.
 * - 문을 열고 (`isRefreshing = false`), 대기실(`onRefreshed`)에 있던 모든 API들에게 새 토큰을 쥐여주고 일제히 재출발시킴.
 * - 문을 잠갔던 본 요청도 새 토큰으로 바꿔 달고 다시 출발.
 * * 3-5. Refresh 실패 시 (리프레시 토큰마저 만료된 경우)
 * - 문을 열고 대기실 폭파 (`onRefreshFailed` → refreshSubscribers = []).
 * - Zustand 스토어 비우기 및 로그인 페이지로 강제 추방.
 * ============================================================================
 */

import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

// ─── 다중 요청 제어 상태 ───────────────────────────────────────────────────────

let isRefreshing = false;

// resolve/reject 쌍으로 관리 → Refresh 실패 시에도 대기 중인 요청들을 올바르게 reject 가능
let refreshSubscribers: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

// 대기 큐 실행 (Refresh 성공): 모든 대기 요청에 새 토큰 전달 후 큐 비우기
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
};

// 대기 큐 폭파 (Refresh 실패): 모든 대기 요청을 에러로 reject 후 큐 비우기
const onRefreshFailed = (error: unknown) => {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
};

// 대기 큐 추가: 새 토큰 또는 에러를 전달받을 콜백 등록
const addRefreshSubscriber = (
  resolve: (token: string) => void,
  reject: (error: unknown) => void,
) => {
  refreshSubscribers.push({ resolve, reject });
};

// 로컬 인증 상태 초기화 (logout API 호출 없이 스토어만 비움)
// → Refresh 실패 시 logout()을 호출하면 /api/auth/logout 요청이 또 401을 맞아 재귀 발생하므로 직접 setState 사용
const clearLocalAuth = () => {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    tokenType: null,
    refreshToken: null,
  });
};

// ─── Request 인터셉터 ──────────────────────────────────────────────────────────

// 서버로 요청을 "보내기" 전에 인터셉트!
api.interceptors.request.use(
  (config) => {
    // Zustand 스토어에 저장되어 있는 최신 토큰을 가져옴
    const { accessToken, tokenType } = useAuthStore.getState();

    // 토큰 있으면? 헤더에 실어줌 (비어있거나 'undefined' 문자열인 경우 방지)
    if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
      config.headers.Authorization = `${tokenType || "Bearer"} ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response 인터셉터 ─────────────────────────────────────────────────────────

// Response 인터셉터: 401(만료) 및 기타 에러 처리
api.interceptors.response.use(
  (response) => response, // 성공 시 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 (액세스 토큰 만료 에러) - _retry 꼬리표로 무한 루프 방지
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 3-2. 누군가 이미 갱신 중 → 대기실 입장 (새 토큰 또는 에러 수신 대기)
      if (isRefreshing) {
        // 재시도 후 또 401이 와도 refresh 루프 재진입 방지
        originalRequest._retry = true;
        return new Promise<string>((resolve, reject) => {
          addRefreshSubscriber(resolve, reject);
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      // 3-3. 내가 처음 → _retry 꼬리표 달고 문 잠금
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken, setAuth } = useAuthStore.getState();

        // Refresh API 호출 (HttpOnly 쿠키의 리프레시 토큰 포함)
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        // 3-4. Refresh 성공 → 새 토큰 저장
        const { accessToken: newAccessToken } = refreshRes.data;
        setAuth(newAccessToken, "Bearer", refreshToken || "");

        // 잠금 해제 및 대기실 전원 새 토큰으로 재출발
        isRefreshing = false;
        onRefreshed(newAccessToken);

        // 갱신된 토큰으로 원래 실패했던 요청 다시 보내기
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 3-5. Refresh도 실패 (리프레시 토큰 만료) → 강제 로그아웃
        isRefreshing = false;
        onRefreshFailed(refreshError);

        // 로컬 상태만 초기화 (logout() 호출 시 재귀 방지 - 주석 위 clearLocalAuth 참고)
        clearLocalAuth();

        // 이미 로그인 페이지면 alert + 이동 중복 방지
        if (!window.location.pathname.startsWith("/login")) {
          alert("로그인이 필요한 서비스입니다.");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // 에러 상태 코드별 처리
    if (error.response) {
      const status = error.response.status;
      const serverMessage =
        error.response.data?.message || error.response.data?.error_description;

      if (status === 400 || status === 403) {
        alert(serverMessage || "잘못된 요청입니다.");
      } else if (status >= 500) {
        alert("서버 오류입니다. 잠시 후 시도해주세요.");
      }
    }

    return Promise.reject(error);
  },
);
