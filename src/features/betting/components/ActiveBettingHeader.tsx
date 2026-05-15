import Typography from "@/components/common/Typography";
import FCSeoulLogo from "@/assets/fcseoul_logo.png";
import { FC_TEAMS } from "@/data/fc_teams";
import { formatGameDateTime } from "@/utils/formatDate";

interface ActiveBettingHeaderProps {
  gameDate: string;
  opponent: string;
}

export default function ActiveBettingHeader({
  gameDate,
  opponent,
}: ActiveBettingHeaderProps) {
  const { formattedDate, formattedTime } = formatGameDateTime(gameDate);

  const opponentData = (opponent: string) => {
    return FC_TEAMS.find(
      (t) => t.team.includes(opponent) || t.location.includes(opponent),
    );
  };

  return (
    <>
      <div className="w-full bg-[linear-gradient(99.45deg,#910F14_29.82%,#180000_60.5%)] text-white p-5 sm:p-8 md:p-10 shadow-md flex justify-center items-center gap-6 sm:gap-10 md:gap-16 relative overflow-hidden">
        <div className="flex flex-col items-center gap-2 md:gap-3 z-10">
          <div className="flex items-center justify-center">
            <img src={FCSeoulLogo} alt="fc seoul logo" className="h-14 sm:h-18 md:h-24" />
          </div>
          <Typography variant="h3" color="white" className="text-sm sm:text-base md:text-lg">
            FC 서울
          </Typography>
        </div>

        {/* 경기 정보 */}
        <div className="flex flex-col items-center z-10 text-center">
          <Typography
            variant="body-sm"
            color="text-disabled"
            className="font-semibold! tracking-wider mb-1 text-xs sm:text-sm">
            {formattedDate}
          </Typography>
          <Typography variant="h1" color="white" className="mb-2 md:mb-3 text-xl sm:text-2xl md:text-3xl">
            {formattedTime}
          </Typography>
          <Typography
            variant="body-xs"
            color="white"
            className="px-2 md:px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
            진행 중
          </Typography>
        </div>

        <div className="flex flex-col items-center gap-2 md:gap-3 z-10">
          <div className="flex items-center justify-center">
            <img
              src={opponentData(opponent)?.image}
              alt="fc seoul logo"
              className="h-14 sm:h-18 md:h-24"
            />
          </div>
          <Typography variant="h3" color="white" className="text-sm sm:text-base md:text-lg">
            {opponentData(opponent)?.team}
          </Typography>
        </div>
      </div>
    </>
  );
}
