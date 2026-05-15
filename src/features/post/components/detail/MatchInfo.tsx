import React from "react";
import Typography from "@/components/common/Typography";
import FCSeoulLogo from "@/assets/fcseoul_logo.png";
import { FC_TEAMS } from "@/data/fc_teams";
import { formatGameDateTime } from "@/utils/formatDate";

interface MatchInfoProps {
  date: string;
  opponent: string;
  stadium: string;
  result: [number, number];
}

const MatchInfo: React.FC<MatchInfoProps> = ({
  date,
  opponent,
  stadium,
  result,
}) => {
  const { formattedDate, formattedTime } = formatGameDateTime(date);

  const opponentData = (opponent: string) => {
    return FC_TEAMS.find(
      (t) => t.team.includes(opponent) || t.location.includes(opponent),
    );
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 md:px-16 lg:px-24 py-5 md:py-8 lg:py-10 bg-background border-b-2 border-subtleGray">
      {/* Home Team (FC 서울) */}
      <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3 z-10">
        <div className="flex items-center justify-center">
          <img
            src={FCSeoulLogo}
            alt="fc seoul logo"
            className="h-12 sm:h-16 md:h-20 lg:h-24 object-contain"
          />
        </div>
        <Typography variant="body-sm" color="text-disabledGray" className="text-xs md:text-sm hidden sm:block">
          FC 서울
        </Typography>
      </div>

      {/* 경기 정보 */}
      <div className="flex flex-1 justify-between items-center px-3 sm:px-6 md:px-10 lg:px-16">
        <Typography
          variant="display"
          color="text-secondary"
          className="font-bold! italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          {result[0]}
        </Typography>
        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <Typography
            variant="body-xs"
            color="text-disabledGray"
            className="px-2 md:px-3 py-1 rounded-full border text-xs hidden sm:block">
            {stadium}
          </Typography>
          <Typography
            variant="h2"
            color="text-secondary"
            className="font-extrabold text-sm sm:text-base md:text-lg lg:text-xl text-center">
            {formattedDate}
          </Typography>
          <Typography variant="body-sm" color="text-disabledGray" className="text-xs md:text-sm">
            {formattedTime}
          </Typography>
        </div>
        <Typography
          variant="display"
          color="text-secondary"
          className="font-bold! italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          {result[1]}
        </Typography>
      </div>

      {/* 상대 팀 */}
      <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3 z-10">
        <div className="flex items-center justify-center">
          <img
            src={opponentData(opponent)?.image}
            alt={`${opponent} logo`}
            className="h-12 sm:h-16 md:h-20 lg:h-24 object-contain"
          />
        </div>
        <Typography
          variant="body-sm"
          color="text-disabledGray"
          className="whitespace-nowrap text-xs md:text-sm hidden sm:block">
          {opponentData(opponent)?.team}
        </Typography>
      </div>
    </div>
  );
};

export default MatchInfo;
