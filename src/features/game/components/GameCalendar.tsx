import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./GameCalendar.css";
import { useAuthStore } from "@/stores/useAuthStore";
import { FC_TEAMS } from "@/data/fc_teams";
import { getGames, getGuestGames } from "../api/gameApi";
import type { Game } from "@/features/game/types/game";
import Typography from "@/components/common/Typography";

// 캘린더 설정
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// 아이콘
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

export const GameCalendar = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const loggedIn = isLoggedIn();

  // ------------ 날짜 넘길 때 필요한 상태와 Ref
  const calendarRef = useRef<FullCalendar>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  // ------------ 경기 일정 데이터 받아오기 with React Query
  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["games", currentYear, currentMonth],
    queryFn: () => {
      const fetchFn = loggedIn ? getGames : getGuestGames;
      return fetchFn(currentYear, currentMonth);
    },
    enabled: !!currentYear && !!currentMonth, // year와 month가 유효할 때만 쿼리 실행
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지 (서버 호출 방지)
    gcTime: 1000 * 60 * 60 * 2,
  });

  // 배열 데이터 안전 확보
  const validGames = Array.isArray(games) ? games : [];

  // 캘린더에 입력할 데이터로 변환
  const events = validGames.map((game) => {
    const dateObj = new Date(game.date);
    const formattedDate = !isNaN(dateObj.getTime())
      ? dateObj.toISOString().split("T")[0]
      : "";

    return {
      id: String(game.id),
      title: `${game.opponent}`,
      start: formattedDate,
      extendedProps: { ...game },
    };
  });

  // 날짜순 정렬 데이터 (모바일 리스트용)
  const sortedGames = [...validGames].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return timeA - timeB;
  });

  // 요일 추출 함수
  const getKoreanDay = (dateString: Date | string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.getDay()];
  };

  // 시간 추출 함수
  const extractTime = (dateString: Date | string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "미정";

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // 자정(00:00)으로 넘어오는 경우 시간 미정으로 간주
    if (hours === "00" && minutes === "00") return "시간 미정";
    return `${hours}:${minutes}`;
  };

  // 공통 클릭 핸들러
  const handleGameClick = (gameData: Game, isFuture: boolean) => {
    if (!loggedIn) {
      alert("경기 기록은 로그인 후 이용 가능합니다.");
      navigate("/login");
      return;
    }

    // result 대신 날짜 기반 미래 경기 판단 로직으로 변경
    if (isFuture) {
      alert("아직 진행되지 않은 경기입니다.");
      return;
    }

    if (gameData.isAttended) return;

    navigate("/post", { state: { gameId: String(gameData.id) } });
  };

  // ------------ 달력 조작 함수 (이전, 다음)
  const updateHeaderDate = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const currentDate = calendarApi.getDate();

      const newYear = currentDate.getFullYear();
      const newMonth = currentDate.getMonth() + 1;

      // 값이 정상일 때만 업데이트
      if (newYear && newMonth) {
        setCurrentYear(newYear);
        setCurrentMonth(newMonth);
      }
    }
  };

  // 특정 연/월로 이동하는 함수
  const goToDate = (year: number, month: number) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(`${year}-${String(month).padStart(2, "0")}-01`);
      updateHeaderDate();
    }
  };

  // 연도 변경 핸들러
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    goToDate(newYear, currentMonth);
  };

  // 월 변경 핸들러
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    goToDate(currentYear, newMonth);
  };

  // // 컴포넌트 마운트 시 헤더 날짜 초기화
  // useEffect(() => {
  //   setTimeout(updateHeaderDate, 0);
  // }, []);

  // 이전으로
  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
    updateHeaderDate();
  };

  // 다음으로
  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const actualCurrentYear = new Date().getFullYear();

    const calendarDate = calendarApi.getDate();
    const viewingYear = calendarDate.getFullYear();
    const viewingMonth = calendarDate.getMonth();

    if (viewingYear >= actualCurrentYear && viewingMonth >= 11) {
      return;
    }

    calendarApi.next();
    updateHeaderDate();
  };

  // 2010년부터 올해까지만 연도 옵션으로 보여주기
  const startYear = 2010;
  const actualYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: actualYear - startYear + 1 },
    (_, i) => startYear + i,
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div
      className={`
    custom-calendar-wrapper
    w-full max-w-6xl mx-auto mt-10 md:mt-16 px-4
    text-secondary
    `}>
      {/* 상단 타이틀 & 커스텀 헤더 */}
      <div className="relative text-center mb-16 md:mb-24">
        {/* 배경 타이틀 태블릿 및. 모바일 대응 */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-secondary italic tracking-tighter opacity-5 absolute left-1/2 -top-4 sm:-top-6 md:-top-8 lg:-top-12 -translate-x-1/2 select-none whitespace-nowrap">
          FC SEOUL MATCHES
        </h1>

        {/* 메인 타이틀 반응형 크기 조절 */}
        <h2 className="relative text-3xl sm:text-4xl md:text-6xl font-black text-secondary leading-tight uppercase">
          경기 일정 <span className="text-primary italic">.</span>
        </h2>

        <div className="mt-4 flex items-center justify-center gap-2 md:gap-3">
          <div className="h-px w-8 md:w-12 bg-border"></div>
          <Typography
            variant="body-md"
            color="text-textSub"
            className="text-xs md:text-base font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase">
            {currentYear} SEASON — {currentMonth}월
          </Typography>
          <div className="h-px w-8 md:w-12 bg-border"></div>
        </div>
      </div>

      {/* 달력 날짜 넘기기 & 오늘, 경기일 표시 */}
      {/* 조작부 모바일 배치(세로 정렬) 지원 */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 sm:gap-0 mt-10 mb-6 px-2">
        <div className="flex items-center text-xl md:text-3xl font-bold gap-4 md:gap-5">
          {/* DONE: 이전, 다음 버튼으로 바꾸기 */}
          <button
            onClick={handlePrev}
            className="p-1 hover:text-main transition-colors font-medium cursor-pointer">
            <MdOutlineArrowBackIos className="hover:text-primary transition-colors font-medium cursor-pointer text-xl md:text-2xl" />
          </button>
          {/* DONE: 연도와 월을 select 할 수 있게 바꾸기 */}
          <div className="flex items-center gap-4">
            {/* 연도 */}
            <div className="relative flex items-center gap-1 md:gap-2 group cursor-pointer">
              <select
                value={currentYear}
                onChange={handleYearChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full">
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
              <span className="text-lg md:text-3xl">{currentYear}</span>
              <span className="text-[8px] md:text-[10px] align-top group-hover:text-primary transition-colors">
                ▼
              </span>
            </div>
            {/* 월 */}
            <div className="relative flex items-center gap-1 md:gap-2 group cursor-pointer">
              <select
                value={currentMonth}
                onChange={handleMonthChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full">
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
              <span className="text-lg md:text-3xl">{currentMonth}</span>
              <span className="text-[8px] md:text-[10px] align-top group-hover:text-primary transition-colors">
                ▼
              </span>
            </div>
          </div>
          <button onClick={handleNext} className="p-1">
            <MdOutlineArrowForwardIos className="hover:text-primary transition-colors font-medium cursor-pointer text-xl md:text-2xl" />
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-sm text-textSub font-medium">
          {/* 오늘 경기 범례 */}
          <div className="flex items-center gap-1 md:gap-1.5">
            <div
              className={`
              w-3 h-3 md:w-5 md:h-5 rounded-sm
              /* 모바일: 테두리만 강조 / 데스크탑: 기본 스타일 */
              border-[1.5px] border-primary md:bg-transparent
            `}></div>
            <span>오늘</span>
          </div>

          {/* 경기일 범례 */}
          <div className="flex items-center gap-1 md:gap-1.5">
            <div
              className={`
              w-3 h-3 md:w-5 md:h-5 rounded-sm border border-textSub
              /* 모바일: 배경 없음 / 데스크탑: bg-subtleGray */
              bg-transparent md:bg-subtleGray
            `}></div>
            <span>경기일</span>
          </div>

          {/* 직관한 경기 범례 */}
          <div className="flex items-center gap-1 md:gap-1.5">
            <div
              className={`
              w-3 h-3 md:w-5 md:h-5 rounded-sm border border-textSub
              /* 공통: bg-line */
              bg-line
            `}></div>
            <span>직관한 경기</span>
          </div>
        </div>
      </div>

      {/* 데스크탑 캘린더 뷰 (md 이상 노출) */}
      <div className="hidden md:block w-full">
        <FullCalendar
          ref={calendarRef} // ref 연결
          initialView="dayGridMonth" // 처음에 보여줄 뷰 모드
          plugins={[dayGridPlugin, interactionPlugin]} // 사용할 플러그인
          events={events} // 변환한 데이터 넣어줌
          locale="ko"
          headerToolbar={false} // 헤더 커스텀을 위해 기본값은 없애기
          height="auto"
          fixedWeekCount={false} // 달력이 이번달만 나오게끔
          showNonCurrentDates={false}
          // 요일
          dayHeaderContent={(args) => {
            const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
            return days[args.date.getDay()];
          }}
          // 날짜
          dayCellContent={(args) => {
            return args.date.getDate();
          }}
          // DONE: 해당 날짜에 이벤트가 있는지 확인하고 배경색을 다르게 적용
          dayCellClassNames={(args) => {
            const offset = args.date.getTimezoneOffset() * 60000;
            const dateDefault = new Date(args.date.getTime() - offset);
            const dateStr = dateDefault.toISOString().split("T")[0];

            // 경기가 있는 날
            const matchEvent = events.find((e) => e.start === dateStr);
            if (matchEvent) {
              if (matchEvent.extendedProps.isAttended) {
                return "attended-day-bg"; // 직관한 날 클래스
              }
              return "match-day-bg "; // 경기일 클래스
            }
            const hasMatch = events.some((e) => e.start === dateStr);
            return hasMatch ? "match-day-bg" : "";
          }}
          eventContent={(arg) => {
            const gameData = arg.event.extendedProps as Game;
            const isFuture = new Date(arg.event.startStr) > new Date();
            const isAttended = gameData.isAttended;

            {
              /* DONE: gameData.opponent 에 맞춰서 맞는 로고 넣기 */
            }
            const opponentTeam = FC_TEAMS.find(
              (fc) => fc.location === gameData.opponent,
            );

            return (
              // DONE: 오늘 날짜 이후는 클릭 방지
              <div
                className={`flex flex-col items-center justify-center w-full px-1
                  transition-transform ${
                    // 미래 경기이거나 이미 기록한 경기면 커서만 기본으로 변경
                    isFuture || isAttended
                      ? "cursor-default"
                      : "cursor-pointer hover:scale-105"
                  } ${isFuture ? "opacity-80 grayscale" : "opacity-100"}`}>
                {opponentTeam ? (
                  <img
                    src={opponentTeam.image}
                    alt={`${gameData.opponent} logo`}
                    className="w-12 h-12 md:w-16 md:h-16 object-contain -mt-6 md:-mt-8 mb-1 md:mb-2"
                  />
                ) : (
                  <div className="w-10 h-10 mb-1 bg-gray-100 rounded-full flex items-center justify-center text-[6px]">
                    NO LOGO
                  </div>
                )}

                {/* 시간 정보 렌더링 */}
                <div className="text-[10px] md:text-[11px] font-bold text-textMain">
                  {extractTime(gameData.date)}
                </div>

                {/* 경기장 정보 렌더링 */}
                <div className="text-[10px] text-textSub mt-0.5 md:mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                  {gameData.stadium}
                </div>
              </div>
            );
          }}
          eventClick={(info) => {
            const gameData = info.event.extendedProps as Game;
            const isFuture = new Date(info.event.startStr) > new Date();
            handleGameClick(gameData, isFuture);
          }}
        />
      </div>

      {/* 모바일 세로 리스트 뷰 (md 미만 노출) */}
      <div className="flex md:hidden flex-col gap-3 w-full pb-10">
        {sortedGames.length > 0 ? (
          sortedGames.map((game) => {
            const d = new Date(game.date);
            const gameDate = !isNaN(d.getTime())
              ? d.toISOString().split("T")[0]
              : "";

            const today = new Date();
            const isToday =
              d.getFullYear() === today.getFullYear() &&
              d.getMonth() === today.getMonth() &&
              d.getDate() === today.getDate();
            const isFuture = d > today && !isToday;

            const cardBg = game.isAttended ? "bg-line" : "bg-background";
            const cardBorder = isToday
              ? "border-primary border-[1.5px]"
              : "border-border";

            return (
              <div
                key={game.id}
                onClick={() => handleGameClick(game, isFuture)}
                className={`rounded-xl p-4 flex items-center transition-colors border
                  ${cardBg} ${cardBorder}
                  ${isFuture || game.isAttended ? "opacity-70 cursor-default" : "cursor-pointer active:bg-secondary/10 hover:border-primary"}
                `}>
                {/* 좌측: 너비 고정으로 중앙 정렬 기준점 확보 */}
                <div className="w-21.25 shrink-0 flex flex-col gap-0.5 text-[11px] text-textSub font-medium items-start">
                  <span className="whitespace-nowrap">{`${gameDate.substring(5)} (${getKoreanDay(game.date)})`}</span>
                  <span>{extractTime(game.date)}</span>
                  <span className="truncate w-full text-left">
                    {game.stadium}
                  </span>
                </div>

                {/* 중앙: flex-1과 Opponent 활용 (FC서울 무조건 왼쪽) */}
                <div className="flex-1 flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-textMain px-1">
                  <span className="flex-1 text-right truncate">FC서울</span>
                  <span className="text-primary tracking-wider shrink-0 w-5 text-center">
                    VS
                  </span>
                  <span className="flex-1 text-left truncate">
                    {game.opponent}
                  </span>
                </div>

                {/* 우측: 좌측과 동일한 너비 고정으로 대칭 유지 */}
                <div className="w-21.25 shrink-0 flex justify-end items-center text-[11px] sm:text-xs font-bold">
                  <span className="text-textSub w-10 text-center py-1 bg-subtleGray rounded-md inline-block">
                    {game.round}R
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-sm text-textSub font-medium bg-subtleGray rounded-xl border border-border">
            이번 달 경기 일정이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
