import { ReactNode } from "react";
import clsx from "clsx";
import { EButtonTypes } from "@/shared/enums/button";

export interface IButtonProps {
  type?: "primary" | "ghost" | "secondary" | "third";
  text: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  size?: "full";
  onClick?: () => void;
  className?: string;
  handleClick?: (typeButton: EButtonTypes) => void;
  kind?: "submit" | "reset" | "button" | undefined;
}

const Button = ({
  type = "primary",
  text,
  isDisabled = false,
  isLoading = false,
  icon,
  size,
  className,
  onClick,
  handleClick,
  kind,
}: IButtonProps) => {
  const typeClass = {
    primary: "text-cyan-600 border border-cyan-600 hover:bg-cyan-600 hover:text-white",
    ghost: "text-cyan-600 bg-cyan-50 hover:bg-cyan-600 hover:text-white",
    secondary: "text-[#dc2626] border border-[#dc2626] hover:bg-[#dc2626]",
    third: "text-[#d19b3d] border border-[#d19b3d] hover:bg-[#a87722]",
  };

  const typeLoading = {
    primary: "border-black border-t-cyan-600 ",
    ghost: "border-cyan-600 border-t-cyan-50",
    secondary: "border-gray-400 border-t-black",
    third: "border-black border-[#d19b3d] ",
  };
  return (
    <button
      type={kind}
      onClick={() => (onClick && !isDisabled && !isLoading ? onClick() : handleClick && handleClick(EButtonTypes.CREATE))}
      className={clsx(
        "flex items-center justify-center gap-1 rounded-[8px] px-[10px] py-[5px] font-semibold leading-[22px] transition-opacity",
        typeClass[type],
        className,
        {
          "cursor-not-allowed opacity-65": isDisabled,
          "opacity-65": isLoading,
          "cursor-pointer hover:text-gray-50": !isDisabled && !isLoading,
        },
        size === "full" && "w-full",
      )}
    >
      {isLoading ? <div className={clsx(`${typeLoading[type]} h-4 w-4 animate-spin rounded-full border-2`)} /> : icon}
      {text}
    </button>
  );
};

export default Button;
