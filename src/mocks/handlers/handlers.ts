import { signUpHandler } from "./auth";
import { gamesHandler } from "./games";

// 전체 mocking 함수 관리
export const handlers = [...signUpHandler, ...gamesHandler];
