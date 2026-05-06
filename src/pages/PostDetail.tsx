import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/useAuthStore";
import { getGameById } from "@/features/game/api/gameApi";
import { deleteMyRecord, getRecordById } from "@/features/post/api/postApi";
import ImageSlider from "@/features/post/components/detail/ImageSlider";
import MatchInfo from "@/features/post/components/detail/MatchInfo";
import Typography from "@/components/common/Typography";

// 아이콘
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";

export default function PostDetail() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userId, postId } = useParams<{ userId: string; postId: string }>();
  const queryClient = useQueryClient();

  // 1. Post 데이터 가져오기
  const { data: postData, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getRecordById(Number(postId)),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
  });

  // 2. Post 데이터를 기반으로 Game 데이터 가져오기 (Dependent Query)
  const { data: gameData, isLoading: isGameLoading } = useQuery({
    queryKey: ["game", postData?.gameId],
    queryFn: () => getGameById(postData.gameId),
    enabled: !!postData?.gameId, // postData.gameId가 있을 때만 실행
    staleTime: 1000 * 60 * 60 * 2,
  });

  // 3. 삭제 Mutation
  const { mutate: deletePost } = useMutation({
    mutationFn: () => deleteMyRecord(Number(postId)),
    onSuccess: () => {
      alert("삭제되었습니다.");
      // 쿼리를 무효화하여 목록을 업데이트
      queryClient.invalidateQueries({ queryKey: ["myPosts", Number(userId)] }); // 내 포스트 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["ranking"] }); // 랭킹 전체 갱신
      navigate(-1);
    },
    onError: () => {
      alert("삭제에 실패했습니다.");
    },
  });

  // 삭제 핸들러
  const handleDelete = () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      deletePost();
    }
  };

  // 수정 핸들러
  const handleEdit = () => {
    navigate(`/post/edit/${postId}`, { state: { postData } });
  };

  if (isPostLoading || isGameLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full h-[calc(100vh-64px)] bg-card overflow-hidden">
      <div className="w-1/2 h-full flex flex-col overflow-hidden">
        {/* 상단 경기 정보는 스크롤 없이 "고정"!! */}
        {gameData && (
          <div className="shrink-0">
            <MatchInfo
              date={gameData.date}
              opponent={gameData.opponent}
              stadium={gameData.stadium}
              result={[gameData.homeScore, gameData.awayScore]}
            />
          </div>
        )}

        {/* 본문 전체를 감싸는 상대 위치(relative) 컨테이너 */}
        <div className="relative flex flex-col h-full pb-10 px-24 overflow-hidden">
          {/* 본문 내용만 스크롤!! */}
          <div
            className="flex-1 overflow-y-auto scrollbar-hide pt-20 pb-10 
                      mask-[linear-gradient(to_bottom,transparent_15%,black_20%,black_98%,transparent_100%)]">
            {postData && (
              <div className="flex flex-col gap-20">
                <Typography variant="h1" color="text-secondary">
                  {postData?.title}
                </Typography>

                <Typography
                  variant="body-lg"
                  color="font-medium! text-secondary"
                  className="whitespace-pre-wrap leading-relaxed">
                  {postData?.content}
                </Typography>
              </div>
            )}
          </div>

          {/* 이전으로 버튼도 고정!! */}
          <div className="shrink-0 flex items-center justify-between mt-8 border-t border-border pt-6">
            {/* 왼쪽: 이전으로 */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-disabledGray hover:text-secondary transition-colors font-bold text-lg cursor-pointer">
              <span className="text-xl">←</span> 이전으로
            </button>

            {String(user?.id) === String(userId) && (
              <div className="flex items-center gap-6">
                <button
                  onClick={handleEdit}
                  className="text-disabledGray hover:text-primary transition-colors font-bold text-lg cursor-pointer">
                  <FiEdit className="font-bold" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-disabledGray hover:text-primary transition-colors font-bold text-lg cursor-pointer">
                  <MdOutlineDeleteForever className="text-2xl" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 우측 이미지 슬라이더 */}
      {postData && (
        <div className="w-1/2 h-full overflow-hidden">
          <ImageSlider images={postData.images} />
        </div>
      )}
    </div>
  );
}
