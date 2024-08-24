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
import { IBiddingHistoryInitialState, resetStatus } from "@/services/store/biddingHistory/biddingHistory.slice";
import BiddingHistoryForm, { IBiddingHistoryFormInitialValues } from "../BiddingHistoryForm";

const CreateBiddingHistory = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBiddingHistoryFormInitialValues>>(null);
  const { state } = useArchive<IBiddingHistoryInitialState>("bidding_type");

  useFetchStatus({
    module: "bidding_type",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/bidding-historys",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Tạo mới loại hình đấu thầu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/bidding-historys");
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
      <BiddingHistoryForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreateBiddingHistory;
