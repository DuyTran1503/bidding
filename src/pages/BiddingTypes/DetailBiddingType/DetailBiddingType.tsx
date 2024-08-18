import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import { getBiddingTypeById } from "@/services/store/biddingType/biddingType.thunk";
import { IBiddingTypeInitialState, resetStatus } from "@/services/store/biddingType/biddingType.slice";
import BiddingTypeForm, { IBiddingTypeFormInitialValues } from "../BiddingTypeForm";

const DetailBiddingType = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBiddingTypeFormInitialValues>>(null);
  const { state, dispatch } = useArchive<IBiddingTypeInitialState>("bidding_type");
  const { id } = useParams();

  useFetchStatus({
    module: "bidding_type",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/bidding-types",
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getBiddingTypeById(id));
    }
  }, [id]);

  return (
    <>
      <Heading
        title="Chi tiết loại hình đấu thầu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/bidding-types");
            },
          },
        ]}
      />
      {state.activeBiddingType ? (
        <BiddingTypeForm type={EPageTypes.VIEW} formikRef={formikRef} biddingType={state.activeBiddingType} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default DetailBiddingType;
