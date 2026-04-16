import { useEffect } from "react";
import { useAdminUsers } from "../hooks/useAdminUsers";

export const UserList = () => {
  const { users, isLoading, fetchUsers } = useAdminUsers();

  // 컴포넌트가 나타나면 바로 데이터 페치
  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="border p-2">ID</th>
          <th className="border p-2">아이디</th>
          <th className="border p-2">닉네임</th>
          <th className="border p-2">포인트</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="text-center">
            <td className="border p-2">{user.id}</td>
            <td className="border p-2">{user.userId}</td>
            <td className="border p-2">{user.nickname}</td>
            <td className="border p-2">{user.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
