import { useArchive } from "@/hooks/useArchive";
import Heading from "@/components/layout/Heading";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { FormikProps } from "formik";
import useFetchStatus from "@/hooks/useFetchStatus";
import ActionModule from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import { getEmployeeById } from "@/services/store/employee/employee.thunk";
import { IEmployee } from "@/services/store/employee/employee.model";
import { IEmployeeInitialState, resetStatus } from "@/services/store/employee/employee.slice";
import { IInstruct } from "@/services/store/instruct/instruct.mode";
import { IInstructInitialState } from "@/services/store/instruct/instruct.slice";
import { getInstructById } from "@/services/store/instruct/instruct.thunk";

const UpdateInstruct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IInstruct>>(null);
  const { state, dispatch } = useArchive<IInstructInitialState>("instruct");
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

  useEffect(() => {
    if (id) dispatch(getInstructById(id));
  }, [id]);
  return (
    <>
      <Heading
        title="Cập nhật hướng dẫn "
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/instructs");
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
      {state.instruct && <ActionModule type={EPageTypes.UPDATE} formikRef={formikRef} instruct={state.instruct} />}
    </>
  );
};

export default UpdateInstruct;
