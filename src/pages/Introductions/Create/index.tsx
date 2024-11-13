import Heading from "@/components/layout/Heading";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus } from "@/services/store/employee/employee.slice";
import { IIntroduction } from "@/services/store/introduction/introduction.moldel";
import { IIntroductionInitialState } from "@/services/store/introduction/introduction.slice";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPageTypes } from "@/shared/enums/page";
import { FormikProps } from "formik";
import { useRef } from "react";
import IntroductionForm from "../ActionMoudle";
import { EPermissions } from "@/shared/enums/permissions";

const CreateIntroduction = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IIntroduction>>(null);
  const { state } = useArchive<IIntroductionInitialState>("introduction");
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

  return (
    <>
      <Heading
        title="Tạo mới giới thiệu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Cancel",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/introductions");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Tạo mới",
            icon: <FaPlus className="text-[18px]" />,
            // permission: EPermissions.CREATE_INTRODUCTION,
            onClick: () => {
              formikRef && formikRef.current && formikRef.current.handleSubmit();
            },
          },
        ]}
      />
      <IntroductionForm formikRef={formikRef} type={EPageTypes.CREATE} />
    </>
  );
};

export default CreateIntroduction;
