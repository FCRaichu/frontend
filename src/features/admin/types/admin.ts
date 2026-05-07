// 기존 회원
export interface AdminUser {
  id: string;
  userId: string;
  nickname: string;
  role: "USER" | "ADMIN";
  points: number;
}

// 게시글 관리
export interface AdminPost {
  postId: number;
  nickname: string;
  gameId: number;
  date: string;       // LocalDateTime → ISO string
  createdAt: string;
}

// 경기 관리
export type GameResult = "W" | "D" | "L";

export interface AdminGame {
  id: number;
  date: string;
  stadium: string;
  round: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  result: GameResult | null;
  updatedAt: string;
  deletedAt: string | null;
  createdAt: string;
}

// 경기 생성/수정 요청
export interface GameAdminRequest {
  date: string;
  stadium: string;
  round: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  result?: GameResult | null;
  deletedAt?: string | null;
}

// 경기 결과 입력 (베팅 정산)
export interface GameAdminResultRequest {
  homeScore: number;
  awayScore: number;
  result: GameResult;
}

// 선수 관리
export type PlayerPosition = "GK" | "DF" | "MF" | "FW"; 
export type PlayerStatus = "ACTIVE" | "LOAN" | "DEPARTED";

export interface AdminPlayer {
  id: number;
  name: string;
  backNumber: number;
  position: PlayerPosition;
  status: string;
  image: string;
}

// 선수 생성 요청 (multipart/form-data로 보낼 거라 File 타입 포함)
export interface CreatePlayerRequest {
  name: string;
  backNumber: number;
  position: PlayerPosition;
  status: PlayerStatus;
  image: File;
}

export interface UpdatePlayerRequest {
  name?: string;
  backNumber?: number;
  position?: PlayerPosition;
  status?: PlayerStatus;
  image?: File;
}

export interface GameResponse {
  id: number;
  date: string;
  round: number;
  homeTeam: string;
  awayTeam: string;
  opponent: string | null;
  stadium: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "SCHEDULED" | "FINISHED";
  result: GameResult | null;
  isAttended: boolean | null;
}

// 전체 조회 응답 (PlayerController의 PlayerResponse)
export interface AdminPlayer {
  id: number;
  name: string;
  backNumber: number;
  position: PlayerPosition;
  status: string; // PlayerStatus가 문자열로 옴
  image: string;  // 상대 경로
}

// 생성 요청 (multipart)
export interface CreatePlayerRequest {
  name: string;
  backNumber: number;
  position: PlayerPosition;
  status: PlayerStatus;
  image: File;
}

// 수정 요청 (이미지 옵셔널)
export interface UpdatePlayerRequest {
  name?: string;
  backNumber?: number;
  position?: PlayerPosition;
  status?: PlayerStatus;
  image?: File;
}