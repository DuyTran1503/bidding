import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import FundingSourceForm, { IFundingSourceFormInitialValues } from "../FundingSourceForm";
import { IFundingSourceInitialState, resetStatus } from "@/services/store/funding_source/funding_source.slice";

const CreateFundingSource = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IFundingSourceFormInitialValues>>(null);

  const { state } = useArchive<IFundingSourceInitialState>("fundingsource");

  useFetchStatus({
    module: "fundingsource",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/funding_sources",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Thêm Nguồn Tài Trợ"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Cancel",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/funding_sources");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Thêm Nguồn Tài Trợ",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              formikRef && formikRef.current && formikRef.current.handleSubmit();
            },
          },
        ]}
      />
      <FundingSourceForm  formikRef={formikRef} type="create" />
    </>
  );
};

export default CreateFundingSource;
