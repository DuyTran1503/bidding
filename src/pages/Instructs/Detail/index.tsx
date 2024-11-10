import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus } from "@/services/store/employee/employee.slice";
import { IInstruct } from "@/services/store/instruct/instruct.mode";
import { IInstructInitialState } from "@/services/store/instruct/instruct.slice";
import { getInstructById } from "@/services/store/instruct/instruct.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { FormikProps } from "formik";
import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import ActionModule from "../ActionModule";
import IntroductionForm from "@/pages/Introductions/ActionMoudle";

const DetailInstruct = () => {
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
  }, [id, dispatch]);

  return (
    <>
      <Heading
        title="Chi tiết hướng dẫn"
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
        ]}
      />
      {state.instruct && <IntroductionForm type={EPageTypes.UPDATE} formikRef={formikRef} instruct={state.instruct} />}
    </>
  );
};

export default DetailInstruct;
