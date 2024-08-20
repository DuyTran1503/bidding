import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import FundingSourceForm, { IFundingSourceInitialValues } from "../ActionModule";
import { IFundingSourceInitialState, resetStatus } from "@/services/store/funding_source/funding_source.slice";
import { EPageTypes } from "@/shared/enums/page";

const CreateFundingSource = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IFundingSourceInitialValues>>(null);

  const { state } = useArchive<IFundingSourceInitialState>("funding_source");

  useFetchStatus({
    module: "funding_source",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/funding-sources",
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
              navigate("/funding-sources");
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
      <FundingSourceForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreateFundingSource;
