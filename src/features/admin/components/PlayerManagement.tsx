import { useEffect, useState } from "react";
import { useAdminPlayers } from "../hooks/useAdminPlayers";
import { PlayerForm } from "./PlayerForm";
import type {
  AdminPlayer,
  PlayerPosition,
  PlayerStatus,
} from "../types/admin";

type Mode = "none" | "create" | "edit";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const statusLabel = (s: string) => {
  switch (s) {
    case "ACTIVE":
      return "현역";
    case "LOAN":
      return "임대";
    case "DEPARTED":
      return "떠남";
    default:
      return s;
  }
};

export const PlayerManagement = () => {
  const {
    players,
    selectedPlayer,
    isLoading,
    isSubmitting,
    error,
    fetchPlayers,
    selectPlayer,
    clearSelection,
    handleCreate,
    handleUpdate,
  } = useAdminPlayers();

  const [mode, setMode] = useState<Mode>("none");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const onClickRow = (player: AdminPlayer) => {
    selectPlayer(player);
    setMode("edit");
  };

  const onClickNew = () => {
    clearSelection();
    setMode("create");
  };

  const onCancel = () => {
    clearSelection();
    setMode("none");
  };

  const onSubmit = async (formData: {
    name: string;
    backNumber: number;
    position: PlayerPosition;
    status: PlayerStatus;
    image?: File;
  }) => {
    if (mode === "create") {
      if (!formData.image) {
        alert("이미지는 필수입니다.");
        return;
      }
      const ok = await handleCreate({
        name: formData.name,
        backNumber: formData.backNumber,
        position: formData.position,
        status: formData.status,
        image: formData.image,
      });
      if (ok) {
        alert("선수가 생성되었습니다.");
        setMode("none");
      }
    } else if (mode === "edit" && selectedPlayer) {
      const ok = await handleUpdate(selectedPlayer.id, {
        name: formData.name,
        backNumber: formData.backNumber,
        position: formData.position,
        status: formData.status,
        image: formData.image,
      });
      if (ok) {
        alert("선수 정보가 수정되었습니다.");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 좌측: 선수 목록 */}
      <section className="flex-1 lg:max-w-[60%]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">선수 목록</h2>
          <button
            type="button"
            onClick={onClickNew}
            className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50">
            + 새 선수
          </button>
        </div>

        {isLoading ? (
          <p>로딩 중...</p>
        ) : players.length === 0 ? (
          <p className="text-gray-400">등록된 선수가 없습니다.</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto border rounded">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="border-b p-2">사진</th>
                  <th className="border-b p-2">#</th>
                  <th className="border-b p-2">이름</th>
                  <th className="border-b p-2">포지션</th>
                  <th className="border-b p-2">상태</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => {
                  const isSelected = selectedPlayer?.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onClickRow(p)}
                      className={`text-center cursor-pointer hover:bg-gray-50 ${
                        isSelected ? "bg-blue-50" : ""
                      }`}>
                      <td className="border-b p-1">
                        <img
                          src={`${IMAGE_BASE_URL}${p.image}`}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded mx-auto"
                        />
                      </td>
                      <td className="border-b p-2">{p.backNumber}</td>
                      <td className="border-b p-2">{p.name}</td>
                      <td className="border-b p-2">{p.position}</td>
                      <td className="border-b p-2">{statusLabel(p.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 우측: 폼 */}
      <section className="flex-1 border rounded-lg p-5 bg-white">
        {mode === "none" && (
          <div className="text-gray-400 text-sm text-center py-10">
            목록에서 선수를 선택하거나 <br />
            "+ 새 선수" 버튼을 눌러주세요.
          </div>
        )}

        {mode === "create" && (
          <PlayerForm
            initialPlayer={null}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        )}

        {mode === "edit" && selectedPlayer && (
          <PlayerForm
            initialPlayer={selectedPlayer}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        )}
      </section>

      {error && (
        <div className="fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};