import Heading from "@/components/layout/Heading";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import RoleForm, { IActiveRole, IRoleFormInitialValues } from "../RoleForm";
import { IRoleInitialState } from "@/services/store/role/role.slice";
import { useArchive } from "@/hooks/useArchive";
import { convertRolePermissions } from "../helpers/convertRolePermissions";
import { getRoleById } from "@/services/store/role/role.thunk";
import { useEffect, useRef } from "react";
import { EPageTypes } from "@/shared/enums/page";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { FormikProps } from "formik";

const DetailRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IRoleInitialState>("role");
  const formikRef = useRef<FormikProps<IRoleFormInitialValues>>(null);
  useEffect(() => {
    if (id) dispatch(getRoleById(id));
  }, [id]);
  return (
    <>
      <Heading
        title="Cập nhật vai trò"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/roles");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Lưu",
            icon: <IoSaveOutline className="text-[18px]" />,
            onClick: () => {
              formikRef && formikRef.current && formikRef.current.handleSubmit();
            },
          },
        ]}
      />

      {state.activeRole && <RoleForm type={EPageTypes.UPDATE} formikRef={formikRef} role={state.activeRole as unknown as IActiveRole} />}
    </>
  );
};

export default DetailRole;
