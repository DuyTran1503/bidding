import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IBiddingFieldInitialState, resetStatus } from "@/services/store/biddingField/biddingField.slice";
import { FormikProps } from "formik";
import { useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import BiddingFieldForm, { IBiddingFieldFormInitialValues } from "../BiddingFieldForm";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IoClose } from "react-icons/io5";
import { getBiddingFieldById } from "@/services/store/biddingField/biddingField.thunk";
import { EPageTypes } from "@/shared/enums/page";

const UpdateBiddingField = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBiddingFieldFormInitialValues>>(null);
  const { state, dispatch } = useArchive<IBiddingFieldInitialState>("bidding_field");

  // Hook to handle status of fetch requests
  useFetchStatus({
    module: "bidding_field",
    reset: resetStatus,
    actions: {
      success: { message: state.message, navigate: "/bidding-fields" },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getBiddingFieldById(id));
    }
  }, [id, dispatch]);

  return (
    <>
      <Heading
        title="Cập nhật lĩnh vực đấu thầu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => navigate("/bidding-fields"),
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Cập nhật",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => formikRef.current?.handleSubmit(),
          },
        ]}
      />
      {state.activeBiddingField ? (
        <BiddingFieldForm formikRef={formikRef} type={EPageTypes.UPDATE} biddingField={state.activeBiddingField} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default UpdateBiddingField;
