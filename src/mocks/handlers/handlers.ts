import { signUpHandler } from "./auth";
import { gamesHandler } from "./games";
import { recordsHandler } from "./posts";

// 전체 mocking 함수 관리
export const handlers = [...signUpHandler, ...gamesHandler, ...recordsHandler];
