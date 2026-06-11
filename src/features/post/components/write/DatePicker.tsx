import { useEffect, useState } from "react";
import { getAllGames } from "@/features/game/api/gameApi";
import { getMyAllPosts } from "../../api/postApi";
import { formatDate, formatGameDateTime } from "@/utils/formatDate";

import { LuCalendarDays } from "react-icons/lu";

interface Game {
  id: number;
  date: string;
  opponent: string;
  stadium: string;
  result?: string;
}

interface Props {
  value: number;
  onChange: (id: number) => void;
  isEditMode?: boolean;
  initialGameId?: number;
}
// DONE: Date Picker 컴포넌트 만들기
export default function DatePicker({
  value,
  onChange,
  isEditMode,
  initialGameId,
}: Props) {
  // 초기값은 빈 배열
  const [games, setGames] = useState<Game[]>([]);

  // 경기 전체 일정 조회
  useEffect(() => {
    const fetchGamesAndRecords = async () => {
      try {
        // 전체 경기와 내가 쓴 기록을 병렬로 호출해서 내가 이미 작성한 포스트라면? 경기 일자를 빼버리기
        const [gameRes, postRes] = await Promise.all([
          getAllGames(),
          getMyAllPosts(), // 내가 이미 작성한 포스트 목록 가져오기
        ]);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        // 이미 기록이 있는 경기 ID들 추출
        const writtenGameIds =
          postRes?.posts?.map((post: any) => post.gameId) || [];

        const filteredAndSorted = (gameRes || [])
          .filter((game: Game) => {
            const gameDate = new Date(game.date);
            // DONE: 오늘 경기를 기준으로 이전 경기만 보여주기
            const isPastOrToday = gameDate <= today;

            // result(win/draw/lose)가 null이거나 빈 문자열인 경우는 제외하기.
            const hasResult = game.result !== null && game.result !== undefined && game.result !== "";

            // 내가 이미 썼던 경기(writtenGameIds)는 제외하기
            // 이미 썼던 경기이지만 수정 모드라면 목록에 포함시킨다.
            const isNotWritten = !writtenGameIds.includes(game.id);

            const isCurrentValue = value && Number(game.id) === Number(value);

            const isOriginalGameInEditMode =
              isEditMode && game.id === initialGameId;

            return (
              isPastOrToday &&
              hasResult &&
              (isNotWritten || isOriginalGameInEditMode || isCurrentValue)
            );
          })
          .sort((a: Game, b: Game) => {
            // 최신순으로 정렬함
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });

        setGames(filteredAndSorted);

        // 초기값이 없을 때 첫 번째 경기를 기본값으로 설정.
        if (filteredAndSorted.length > 0 && !value) {
          onChange(filteredAndSorted[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchGamesAndRecords();
  }, [value, isEditMode, initialGameId]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seletedId = Number(e.target.value);
    const selectedGame = games.find((game) => game.id === seletedId);

    if (selectedGame) {
      onChange(selectedGame.id);
    }
  };

  // 현재 선택된 게임
  const selectedGame = games.find((game) => game.id === value);

  return (
    <>
      <div className="w-full max-w-5xl mb-4 md:mb-8">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
          <LuCalendarDays className="text-primary text-base sm:text-lg md:text-xl" />
          <span className="font-bold text-subText text-sm sm:text-base md:text-lg">
            경기 일정
          </span>
        </div>

        <div className="relative group">
          <div
            className="px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 w-full bg-light border-2 border-disabled
          rounded-lg sm:rounded-xl transition-all group-hover:border-primary"
          >
            {selectedGame ? (
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center text-gray-800 font-medium gap-y-0.5">
                <span className="text-sm sm:text-base md:text-lg whitespace-nowrap">
                  {formatGameDateTime(selectedGame.date).formattedDate}
                </span>
                <span className="hidden sm:inline mx-2 text-gray-400">/</span>
                <span className="text-sm sm:text-base md:text-lg whitespace-nowrap">
                  FC서울 VS {selectedGame.opponent}
                </span>
                <span className="hidden sm:inline mx-2 text-gray-400">/</span>
                <span className="text-sm sm:text-base md:text-lg text-gray-500 sm:text-gray-800 truncate">
                  {selectedGame.stadium}
                </span>
              </div>
            ) : (
              <p className="text-sm sm:text-base text-gray-500">
                경기를 선택해주세요
              </p>
            )}
          </div>

          {/* 투명한 select는 덮어주기 */}
          <select
            value={value || ""}
            onChange={handleSelectChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {formatDate(game.date)} / {game.opponent} / {game.stadium}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
