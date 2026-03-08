import { postSingUp } from "@/apis/auth/SignUp";
import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    nickname: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await postSingUp(formData);

      if (res.status === 201) {
        alert("가입을 환영합니다! 로그인을 진행해 주세요.");
      }
    } catch (error) {
      console.log("회원가입 실패: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>회원가입</h2>
      <input
        type="text"
        placeholder="id"
        onChange={(e) =>
          setFormData({
            ...formData,
            userId: e.target.value,
          })
        }
      />
      <input
        type="text"
        placeholder="password"
        onChange={(e) =>
          setFormData({
            ...formData,
            password: e.target.value,
          })
        }
      />
      <input
        type="text"
        placeholder="nickname"
        onChange={(e) =>
          setFormData({
            ...formData,
            nickname: e.target.value,
          })
        }
      />
      <button type="submit">가입하기</button>
    </form>
  );
}
