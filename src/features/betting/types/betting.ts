export interface ActiveBettingData {
  userId: string;
  betId: number;
  gameId: number;
  gameDate: string;
  opponent: string;
  totalBettors: number;
  totalPoint: number;
  winPoint: number;
  drawPoint: number;
  losePoint: number;
  myWinPoint: number;
  myDrawPoint: number;
  myLosePoint: number;
}

export interface PostBettingRequest {
  gameId: number;
  windPoint: number;
  drawPoint: number;
  losePoint: number;
}

export interface myBettingStats {
  userId: string;
  totalNumber: number;
  gain: number;
  loss: number;
}

export interface BettingHistoryItem {
  betId: number;
  betHistoryId: number;
  gameId: number;
  opponent: string;
  gameDate: string;
  totalBettors: number;
  totalPoint: number;
  winPoint: number;
  drawPoint: number;
  losePoint: number;
  gameResult: "W" | "D" | "L";
  payoutPoint: number;
}
