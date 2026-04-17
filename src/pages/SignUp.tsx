import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSingUp } from "@/features/auth/api/authApi";
import Typography from "@/components/common/Typography";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

export default function SignUp() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await postSingUp(nickname);
      if (res.status === 201) {
        alert("가입을 환영합니다!");
        navigate("/");
      }
    } catch (error) {
      console.error("닉네임 설정 실패: ", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center pt-24 md:pt-40 px-6 w-full bg-secondary box-border overflow-x-hidden">
      <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
        <Typography
          variant="h1"
          color="text-background"
          className="mb-4 text-3xl md:text-4xl">
          닉네임 설정
        </Typography>
        <Typography variant="h4" color="text-disabledGray">
          닉네임은 초기 설정 이후 변경이 가능합니다.
        </Typography>
      </div>

      <div className="flex items-center justify-center w-full max-w-100 md:max-w-125 gap-3">
        <Input name="nickname" placeholder="수호신" onChange={handleChange} />
        <Button
          type="submit"
          width="fixed"
          className="w-12 self-center md:self-end">
          확인
        </Button>
      </div>
    </form>
  );
}
