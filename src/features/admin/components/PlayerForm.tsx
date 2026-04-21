import { useEffect, useState } from "react";
import type {
  AdminPlayer,
  PlayerPosition,
  PlayerStatus,
} from "../types/admin";

interface Props {
  initialPlayer: AdminPlayer | null;
  isSubmitting: boolean;
  onSubmit: (formData: {
    name: string;
    backNumber: number;
    position: PlayerPosition;
    status: PlayerStatus;
    image?: File;
  }) => void;
  onCancel?: () => void;
}

const POSITIONS: PlayerPosition[] = ["FW", "MF", "DF", "GK"];
const STATUSES: { value: PlayerStatus; label: string }[] = [
  { value: "ACTIVE", label: "현역" },
  { value: "LOAN", label: "임대" },
  { value: "DEPARTED", label: "팀 떠남" },
];

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const PlayerForm = ({
  initialPlayer,
  isSubmitting,
  onSubmit,
  onCancel,
}: Props) => {
  const [name, setName] = useState("");
  const [backNumber, setBackNumber] = useState("");
  const [position, setPosition] = useState<PlayerPosition>("FW");
  const [status, setStatus] = useState<PlayerStatus>("ACTIVE");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const isEditMode = !!initialPlayer;

  useEffect(() => {
    if (initialPlayer) {
      setName(initialPlayer.name);
      setBackNumber(String(initialPlayer.backNumber));
      setPosition(initialPlayer.position);
      setStatus(initialPlayer.status as PlayerStatus);
      setImageFile(null);
      // 기존 이미지 미리보기 (상대 경로니까 base URL 붙임)
      setPreview(
        initialPlayer.image ? `${IMAGE_BASE_URL}${initialPlayer.image}` : null,
      );
    } else {
      setName("");
      setBackNumber("");
      setPosition("FW");
      setStatus("ACTIVE");
      setImageFile(null);
      setPreview(null);
    }
  }, [initialPlayer]);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!name || !backNumber) {
      alert("이름과 등번호는 필수입니다.");
      return;
    }
    if (!isEditMode && !imageFile) {
      alert("선수 생성 시 이미지는 필수입니다.");
      return;
    }

    onSubmit({
      name,
      backNumber: Number(backNumber),
      position,
      status,
      image: imageFile ?? undefined,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold">
        {isEditMode ? `선수 #${initialPlayer.id} 수정` : "새 선수 추가"}
      </h3>

      {/* 이미지 */}
      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium">선수 사진</span>
        <div className="flex gap-3 items-start">
          <div className="w-24 h-24 border rounded bg-gray-100 overflow-hidden flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="미리보기"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-xs">미리보기</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="flex-1 text-xs"
          />
        </div>
        {isEditMode && (
          <span className="text-xs text-gray-400">
            이미지 변경하지 않으면 기존 이미지가 유지됩니다.
          </span>
        )}
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">이름</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-2 py-1.5"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">등번호</span>
        <input
          type="number"
          min={0}
          value={backNumber}
          onChange={(e) => setBackNumber(e.target.value)}
          className="border rounded px-2 py-1.5"
        />
      </label>

      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium">포지션</span>
        <div className="flex gap-2">
          {POSITIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPosition(p)}
              className={`flex-1 py-1.5 border rounded text-sm ${
                position === p
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-50"
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium">상태</span>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatus(s.value)}
              className={`flex-1 py-1.5 border rounded text-sm ${
                status === s.value
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-50"
              }`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-black text-white py-2 rounded disabled:opacity-50">
          {isSubmitting ? "처리 중..." : isEditMode ? "수정 저장" : "선수 생성"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 border py-2 rounded disabled:opacity-50">
            취소
          </button>
        )}
      </div>
    </div>
  );
};