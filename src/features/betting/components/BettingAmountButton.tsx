interface BettingAmountButtonProps {
  label: string;
  onClick: () => void;
  isMax?: boolean;
}

export default function BettingAmountButton({
  label,
  onClick,
  isMax = false,
}: BettingAmountButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm border border-border rounded-lg transition-colors cursor-pointer
        ${
          isMax
            ? "bg-gray-100 font-bold hover:bg-gray-200 active:bg-gray-300"
            : "font-semibold hover:bg-gray-50 active:bg-gray-100"
        }`}>
      {label}
    </button>
  );
}
