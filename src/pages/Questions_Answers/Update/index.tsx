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
import { IQuestionsAnswers } from "@/services/store/questions_answers/questions_answers.model";
import { IQuestionsAnswersInitialState } from "@/services/store/questions_answers/questions_answers.slice";
import { getQuestionAnswerById } from "@/services/store/questions_answers/questions_answers.thunk";

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IQuestionsAnswers>>(null);
  const { state, dispatch } = useArchive<IQuestionsAnswersInitialState>("questions_answers");
  useFetchStatus({
    module: "questions_answers",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/questions_answers",
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) dispatch(getQuestionAnswerById(id));
  }, [id]);
  return (
    <>
      <Heading
        title="Cập nhật câu trả lời"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/employees");
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
      {state.question_answer && <ActionModule type={EPageTypes.UPDATE} formikRef={formikRef} question_answer={state.question_answer} />}
    </>
  );
};

export default UpdateEmployee;
