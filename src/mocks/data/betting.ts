export const mockBettingRecordData = {
  userId: "7070b486-a9dd-4aee-9fe9-eddb7713c8e9",
  totalNumber: 5, // 내가 베팅에 참여한 경기 수
  gain: 2000, // 얻은 전체 포인트
  loss: 1000, // 잃은 전체 포인트
};

export const mockActiveBettingData = {
  userId: "7070b486-a9dd-4aee-9fe9-eddb7713c8e9", // 유저 db 테이블 pk
  betId: 5, // 베팅 db 테이블 pk
  gameId: 1, // 게임 db 테이블 pk
  gameDate: "2026-02-10T19:00:00",
  opponent: "전북",

  totalBettors: 10, // 총 베팅한 사람 수
  totalPoint: 300000, // 베팅 걸린 전체(모든 유저의) 포인트
  winPoint: 3000,
  drawPoint: 2000,
  losePoint: 1000,

  myWinPoint: 2000, // 내가 win에 건 포인트
  myDrawPoint: 1000,
  myLosePoint: 0,
};

export const mockBettingHistoryData = [
  {
    betId: 2,
    betHistoryId: 2,
    gameId: 2,
    opponent: "전북",
    gameDate: "2026-02-10T19:00:00",

    totalBettors: 10, // 총 베팅한 사람 수
    totalPoint: 10000, // 모든 사람이 베팅한 금액
    winPoint: 5000,
    drawPoint: 2000,
    losePoint: 3000,
    gameResult: "W", // W, D, L
    payoutPoint: 5000, // 본인이 베팅으로 얻은 포인트 (음수 가능)
  },
  {
    betId: 3,
    betHistoryId: 3,
    gameId: 3,
    opponent: "전북",
    gameDate: "2026-02-10T19:00:00",

    totalBettors: 10, // 총 베팅한 사람 수
    totalPoint: 10000, // 모든 사람이 베팅한 금액
    winPoint: 5000,
    drawPoint: 2000,
    losePoint: 3000,
    gameResult: "W", // W, D, L
    payoutPoint: 5000, // 본인이 베팅으로 얻은 포인트 (음수 가능)
  },
];
