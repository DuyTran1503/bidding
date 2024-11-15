import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EPageTypes } from "@/shared/enums/page";
import { useArchive } from "@/hooks/useArchive";
import WorkProgressForm, { IWorkProgressInitialValues } from "../ActionModule";
import { IWorkProgressInitialState } from "@/services/store/workProgress/workProgress.slice";
import { resetStatus } from "@/services/store/account/account.slice";
import { getWorkProgressById } from "@/services/store/workProgress/workProgress.thunk";

const DetailWorkProgress = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IWorkProgressInitialValues>>(null);
  const { id } = useParams();

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
    if (id) {
      dispatch(getWorkProgressById(id));
    }
  }, [id]);

  return (
    <>
      <Heading
        title="Chi tiết tiến độ dự án"
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
        ]}
      />
      {/* <WorkProgressForm type={EPageTypes.VIEW} formikRef={formikRef} workProgress={data} /> */}
      {state.workProgress && <WorkProgressForm type={EPageTypes.UPDATE} formikRef={formikRef} workProgress={state.workProgress} />}
    </>
  );
};

export default DetailWorkProgress;
