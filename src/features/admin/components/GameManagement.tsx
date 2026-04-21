import { useEffect, useState } from "react";
import { useAdminGames } from "../hooks/useAdminGames";
import { GameForm } from "./GameForm";
import type { GameAdminRequest } from "../types/admin";

type Mode = "none" | "create" | "edit";

const formatShortDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  });
};

const getYear = (iso: string) => new Date(iso).getFullYear();

export const GameManagement = () => {
  const {
    games,
    selectedGame,
    isLoading,
    isSubmitting,
    error,
    fetchGames,
    fetchGameDetail,
    clearSelection,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useAdminGames();

  const [mode, setMode] = useState<Mode>("none");

  const [selectedYear, setSelectedYear] = useState<string>(
  String(new Date().getFullYear()),
);

  useEffect(() => {
    fetchGames();
  }, []);

  // 존재하는 년도들 추출 (중복 제거 + 내림차순)
  const availableYears = Array.from(
    new Set(games.map((g) => getYear(g.date))),
  ).sort((a, b) => b - a);

  // 필터링된 목록
  const filteredGames =
    selectedYear === "all"
      ? games
      : games.filter((g) => getYear(g.date) === Number(selectedYear));

  const onClickRow = async (gameId: number) => {
    await fetchGameDetail(gameId);
    setMode("edit");
  };

  const onClickNew = () => {
    clearSelection();
    setMode("create");
  };

  const onCancel = () => {
    clearSelection();
    setMode("none");
  };

  const onSubmit = async (request: GameAdminRequest) => {
    if (mode === "create") {
      const ok = await handleCreate(request);
      if (ok) {
        alert("경기가 생성되었습니다.");
        setMode("none");
      }
    } else if (mode === "edit" && selectedGame) {
      const ok = await handleUpdate(selectedGame.id, request);
      if (ok) {
        alert("경기가 수정되었습니다.");
      }
    }
  };

  const onDelete = async () => {
    if (!selectedGame) return;
    if (!confirm(`경기 #${selectedGame.id}을(를) 삭제하시겠습니까?`)) return;

    const ok = await handleDelete(selectedGame.id);
    if (ok) {
      alert("경기가 삭제되었습니다.");
      setMode("none");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 좌측: 경기 목록 */}
      <section className="flex-1 lg:max-w-[60%]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">경기 목록</h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border rounded px-2 py-1 text-sm">
              <option value="all">전체 년도</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-400">
              {filteredGames.length}경기
            </span>
          </div>
          <button
            type="button"
            onClick={onClickNew}
            className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50">
            + 새 경기
          </button>
        </div>

        {isLoading ? (
          <p>로딩 중...</p>
        ) : filteredGames.length === 0 ? (
          <p className="text-gray-400">
            {selectedYear === "all"
              ? "등록된 경기가 없습니다."
              : `${selectedYear}년 경기가 없습니다.`}
          </p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto border rounded">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="border-b p-2">ID</th>
                  <th className="border-b p-2">R</th>
                  <th className="border-b p-2">날짜</th>
                  <th className="border-b p-2">홈</th>
                  <th className="border-b p-2">원정</th>
                  <th className="border-b p-2">결과</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((g) => {
                  const isSelected = selectedGame?.id === g.id;
                  return (
                    <tr
                      key={g.id}
                      onClick={() => onClickRow(g.id)}
                      className={`text-center cursor-pointer hover:bg-gray-50 ${
                        isSelected ? "bg-blue-50" : ""
                      }`}>
                      <td className="border-b p-2">{g.id}</td>
                      <td className="border-b p-2">{g.round}</td>
                      <td className="border-b p-2">{formatShortDate(g.date)}</td>
                      <td className="border-b p-2">{g.homeTeam}</td>
                      <td className="border-b p-2">{g.awayTeam}</td>
                      <td className="border-b p-2">
                        {g.homeScore !== null && g.awayScore !== null
                          ? `${g.homeScore} : ${g.awayScore}`
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 우측: 상세·수정 폼 */}
      <section className="flex-1 border rounded-lg p-5 bg-white">
        {mode === "none" && (
          <div className="text-gray-400 text-sm text-center py-10">
            목록에서 경기를 선택하거나 <br />
            "+ 새 경기" 버튼을 눌러주세요.
          </div>
        )}

        {mode === "create" && (
          <GameForm
            initialGame={null}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        )}

        {mode === "edit" && selectedGame && (
          <GameForm
            initialGame={selectedGame}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onDelete={onDelete}
          />
        )}
      </section>

      {error && (
        <div className="fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};