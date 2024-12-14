import React, { useState } from "react";
import { Modal, Tooltip } from "antd";
import { HiOutlinePencil } from "react-icons/hi2";
import { IoEyeOutline, IoTrashBinOutline } from "react-icons/io5";
import { EButtonTypes } from "@/shared/enums/button";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { checkPermission } from "@/helpers/checkPermission";
import { MdInsertChart, MdOutlineCreditScore } from "react-icons/md";
import { PiDotsThreeVerticalBold } from "react-icons/pi"; // Thêm import cho biểu tượng 3 chấm

interface IGridButtonsProps {
  buttons: IGridButton[];
  record: { key: string; [key: string]: any };
  onClick?: (item: any, type: EButtonTypes) => void;
  isManyAction?: boolean;
}

const { confirm } = Modal;

const GridButtons: React.FC<IGridButtonsProps> = ({ buttons, record, onClick, isManyAction }) => {
  const { state } = useArchive<IAuthInitialState>("auth");
  const [showActions, setShowActions] = useState(false);

  const renderButton = (button: IGridButton, index: number) => {
    let canAccess = true;
    if (button.permission) {
      canAccess = checkPermission(state.profile?.permissions, button.permission);
    }

    if (!canAccess) return null;

    switch (button.type) {
      case EButtonTypes.VIEW:
        return (
          <Tooltip title="Chi tiết" key={index}>
            <IoEyeOutline
              className="cursor-pointer text-xl text-blue-500"
              onClick={() => {
                button.onClick ? button.onClick(record) : onClick && onClick(record, button.type);
              }}
            />
          </Tooltip>
        );
      case EButtonTypes.UPDATE:
        return (
          <Tooltip title="Cập nhật" key={index}>
            <HiOutlinePencil
              className="cursor-pointer text-xl text-yellow-500"
              onClick={() => {
                button.onClick ? button.onClick(record) : onClick && onClick(record, button.type);
              }}
            />
          </Tooltip>
        );
      case EButtonTypes.APPROVE:
        return (
          <Tooltip title="Phê duyệt" key={index}>
            <MdOutlineCreditScore
              className="cursor-pointer text-xl text-green-600"
              onClick={() => {
                button.onClick ? button.onClick(record) : onClick && onClick(record, button.type);
              }}
            />
          </Tooltip>
        );
      case EButtonTypes.DESTROY:
        return (
          <Tooltip title="Xóa" key={index}>
            <IoTrashBinOutline
              className="cursor-pointer text-xl text-red-500"
              onClick={() => {
                confirm({
                  title: "Xóa",
                  content: "Bạn chắc chắn muốn xóa không?",
                  okText: "Xác nhận",
                  cancelText: "Hủy",
                  okButtonProps: {
                    style: {
                      backgroundColor: "#0891b2", // Màu xanh
                      color: "#fff",
                    },
                    onMouseEnter: (e) => {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = "#05718e"; // Màu xanh đậm hơn khi hover
                    },
                    onMouseLeave: (e) => {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = "#0891b2"; // Màu gốc
                    },
                  },
                  cancelButtonProps: {
                    style: {
                      backgroundColor: "#f0f0f0", // Màu xám nhạt
                      borderColor: "#d9d9d9",
                      color: "#000",
                      transition: "background-color 0.3s ease", // Hiệu ứng hover
                    },
                    onMouseEnter: (e) => {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = "#d9d9d9"; // Màu khi hover
                    },
                    onMouseLeave: (e) => {
                      const target = e.target as HTMLElement;
                      target.style.backgroundColor = "#f0f0f0"; // Màu gốc
                    },
                  },
                  onOk: () => button.onClick && button.onClick(record),
                });
              }}
            />
          </Tooltip>
        );
      case EButtonTypes.STATISTICAL:
        return (
          <Tooltip title="Thống kê" key={index}>
            <MdInsertChart
              className="cursor-pointer text-xl text-green-600"
              onClick={() => {
                button.onClick ? button.onClick(record) : onClick && onClick(record, button.type);
              }}
            />
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {isManyAction ? (
        <div
          className="relative flex flex-col items-center justify-center"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(true)}
        >
          <PiDotsThreeVerticalBold className="cursor-pointer text-xl" />
          {showActions && (
            <div className="absolute z-10 flex gap-3 bg-white p-2 shadow-lg">{buttons.map((button, index) => renderButton(button, index))}</div>
          )}
        </div>
      ) : (
        buttons.map((button, index) => renderButton(button, index))
      )}
    </div>
  );
};

export default GridButtons;
