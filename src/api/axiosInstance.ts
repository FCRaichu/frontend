import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // 응답 대기 5초
});

// 서버로 요청을 "보내기" 전에 인터셉트!
api.interceptors.request.use(
  (config) => {
    // zustand 스토어에 저장되어 있는 최신 토큰을 가져옴.
    const { accessToken, tokenType } = useAuthStore.getState();

    // 토큰 있으면? 헤더에 실어줌 (비어있거나 'undefined' 문자열인 경우 방지)
    if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
      config.headers.Authorization = `${tokenType || "Bearer"} ${accessToken}`;
    }

    // 요청 보냄
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response 인터셉터: 401(만료) 및 404(미가입) 처리
api.interceptors.response.use(
  (response) => response, // 성공 시 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 (액세스 토큰 만료 에러)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken, refreshToken, setAuth } = useAuthStore.getState();

        // Refresh API 호출
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          {
            headers: {
              "X-Expired-AccessToken": `Bearer ${accessToken}`, // header에 담아서 전달
            },
          },
        );

        // Refresh 성공하여 새로운 액세스 토큰 받아오기
        const { accessToken: newAccessToken } = refreshRes.data;
        setAuth(newAccessToken, "Bearer", refreshToken || "");

        // 갱신된 토큰으로 원래 실패했던 요청 다시 보내기
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh도 실패한 경우 (리프레시 토큰 만료) -> 강제 로그아웃
        useAuthStore.getState().logout();
        alert("로그인이 필요한 서비스입니다.");
        window.location.href = "/login";

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
