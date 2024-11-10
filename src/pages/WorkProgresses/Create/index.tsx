import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus } from "@/services/store/employee/employee.slice";
import { IWorkProgress } from "@/services/store/workProgress/workProgress.model";
import { IWorkProgressInitialState } from "@/services/store/workProgress/workProgress.slice";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPageTypes } from "@/shared/enums/page";
import { FormikProps } from "formik";
import { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ActionModule from "../ActionModule";

const CreateWorkProgress = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IWorkProgress>>(null);
  const { state } = useArchive<IWorkProgressInitialState>("work_progress");
  useFetchStatus({
    module: "work_progress",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/work_progresses",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Tạo mới tiến độ"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Cancel",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/work_progresses");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Tạo mới",
            icon: <FaPlus className="text-[18px]" />,
            // permission: EPermissions.CREATE_EMPLOYEE,
            onClick: () => {
              formikRef && formikRef.current && formikRef.current.handleSubmit();
            },
          },
        ]}
      />
      <ActionModule formikRef={formikRef} type={EPageTypes.CREATE} />
    </>
  );
};

export default CreateWorkProgress;
