import { useEffect, useState } from "react";
import { useAdminBetting } from "../hooks/useAdminBetting";
import type { GameResult } from "../types/admin";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
};

const getYear = (iso: string) => new Date(iso).getFullYear();

// FC 서울 감지
const isFCSeoul = (teamName: string) => teamName.includes("서울");

// 서울 기준 경기 정보 계산
const getSeoulInfo = (game: {
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
}) => {
  const seoulIsHome = isFCSeoul(game.homeTeam);
  return {
    seoulIsHome,
    opponent: seoulIsHome ? game.awayTeam : game.homeTeam,
    seoulScore: seoulIsHome ? game.homeScore : game.awayScore,
    opponentScore: seoulIsHome ? game.awayScore : game.homeScore,
    location: seoulIsHome ? "홈" : "원정",
  };
};

export const BettingManagement = () => {
  const {
    games,
    isLoading,
    isSubmitting,
    error,
    fetchGames,
    handleSettle,
    handleUpdateBetDB,
  } = useAdminBetting();

  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");
  const [result, setResult] = useState<GameResult | "">("");

  const [showUnsettledOnly, setShowUnsettledOnly] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(
    String(new Date().getFullYear()),
  );

  useEffect(() => {
    fetchGames();
  }, []);

  const availableYears = Array.from(
    new Set(games.map((g) => getYear(g.date))),
  ).sort((a, b) => b - a);

  useEffect(() => {
    if (games.length === 0) return;
    const currentYear = new Date().getFullYear();
    const hasCurrentYear = games.some((g) => getYear(g.date) === currentYear);
    if (!hasCurrentYear) {
      const latestYear = Math.max(...games.map((g) => getYear(g.date)));
      setSelectedYear(String(latestYear));
    }
  }, [games]);

  const filteredGames = games
    .filter((g) =>
      selectedYear === "all" ? true : getYear(g.date) === Number(selectedYear),
    )
    .filter((g) => (showUnsettledOnly ? g.result === null : true))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const selectedGame = games.find((g) => g.id === selectedGameId);
  const seoulInfo = selectedGame ? getSeoulInfo(selectedGame) : null;

  // 사용자에게 보여줄 서울/상대팀 점수 값
  const seoulScoreValue = seoulInfo?.seoulIsHome ? homeScore : awayScore;
  const opponentScoreValue = seoulInfo?.seoulIsHome ? awayScore : homeScore;

  const setSeoulScore = (value: string) => {
    if (seoulInfo?.seoulIsHome) setHomeScore(value);
    else setAwayScore(value);
  };

  const setOpponentScore = (value: string) => {
    if (seoulInfo?.seoulIsHome) setAwayScore(value);
    else setHomeScore(value);
  };

  const resetForm = () => {
    setSelectedGameId(null);
    setHomeScore("");
    setAwayScore("");
    setResult("");
  };

  const onSubmitSettle = async () => {
    if (!selectedGameId || !result || homeScore === "" || awayScore === "") {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const ok = await handleSettle(selectedGameId, {
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      result: result as GameResult,
    });

    if (ok) {
      alert("정산이 완료되었습니다.");
      resetForm();
      fetchGames();
    }
  };

  const onClickUpdateBetDB = async () => {
    if (!confirm("bet 테이블에 없는 경기들의 초깃값을 생성하시겠습니까?")) return;
    const message = await handleUpdateBetDB();
    if (message) alert(message);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <section className="flex-1 border rounded-lg p-5 bg-white">
        <h2 className="text-lg font-bold mb-1">경기 결과 입력 + 베팅 정산</h2>
        <p className="text-xs text-gray-500 mb-4">
          경기 결과를 입력하면 해당 경기의 베팅이 자동 정산됩니다.
        </p>

        <div className="flex flex-col gap-4">
          {/* 필터 */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedGameId(null);
              }}
              className="border rounded px-2 py-1 text-sm">
              <option value="all">전체 년도</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnsettledOnly}
                onChange={(e) => {
                  setShowUnsettledOnly(e.target.checked);
                  setSelectedGameId(null);
                }}
              />
              정산 안 된 경기만
            </label>

            <span className="text-xs text-gray-400 ml-auto">
              {filteredGames.length}경기
            </span>
          </div>

          {/* 카드 리스트 */}
          <div>
            <span className="text-sm font-medium block mb-2">경기 선택</span>
            <div className="max-h-80 overflow-y-auto border rounded">
              {isLoading ? (
                <p className="p-4 text-sm text-gray-400">불러오는 중...</p>
              ) : filteredGames.length === 0 ? (
                <p className="p-4 text-sm text-gray-400">
                  조건에 맞는 경기가 없습니다.
                </p>
              ) : (
                <ul className="divide-y">
                  {filteredGames.map((g) => {
                    const isSelected = selectedGameId === g.id;
                    const isSettled = g.result !== null;
                    const info = getSeoulInfo(g);
                    return (
                      <li
                        key={g.id}
                        onClick={() => setSelectedGameId(g.id)}
                        className={`px-3 py-2.5 cursor-pointer transition ${
                          isSelected
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : "hover:bg-gray-50 border-l-4 border-transparent"
                        }`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-gray-400 shrink-0">
                              #{g.id}
                            </span>
                            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                              {g.round}R
                            </span>
                            <span className="text-xs text-gray-500 shrink-0">
                              {formatDate(g.date)}
                            </span>
                          </div>
                          {isSettled ? (
                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded shrink-0">
                              정산완료 {g.result}
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded shrink-0">
                              미정산
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-sm font-medium truncate flex items-center gap-1.5">
                            <span className="text-[10px] px-1 py-0.5 bg-gray-100 rounded">
                              {info.location}
                            </span>
                            <span>vs {info.opponent}</span>
                          </div>
                          {g.homeScore !== null && g.awayScore !== null && (
                            <div className="text-sm font-bold shrink-0">
                              <span className="text-blue-600">
                                {info.seoulScore}
                              </span>
                              <span className="text-gray-400 mx-1">:</span>
                              <span>{info.opponentScore}</span>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* 선택된 경기 정보 */}
          {selectedGame && seoulInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm">
              <span className="text-xs text-blue-600 block mb-0.5">
                선택된 경기
              </span>
              <div className="font-medium">
                FC 서울 vs {seoulInfo.opponent}
                <span className="ml-2 text-xs text-gray-500">
                  ({seoulInfo.location})
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(selectedGame.date)} · {selectedGame.round}R
              </div>
            </div>
          )}

          {/* 점수 입력 (서울 / 상대팀) */}
          <div className="flex gap-3">
            <label className="flex flex-col gap-1 text-sm flex-1">
              <span className="font-medium">
                FC 서울 점수
                {seoulInfo && (
                  <span className="text-xs text-gray-400 ml-1">
                    ({seoulInfo.location})
                  </span>
                )}
              </span>
              <input
                type="number"
                min={0}
                value={seoulScoreValue}
                onChange={(e) => setSeoulScore(e.target.value)}
                disabled={!selectedGame}
                className="border rounded px-2 py-1.5 disabled:bg-gray-50"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm flex-1">
              <span className="font-medium truncate">
                {seoulInfo ? `${seoulInfo.opponent}` : "상대팀"} 점수
              </span>
              <input
                type="number"
                min={0}
                value={opponentScoreValue}
                onChange={(e) => setOpponentScore(e.target.value)}
                disabled={!selectedGame}
                className="border rounded px-2 py-1.5 disabled:bg-gray-50"
              />
            </label>
          </div>

          {/* 결과 */}
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium">결과 (FC 서울 기준)</span>
            <div className="flex gap-2">
              {(["W", "D", "L"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setResult(r)}
                  className={`flex-1 py-1.5 border rounded text-sm ${
                    result === r
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}>
                  {r === "W" ? "승" : r === "D" ? "무" : "패"}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onSubmitSettle}
            disabled={isSubmitting}
            className="mt-2 bg-black text-white py-2 rounded disabled:opacity-50">
            {isSubmitting ? "처리 중..." : "정산 실행"}
          </button>
        </div>
      </section>

      <section className="flex-1 border rounded-lg p-5 bg-white">
        <h2 className="text-lg font-bold mb-1">bet DB 업데이트</h2>
        <p className="text-xs text-gray-500 mb-4">
          bet 테이블에 아직 기록되지 않은 경기들을 찾아서 초깃값을 생성합니다.
          새 경기가 추가된 후 실행해주세요.
        </p>

        <button
          type="button"
          onClick={onClickUpdateBetDB}
          disabled={isSubmitting}
          className="w-full bg-gray-800 text-white py-2 rounded disabled:opacity-50">
          {isSubmitting ? "처리 중..." : "DB 업데이트 실행"}
        </button>
      </section>

      {error && (
        <div className="fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};