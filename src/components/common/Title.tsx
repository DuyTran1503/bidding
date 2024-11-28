import clsx from "clsx";
import { ReactNode } from "react";
import { FaCaretRight } from "react-icons/fa";

export interface ITitleProps {
  children: ReactNode;
  className?: string;
}

const Title = ({ children, className }: ITitleProps) => {
  return (
      <h2 className={clsx("flex items-center border-b border-blue-500 pb-2", className)}>
        <div className="relative inline-flex items-center">
          <FaCaretRight className="text-sm text-red-500" />
          <div className="text-xl font-semibold uppercase tracking-wide text-blue-500">{children}</div>{" "}
          <div className="absolute -bottom-2 left-0 right-0 w-full border-2 border-blue-500"></div>
        </div>
      </h2>
  );
};

export default Title;
