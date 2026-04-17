import {
  handleAuthCallback,
  loginWithKeycloak,
} from "@/features/auth/api/authApi";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (code && state) {
        try {
          const result = await handleAuthCallback(code, state);

          if (result.status === "SUCCESS") {
            // 기존 회원은 로그인 성공 및 메인 페이지로 이동
            navigate("/");
          } else if (result.status === "NEED_SIGNUP") {
            // 미가입 사용자는 닉네임 설정 페이지로 이동
            navigate("/signup");
          }
        } catch (e) {}
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
