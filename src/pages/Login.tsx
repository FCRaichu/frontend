import { postLogin } from "@/apis/auth/postLogin";
import { useAuthStore } from "@/stores/useAuthStore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const setAuth = useAuthStore((state) => state.setAuth); // 전역 상태 변경 함수!! (zustand)
  const navigate = useNavigate();

  // 로그인 시 필요한 데이터 정의
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
  });

  // 키값을 이벤트 객체로 가져와서 데이터 set 하기
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await postLogin(loginData); // 미리 정의해둔 postLogin API 함수 사용
      if (res.status === 200) {
        setAuth(res.data); // 서버 응답 데이터를 zustand 스토어에 저장.
        alert("로그인 성공!");
        navigate("/");
      }
    } catch (e) {
      console.log("로그인 실패: ", e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>로그인</h1>
      <h2>FC라이츄 회원 로그인</h2>
      <input
        type="text"
        placeholder="userId"
        name="userId"
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="비밀번호"
        name="password"
        onChange={handleChange}
      />
      <button type="submit">로그인</button>
    </form>
  );
}
