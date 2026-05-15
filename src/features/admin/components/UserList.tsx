import { useEffect } from "react";
import { useAdminUsers } from "../hooks/useAdminUsers";

export const UserList = () => {
  const { users, isLoading, fetchUsers } = useAdminUsers();

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) return <p>로딩 중...</p>;

  // 통계 계산
  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount = users.filter((u) => u.role === "USER").length;

  return (
    <div className="flex flex-col gap-4">
      {/* 통계 뱃지 */}
      <div className="flex gap-2 text-sm">
        <span className="px-3 py-1 bg-gray-100 rounded">
          전체 <span className="font-bold">{totalCount}</span>명
        </span>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded">
          일반 <span className="font-bold">{userCount}</span>명
        </span>
        <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded">
          관리자 <span className="font-bold">{adminCount}</span>명
        </span>
      </div>

      {/* 기존 테이블 */}
      <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">닉네임</th>
            <th className="border p-2">역할</th>
            <th className="border p-2">포인트</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.nickname}</td>
              <td className="border p-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    user.role === "ADMIN"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                  {user.role}
                </span>
              </td>
              <td className="border p-2">{user.points.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};