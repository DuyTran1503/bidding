import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import IndustryForm, { IndustryInitialValues } from "../ActionModule";
import { IIndustryInitialState, resetStatus } from "@/services/store/industry/industry.slice";
const CreateIndustry = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IndustryInitialValues>>(null);

  const { state } = useArchive<IIndustryInitialState>("industry");

  useFetchStatus({
    module: "industry",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/industry",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Tạo mới "
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/industry");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Tạo mới",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              if (formikRef.current) {
                formikRef.current.handleSubmit();
              }
            },
          },
        ]}
      />
      <IndustryForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreateIndustry;
