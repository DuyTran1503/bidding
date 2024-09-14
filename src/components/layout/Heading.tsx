import Breadcrumb from "@/components/Breadcrumb";
import Button, { IButtonProps } from "@/components/common/Button";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { EPermissions } from "@/shared/enums/permissions";
import { ReactNode, useMemo, useState } from "react";
import { IModalProps } from "../grid/ManagementGrid";
import { EButtonTypes } from "@/shared/enums/button";

interface IHeadingButton extends IButtonProps {
  permission?: EPermissions;
}

interface IHeadingProps<T> {
  title: string;
  hasBreadcrumb?: boolean;
  buttons?: IHeadingButton[];
  ModalContent?: (props: IModalProps<T>) => ReactNode;
}

export const Heading = <T,>({ hasBreadcrumb, title, buttons = [], ModalContent }: IHeadingProps<T>) => {
  const [modalUpdate, setModalUpdate] = useState(false);
  const [type, setType] = useState<EButtonTypes>(EButtonTypes.CREATE);
  const { state } = useArchive<IAuthInitialState>("auth");

  const handleButtonClick = (type: EButtonTypes) => {
    setType(type);
    setModalUpdate(true);
  };

  const Modal = useMemo(() => ModalContent && <ModalContent type={type} visible={modalUpdate} setVisible={setModalUpdate} />, [modalUpdate]);
  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="display-m-semibold text-black-500">{title}</h3>
          {hasBreadcrumb && <Breadcrumb />}
        </div>

        <div className="flex shrink-0 gap-4">
          {buttons?.map((btn, index) => {
            if (btn.permission) {
              const userPermissions = state.profile?.permissions;
              const canAccess = userPermissions?.includes(btn.permission);
              return canAccess && <Button key={index} handleClick={handleButtonClick} {...btn} />;
            }
            return <Button key={index} {...btn} handleClick={handleButtonClick} />;
          })}
        </div>
      </div>
      {Modal}
    </>
  );
};

export default Heading;
