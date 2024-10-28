import Heading from "@/components/layout/Heading";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ActionModule from "../ActionModule";
import { FormikProps } from "formik";
import { useRef } from "react";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPageTypes } from "@/shared/enums/page";
import { EPermissions } from "@/shared/enums/permissions";
import { IEmployeeInitialState, resetStatus } from "@/services/store/employee/employee.slice";
import { IEmployee } from "@/services/store/employee/employee.model";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IEmployee>>(null);
  const { state } = useArchive<IEmployeeInitialState>("employee");

  useFetchStatus({
    module: "employee",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/employees",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Tạo mới nhân viên"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Cancel",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/employees");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Tạo mới",
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_EMPLOYEE,
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

export default CreateEmployee;
