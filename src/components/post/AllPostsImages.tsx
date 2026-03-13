import { MONTH_NAMES } from "@/data/date";
import { useAuthStore } from "@/stores/useAuthStore";
import Typography from "@/styles/common/Typography";
import type { Post } from "@/types/post";
import { useNavigate } from "react-router-dom";

interface Props {
  posts: Post[];
  observer: IntersectionObserver | null;
}

export default function AllPostsImages({ posts, observer }: Props) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Ref가 생성될 때 observer 등록
  const setRef = (el: HTMLDivElement | null, year: string) => {
    if (el && observer) {
      el.setAttribute("data-year", year);
      observer.observe(el);
    }
  };

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-56 items-start px-10 pb-40">
      {posts.map((post, index) => {
        const date = new Date(post.createdAt);
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear().toString();

        // 이전 포스트와 비교해서 '월'이 바뀌었는지 확인한다. (첫 번째 포스트도)
        const isFirstMonth =
          index === 0 ||
          new Date(posts[index - 1].createdAt).getMonth() !== currentMonth;

        return (
          <div
            key={post.postId}
            className={`relative flex flex-col`}
            ref={isFirstMonth ? (el) => setRef(el, currentYear) : null}
          >
            {/* 월별 첫 번째 콘텐츠이면 그 위에다가 MONTH 이름 달아주자 */}
            {/* DONE: 라벨 있는 사진과 없는 사진의 레이아웃이 다르다.. */}
            {isFirstMonth && (
              <div className="absolute -top-10 left-0 w-full">
                <Typography
                  variant="label"
                  color="text-secondary"
                  className="tracking-widest"
                >
                  {MONTH_NAMES[currentMonth]}
                </Typography>
              </div>
            )}

            {/* 개별 사진 카드 */}
            <div
              onClick={() =>
                navigate(`/post/${user?.id}/detail/${post.postId}`)
              }
              className="relative group cursor-pointer overflow-hidden bg-line shadow-sm"
              style={{ marginTop: isFirstMonth ? "0" : "0" }}
            >
              <img
                src={post.images?.[0]}
                alt={post.title}
                className="w-52 h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4">
                <span className="text-white text-[10px] font-bold border border-white px-3 py-1 tracking-tighter">
                  VIEW DETAIL
                </span>
                <p className="text-white text-[10px] mt-2 font-medium opacity-80 truncate w-full text-center">
                  {post.title}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
