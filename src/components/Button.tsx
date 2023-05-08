import { type ReactNode } from "react";

export default function Button({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`gap-1 flex disabled:(opacity-50 cursor-not-allowed) rounded border-2 border-gray-400 bg-white px-3 py-2 hover:bg-gray-200 active:bg-gray-300 
      `}
    >
      {children}
    </button>
  );
}
