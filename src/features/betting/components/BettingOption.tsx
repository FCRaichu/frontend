interface BettingOptionProps {
  type: "win" | "draw" | "lose"; // 타입 추가
  label: "승리" | "무승부" | "패배";
  amount: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function BettingOption({
  type, // 이제 interface와 일치합니다.
  label,
  amount,
  isSelected,
  onClick,
}: BettingOptionProps) {
  // label 대신 type을 키로 사용하면 훨씬 명확합니다. (원하신다면 label을 키로 쓰셔도 됩니다)
  const theme = {
    win: {
      active: "border-primary bg-light text-primary",
      hover: "hover:border-disabled hover:bg-gray-50",
      amountColor: isSelected ? "text-primary" : "text-textSub",
    },
    draw: {
      active: "border-textSub bg-gray-100 text-gray-800",
      hover: "hover:border-gray-300 hover:bg-gray-50",
      amountColor: "text-textSub",
    },
    lose: {
      active: "border-blue-600 bg-blue-50 text-blue-700",
      hover: "hover:border-blue-300 hover:bg-gray-50",
      amountColor: isSelected ? "text-blue-600" : "text-textSub",
    },
  }[type];

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center py-6 rounded-xl border-2 transition-all ${
        isSelected ? theme.active : `border-border text-gray-800 ${theme.hover}`
      }`}>
      <span className="text-xl font-bold mb-2">{label}</span>
      <span className={`text-sm ${theme.amountColor}`}>
        누적 {amount.toLocaleString()} P
      </span>
    </button>
  );
}
