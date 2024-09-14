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
import { IBiddingResultInitialState, resetStatus } from "@/services/store/biddingResult/biddingResult.slice";
import BiddingResultForm, { IBiddingResultFormInitialValues } from "../BiddingResultForm";

const CreateBiddingResult = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBiddingResultFormInitialValues>>(null);
  const { state } = useArchive<IBiddingResultInitialState>("bidding_result");

  useFetchStatus({
    module: "bidding_result",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/bidding-results",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Tạo mới lịch sử đấu thầu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/bidding-results");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Thêm mới",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              if (formikRef.current) {
                formikRef.current.handleSubmit();
              }
            },
          },
        ]}
      />
      <BiddingResultForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreateBiddingResult;
