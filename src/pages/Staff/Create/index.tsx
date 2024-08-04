import Heading from "@/components/layout/Heading";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import RoleForm, { IStaffFormInitialValues } from "../ActionModule";
import { FormikProps } from "formik";
import { useRef } from "react";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IAccountInitialState, resetStatus } from "@/services/store/account/account.slice";

const CreateStaff = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IStaffFormInitialValues>>(null);

  const { state } = useArchive<IAccountInitialState>("account");

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

  return (
    <>
      <Heading
        title="Tạo mới tài khoản"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Cancel",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/staffs");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Tạo mới",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              formikRef && formikRef.current && formikRef.current.handleSubmit();
            },
          },
        ]}
      />
      <RoleForm formikRef={formikRef} type="create" />
    </>
  );
};

export default CreateStaff;
