import {
  handleAuthCallback,
  loginWithKeycloak,
} from "@/features/auth/api/authApi";
import { getMyUnreadBetting } from "@/features/betting/api/betting";

import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isProcessed = useRef(false); // 로그인 중복 요청 방지용 플래그

  useEffect(() => {
    const processAuth = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      if (isProcessed.current) return; // true이면 이미 처리 중이므로 무시

      if (code && state) {
        isProcessed.current = true;
        try {
          const result = await handleAuthCallback(code, state);

          if (result.status === "SUCCESS") {
            // 확인 안 한 배팅 정산 결과 조회 → sessionStorage에 저장 (Home에서 모달로 표시)
            try {
              const unreadBettings = await getMyUnreadBetting();
              if (unreadBettings?.length > 0) {
                sessionStorage.setItem(
                  "unreadBettings",
                  JSON.stringify(unreadBettings),
                );
              }
            } catch (error) {
              console.error("베팅 정산 확인 중 오류:", error);
            }

            // 기존 회원은 로그인 성공 및 메인 페이지로 이동
            navigate("/");
          } else if (result.status === "NEED_SIGNUP") {
            // 미가입 사용자는 닉네임 설정 페이지로 이동
            navigate("/signup");
          }
        } catch (e) {
          isProcessed.current = false; // 에러 발생 시 다시 로그인 시도할 수 있도록.
        }
      } else {
        // 최초 진입 시, keycloak 로그인 페이지로 리다이렉트
        loginWithKeycloak();
      }
    };

    processAuth();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-body-lg">로그인 페이지로 이동 중입니다...</p>
    </div>
  );
}
