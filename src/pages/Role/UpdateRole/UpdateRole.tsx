import { useArchive } from "@/hooks/useArchive";
import Heading from "@/components/layout/Heading";
import { IRoleInitialState, resetStatus, setData } from "@/services/store/role/role.slice";
import { getRoleById } from "@/services/store/role/role.thunk";
import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoleForm, { IActiveRole, IRoleFormInitialValues } from "../RoleForm";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { FormikProps } from "formik";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EPageTypes } from "@/shared/enums/page";

const UpdateRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IRoleInitialState>("role");

  const formikRef = useRef<FormikProps<IRoleFormInitialValues>>(null);

  useFetchStatus({
    module: "role",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/roles",
      },
      error: {
        message: state.message,
      },
    },
  });

  const memoizedDispatch = useCallback(dispatch, []);

  useEffect(() => {
    if (id) memoizedDispatch(getRoleById(id));
    return () => {
      memoizedDispatch(setData());
    };
  }, [JSON.stringify(id), memoizedDispatch]);

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

export default UpdateRole;
