import { useEffect } from "react";
import { useAdminPosts } from "../hooks/useAdminPosts";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const PostList = () => {
  const { posts, isLoading, error, fetchPosts } = useAdminPosts();

  useEffect(() => {
    fetchPosts();
  }, []);
 
  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (posts.length === 0)
    return <p className="text-gray-400">등록된 게시글이 없습니다.</p>;

  return (
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="border p-2">게시글 ID</th>
          <th className="border p-2">작성자</th>
          <th className="border p-2">경기 ID</th>
          <th className="border p-2">경기 날짜</th>
          <th className="border p-2">작성일</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.postId} className="text-center">
            <td className="border p-2">{post.postId}</td>
            <td className="border p-2">{post.nickname}</td>
            <td className="border p-2">{post.gameId}</td>
            <td className="border p-2">{formatDate(post.date)}</td>
            <td className="border p-2">{formatDate(post.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};