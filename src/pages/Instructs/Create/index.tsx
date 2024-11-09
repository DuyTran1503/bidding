import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus } from "@/services/store/employee/employee.slice";
import { IInstruct } from "@/services/store/instruct/instruct.mode";
import { IInstructInitialState } from "@/services/store/instruct/instruct.slice";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPageTypes } from "@/shared/enums/page";
import { FormikProps } from "formik";
import { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ActionModule from "../ActionModule";
import { EPermissions } from "@/shared/enums/permissions";

const CreateInstruct = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IInstruct>>(null);
  const { state } = useArchive<IInstructInitialState>("instruct");
  useFetchStatus({
    module: "instruct",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/instructs",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Tạo mới hướng dẫn"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Cancel",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/instructs");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Tạo mới",
            icon: <FaPlus className="text-[18px]" />,
            // permission: EPermissions.CREATE_INSTRUCT,
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

export default CreateInstruct;
