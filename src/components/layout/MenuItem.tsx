import clsx from "clsx";
import { FaCaretUp } from "react-icons/fa";
import { IoPieChartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { IMenuItem } from "./Sidebar";

interface IMenuItemProps extends IMenuItem {
  isOpen?: boolean;
  isActive?: boolean;
  hasChildren?: boolean;
  isChildActive?: boolean;
  isChild?: boolean;
}

const MenuItem = ({
  icon,
  label,
  path,
  onClick,
  isChild = false,
  isActive = false,
  hasChildren = false,
  isChildActive = false,
  isOpen = false,
}: IMenuItemProps) => {
  const navigate = useNavigate();
  const IconComponent = icon?.component;

  return (
    <div
      className={clsx(
        `group relative flex cursor-pointer items-center justify-between bg-white px-6 py-3 transition-colors hover:bg-cyan-50`,
        (isActive || isChildActive) && "!bg-cyan-50",
      )}
      onClick={() => {
        path ? navigate(path) : onClick && onClick();
      }}
    >
      <div
        className={clsx(
          "absolute bottom-0 left-0 top-0 h-full w-1 -translate-x-full bg-cyan-600 transition-transform",
          isActive && "translate-x-0",
        )}
      />

      <div className="flex items-center gap-2">
        {IconComponent && (
          <IconComponent
            className={clsx("text-2xl group-hover:text-cyan-600", icon.className, (isActive || isChildActive || isOpen) && "text-cyan-600")}
          />
        )}
        {isChild && <IoPieChartOutline className="invisible text-2xl" />}
        <span
          className={clsx("font-semibold text-black-400 group-hover:text-cyan-600", (isActive || isChildActive || isOpen) && "text-cyan-600")}
        >
          {label}
        </span>
      </div>
      {hasChildren && (
        <FaCaretUp
          className={clsx(
            "text-lg text-gray-400 transition-transform group-hover:text-cyan-600",
            isChildActive && "text-cyan-600",
            isOpen && "rotate-180 text-cyan-600",
          )}
        />
      )}
    </div>
  );
};

export default MenuItem;
