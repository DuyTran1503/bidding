import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus } from "@/services/store/employee/employee.slice";
import { IQuestionsAnswers } from "@/services/store/questions_answers/questions_answers.model";
import { IQuestionsAnswersInitialState } from "@/services/store/questions_answers/questions_answers.slice";
import { EPageTypes } from "@/shared/enums/page";
import { FormikProps } from "formik";
import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import ActionModule from "../ActionModule";
import { getQuestionAnswerById } from "@/services/store/questions_answers/questions_answers.thunk";
const DetailQuestionsAnswers = () => {
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
  }, [id, dispatch]);

  return (
    <>
      <Heading
        title="Chi tiết câu hỏi"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/questions_answers");
            },
          },
        ]}
      />
      {state.question_answer && <ActionModule type={EPageTypes.UPDATE} formikRef={formikRef} question_answer={state.question_answer} />}
    </>
  );
};

export default DetailQuestionsAnswers;
