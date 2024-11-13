import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus } from "@/services/store/employee/employee.slice";
import { IInstruct } from "@/services/store/instruct/instruct.mode";
import { IInstructInitialState } from "@/services/store/instruct/instruct.slice";
import { getInstructById } from "@/services/store/instruct/instruct.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import ActionModule, { IInstructInitialValues } from "../ActionModule";
import IntroductionForm from "@/pages/Introductions/ActionMoudle";
import InstructForm from "../ActionModule";

const DetailInstruct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IInstructInitialValues>>(null);
  const { state, dispatch } = useArchive<IInstructInitialState>("instruct");
  const [data, setData] = useState<IInstructInitialValues>()

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

  useEffect(() => {
    if (!!state.instruct) {
        setData(state.instruct)
    }
  }, [JSON.stringify(state.instruct)]) 

  useEffect(() => {
    if (data) {
      if (formikRef.current) {
        formikRef.current.setValues({
          instruct: data.instruct,
          is_use: data.is_use,
        })
      }
    } 
  },[data])

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
      {/* {state.instruct && <IntroductionForm type={EPageTypes.UPDATE} formikRef={formikRef} instruct={state.instruct} />} */}
      <InstructForm type={EPageTypes.VIEW} formikRef={formikRef} instruct={data} />
    </>
  );
};

export default DetailInstruct;
