import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import { getBiddingResultById } from "@/services/store/biddingResult/biddingResult.thunk";
import { IBiddingResultInitialState, resetStatus } from "@/services/store/biddingResult/biddingResult.slice";
import BiddingResultForm, { IBiddingResultFormInitialValues } from "../BiddingResultForm";

const DetailBiddingResult = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBiddingResultFormInitialValues>>(null);
  const { state, dispatch } = useArchive<IBiddingResultInitialState>("bidding_result");
  const { id } = useParams();

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

  useEffect(() => {
    if (id) {
      dispatch(getBiddingResultById(id));
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
              navigate("/bidding-results");
            },
          },
        ]}
      />
      {state.activeBiddingResult ? (
        <BiddingResultForm type={EPageTypes.VIEW} formikRef={formikRef} biddingResult={state.activeBiddingResult} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default DetailBiddingResult;
