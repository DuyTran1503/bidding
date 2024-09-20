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
    primary: "text-primary-600 border border-primary-500 hover:bg-primary-600 ",
    ghost: "text-primary-500 bg-primary-50",
    secondary: "text-[#ff460b] border border-[#ff460b] hover:bg-[#f33d07]",
    third: "text-[#d19b3d] border border-[#d19b3d] hover:bg-[#a87722]",
  };

  const typeLoading = {
    primary: "border-black border-t-primary-500 ",
    ghost: "border-primary-500 border-t-primary-50",
    secondary: "border-gray-400 border-t-black",
    third: "border-black border-[#d19b3d] ",
  };
  return (
    <button
      type={kind}
      onClick={() => (onClick && !isDisabled && !isLoading ? onClick() : handleClick && handleClick(EButtonTypes.CREATE))}
      className={clsx(
        "flex items-center justify-center gap-1 rounded-[8px] px-[12px] py-[7px] font-semibold leading-[22px] transition-opacity",
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
