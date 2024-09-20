import React from "react";
import { Modal, Tooltip } from "antd";
import { HiOutlinePencil } from "react-icons/hi2";
import { IoEyeOutline, IoTrashBinOutline } from "react-icons/io5";
import { EButtonTypes } from "@/shared/enums/button";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { checkPermission } from "@/helpers/checkPermission";
import { MdOutlineCreditScore } from "react-icons/md";

interface IGridButtonsProps {
  buttons: IGridButton[];
  record: { key: string; [key: string]: any };
  onClick?: (item: any, type: EButtonTypes) => void;
}

const { confirm } = Modal;

const GridButtons: React.FC<IGridButtonsProps> = ({ buttons, record, onClick }) => {
  const { state } = useArchive<IAuthInitialState>("auth");

  return (
    <div className="flex items-center justify-center gap-3">
      {buttons.map((button, index) => {
        let canAccess = true;
        if (button.permission) {
          canAccess = checkPermission(state.profile?.permissions, button.permission);
        }
        switch (button.type) {
          case EButtonTypes.VIEW:
            return (
              canAccess && (
                <Tooltip title="Chi tiết" key={index}>
                  <IoEyeOutline
                    className="cursor-pointer text-xl text-blue-500"
                    onClick={() => {
                      button.onClick ? button.onClick(record) : onClick && onClick(record, button.type);
                    }}
                  />
                </Tooltip>
              )
            );
          case EButtonTypes.UPDATE:
            return (
              canAccess && (
                <Tooltip title="Cập nhật" key={index}>
                  <HiOutlinePencil
                    className="cursor-pointer text-xl text-yellow-500"
                    onClick={() => {
                      button.onClick ? button.onClick(record) : onClick && onClick(record, button.type);
                    }}
                  />
                </Tooltip>
              )
            );
          case EButtonTypes.APPROVE:
            return (
              canAccess && (
                <Tooltip title="Phê duyệt" key={index}>
                  <MdOutlineCreditScore
                    className="cursor-pointer text-xl text-green-600"
                    onClick={() => {
                      button.onClick ? button.onClick(record) : onClick && onClick(record, button.type);
                    }}
                  />
                </Tooltip>
              )
            );
          case EButtonTypes.DESTROY:
            return (
              canAccess && (
                <Tooltip title="Xóa" key={index}>
                  <IoTrashBinOutline
                    className="cursor-pointer text-xl text-red-500"
                    onClick={() => {
                      confirm({
                        title: "Xóa",
                        content: "Bạn chắc chắn muốn xóa không?",
                        onOk: () => button.onClick && button.onClick(record),
                      });
                    }}
                  />
                </Tooltip>
              )
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default GridButtons;
