import { useState } from "react";

import { UserList } from "@/features/admin/components/UserList";
import { PostList } from "@/features/admin/components/PostList";
import { BettingManagement } from "@/features/admin/components/BettingManagement";
import { GameManagement } from "@/features/admin/components/GameManagement";
import { PlayerManagement } from "@/features/admin/components/PlayerManagement";



import Typography from "@/components/common/Typography";

const ADMIN_MENUS = [
  { id: "users", label: "회원 관리", component: <UserList /> },
  { id: "post", label: "게시글 관리", component: <PostList /> },
  { id: "game", label: "경기 관리", component: <GameManagement /> },
  { id: "player", label: "선수 관리", component: <PlayerManagement /> },
  { id: "betting", label: "배팅 관리", component: <BettingManagement /> },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const currentContent = ADMIN_MENUS.find((m) => m.id === activeTab)?.component;

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-16 lg:px-24 gap-5">
      <Typography variant="h1">관리자 페이지</Typography>

      <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
        {ADMIN_MENUS.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setActiveTab(menu.id)}
            className={`px-3 sm:px-4 py-1.5 border rounded text-xs sm:text-sm transition ${
              activeTab === menu.id
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-50"
            }`}>
            {menu.label}
          </button>
        ))}
        {activeTab && (
          <button
            onClick={() => setActiveTab(null)}
            className="px-4 py-1.5 text-sm text-gray-400 underline">
            닫기
          </button>
        )}
      </div>

      <div className="min-h-50">
        {currentContent || (
          <p className="text-gray-400">관리할 메뉴를 선택해 주세요.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
