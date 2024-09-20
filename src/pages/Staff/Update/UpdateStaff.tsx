import { useArchive } from "@/hooks/useArchive";
import Heading from "@/components/layout/Heading";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { FormikProps } from "formik";
import useFetchStatus from "@/hooks/useFetchStatus";
import ActionModule, { IStaffFormInitialValues } from "../ActionModule";
import { IAccountInitialState, resetStatus } from "@/services/store/account/account.slice";
import { getStaffById } from "@/services/store/account/account.thunk";
import { EPageTypes } from "@/shared/enums/page";

const UpdateStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IAccountInitialState>("account");
  const formikRef = useRef<FormikProps<IStaffFormInitialValues>>(null);
  useFetchStatus({
    module: "account",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/staffs",
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) dispatch(getStaffById(id));
  }, [id]);
  return (
    <>
      <Heading
        title="Cập nhật tài khoản"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/staffs");
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
      {state.staff && (
        <ActionModule
          type={EPageTypes.UPDATE}
          formikRef={formikRef}
          account={{
            ...state.staff,
            id_role: state.staff?.roles?.map((item: any) => item.id),
          }}
        />
      )}
    </>
  );
};

export default UpdateStaff;
