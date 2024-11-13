import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import { getBiddingHistoryById } from "@/services/store/biddingHistory/biddingHistory.thunk";
import { IBiddingHistoryInitialState, resetStatus } from "@/services/store/biddingHistory/biddingHistory.slice";
import BiddingHistoryForm, { IBiddingHistoryFormInitialValues } from "../BiddingHistoryForm";

const DetailBiddingHistory = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBiddingHistoryFormInitialValues>>(null);
  const { state, dispatch } = useArchive<IBiddingHistoryInitialState>("bidding_history");
  const { id } = useParams();

  useFetchStatus({
    module: "bidding_history",
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

  useEffect(() => {
    if (id) {
      dispatch(getBiddingHistoryById(id));
    }
  }, [id]);

  return (
    <>
      <Heading
        title="Chi tiết lịch sử đấu thầu"
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
        ]}
      />
      {state.activeBiddingHistory ? (
        <BiddingHistoryForm type={EPageTypes.VIEW} formikRef={formikRef} biddingHistory={state.activeBiddingHistory} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default DetailBiddingHistory;
