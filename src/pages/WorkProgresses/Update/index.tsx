import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus } from "@/services/store/employee/employee.slice";
import { IWorkProgress } from "@/services/store/workProgress/workProgress.model";
import { IWorkProgressInitialState } from "@/services/store/workProgress/workProgress.slice";
import { getWorkProgressById } from "@/services/store/workProgress/workProgress.thunk";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPageTypes } from "@/shared/enums/page";
import { FormikProps } from "formik";
import { useEffect, useRef } from "react";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import ActionModule from "../ActionModule";

const UpdateWorkProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IWorkProgress>>(null);
  const { state, dispatch } = useArchive<IWorkProgressInitialState>("work_progress");
  useFetchStatus({
    module: "work_progress",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/work-progresses", 
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) dispatch(getWorkProgressById(id));
  }, [id]);
  return (
    <>
      <Heading
        title="Cập nhật tiến độ dự án"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/work-progresses");
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
      {state.workProgress && <ActionModule type={EPageTypes.UPDATE} formikRef={formikRef} workProgress={state.workProgress} />}
    </>
  );
};

export default UpdateWorkProgress;
