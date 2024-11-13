import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus } from "@/services/store/employee/employee.slice";
import { IIntroduction } from "@/services/store/introduction/introduction.moldel";
import { IIntroductionInitialState } from "@/services/store/introduction/introduction.slice";
import { getIntroductionById } from "@/services/store/introduction/introduction.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { FormikProps } from "formik";
import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import IntroductionForm, { IIntroductionInitialValues } from "../ActionMoudle";
const DetailIntroduction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IIntroductionInitialValues>>(null);
  const { state, dispatch } = useArchive<IIntroductionInitialState>("introduction");

  useFetchStatus({
    module: "introduction",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/introductions",
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) dispatch(getIntroductionById(id));
  }, [id, dispatch]);

  return (
    <>
      <Heading
        title="Chi tiết bài giới thiệu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/introductions");
            },
          },
        ]}
      />
      {state.introduction && <IntroductionForm type={EPageTypes.UPDATE} formikRef={formikRef} introduction={state.introduction} />}
    </>
  );
};

export default DetailIntroduction;
