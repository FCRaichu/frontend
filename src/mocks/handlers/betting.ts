import { http, HttpResponse } from "msw";
import {
  mockActiveBettingData,
  mockBettingHistoryData,
  mockBettingRecordData,
} from "../data/betting";

// 선수 관련 mocking 함수 모아두기
export const bettingHandler = [
  // 1. 나의 배팅 전체 통계 가져오기 (유저 아이디, 총 참여 횟수, 얻은 전체 포인트, 잃은 전체 포인트)
  http.get("/api/bet/record", async () => {
    return HttpResponse.json(mockBettingRecordData, { status: 200 });
  }),

  // 2. 현재 진행 중인 배팅 정보
  http.get("/api/bet", async () => {
    return HttpResponse.json(mockActiveBettingData, { status: 200 });
  }),

  // 3. 배팅하기
  http.post("/api/bet", async () => {
    return HttpResponse.json({ message: "배팅 성공" }, { status: 200 });
  }),

  // 4. 이전 배팅 기록들
  http.get("/api/bet/history", async () => {
    return HttpResponse.json(mockBettingHistoryData, { status: 200 });
  }),
];
