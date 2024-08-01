import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IBiddingFieldInitialState, resetStatus } from "@/services/store/biddingField/biddingField.slice";
import { FormikProps } from "formik";
import { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import BiddingFieldForm, { IBiddingFieldFormInitialValues } from "../BiddingFieldForm";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IoClose } from "react-icons/io5";

const UpdateBiddingField = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBiddingFieldFormInitialValues>>(null);
  const { state } = useArchive<IBiddingFieldInitialState>("biddingfield");
  useFetchStatus({
    module: "biddingfield",
    reset: resetStatus,
    actions: {
      success: { message: state.message, navigate: "/bidding-fields", },
      error: { message: state.message },
    },
  });

  return (
    <>
      <Heading
        title="Update Bidding Fields"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Cancel",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => navigate("/bidding-fields"),
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Update Fields",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              formikRef && formikRef.current && formikRef.current.handleSubmit();
            },
          }
        ]}
      />
      <BiddingFieldForm formikRef={formikRef} type="update" />
    </>
  );
}

export default UpdateBiddingField;
