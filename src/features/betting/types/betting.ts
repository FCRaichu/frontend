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
