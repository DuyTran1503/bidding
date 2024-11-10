import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus } from "@/services/store/employee/employee.slice";
import { IFeedbackComplaint } from "@/services/store/feedback_complaint/feedback_complaint.model";
import { IFeedbackComplaintInitialState } from "@/services/store/feedback_complaint/feedback_complaint.slice";
import { getFeedbackComplaintById } from "@/services/store/feedback_complaint/feedback_complaint.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { FormikProps } from "formik";
import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import ActionModule from "../ActionModule";
const DetailFeedbackComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IFeedbackComplaint>>(null);
  const { state, dispatch } = useArchive<IFeedbackComplaintInitialState>("feedback_complaint");

  useFetchStatus({
    module: "feedback_complaint",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/feedback_complaints",
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) dispatch(getFeedbackComplaintById(id));
  }, [id, dispatch]);

  return (
    <>
      <Heading
        title="Chi tiết nhân viên"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/feedback_complaints");
            },
          },
        ]}
      />
      {state.feedback_complaint && <ActionModule type={EPageTypes.UPDATE} formikRef={formikRef} feedback_complaint={state.feedback_complaint} />}
    </>
  );
};

export default DetailFeedbackComplaint;
