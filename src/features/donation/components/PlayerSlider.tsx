import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllActivePlayers } from "../api/player";
import type { Player } from "@/features/donation/types/donation";
import SupportModal from "./SupportModal";

<<<<<<< HEAD:src/components/donation/PlayerSlider.tsx
=======
// Swiper 설정
>>>>>>> 61c734867b99efe7e50a3cac5ace71f6f7bd4e66:src/features/donation/components/PlayerSlider.tsx
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const swiperStyle = `
  .continuous-swiper .swiper-wrapper {
    transition-timing-function: linear !important;
  }

  /* 이미지 뜨는 애니메이션 */
  .player-img {
    opacity: 0;
    transform: translateY(20px) scale(1.05);
    transition: 
      opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1),
      transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1),
      filter 0.8s ease-out;
    filter: blur(8px);
  }
  
  .player-img.loaded {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
`;

// 카드 컴포넌트 분리
function PlayerCard({
  player,
  onClick,
}: {
  player: Player;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="relative aspect-3/4 cursor-pointer overflow-hidden group 
        shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] 
        transition-all duration-500"
    >
      {/* 이미지 */}
      <img
        src={`${import.meta.env.VITE_IMAGE_BASE_URL}${player.image}`}
        alt={player.name}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`player-img ${loaded ? "loaded" : ""} w-full h-full object-cover group-hover:scale-110`}
        draggable={false}
      />

      {/* 오버레이 텍스트 */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-row items-end justify-between p-6">
        <div className="flex flex-col">
          <span className="text-primary font-black text-xl mb-1 italic">
            NO.{player.backNumber}
          </span>
          <p className="text-white text-2xl font-black uppercase leading-tight">
            {player.name}
          </p>
          <div className="h-1 w-0 group-hover:w-full bg-primary transition-all duration-500 mt-2" />
        </div>

        {player.userRank && Object.keys(player.userRank).length > 0 && (
          <div className="flex flex-col items-end gap-1 mb-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Top Supporters
            </p>
            {Object.entries(player.userRank)
              .slice(0, 3)
              .map(([rankKey, userName], index) => (
                <div
                  key={rankKey}
                  className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-sm border-l-2 border-primary"
                >
                  <span className="text-primary font-black text-xs italic">
                    {index + 1}ST
                  </span>
                  <span className="text-white text-xs font-medium truncate max-w-20">
                    {userName !== "null" ? userName : "___"}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlayerSlider() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

<<<<<<< HEAD:src/components/donation/PlayerSlider.tsx
  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await getAllActivePlayers();
        if (res.status === 200) {
          setPlayers(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchPlayer();
  }, []);
=======
  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ["activePlayers"],
    queryFn: getAllActivePlayers,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
>>>>>>> 61c734867b99efe7e50a3cac5ace71f6f7bd4e66:src/features/donation/components/PlayerSlider.tsx

  return (
    <div className="w-full py-10">
      <style>{swiperStyle}</style>
      {players.length > 0 ? (
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1.5}
          breakpoints={{
            640: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4.5 },
          }}
          spaceBetween={30}
          loop={true}
          freeMode={true}
          speed={6000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          loopAdditionalSlides={5}
          allowTouchMove={true}
          observer={true}
          className="continuous-swiper"
        >
          {players.map((player) => (
            <SwiperSlide key={player.id}>
              <PlayerCard
                player={player}
                onClick={() => setSelectedPlayer(player)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="h-100 w-full" />
      )}

      {selectedPlayer && (
        <SupportModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}