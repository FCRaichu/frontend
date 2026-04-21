import { useState } from "react";
import type { AdminPost } from "../types/admin";
import { getAllPosts } from "../api/adminApi";

export const useAdminPosts = () => {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      setError("게시글 목록을 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { posts, isLoading, error, fetchPosts };
};