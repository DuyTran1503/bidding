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

const UpdateBiddingField = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBiddingFieldFormInitialValues>>(null);
  const { state, dispatch } = useArchive<IBiddingFieldInitialState>("biddingfield");

  // Hook to handle status of fetch requests
  useFetchStatus({
    module: "biddingfield",
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
        title="Update Bidding Field"
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
            text: "Update Field",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => formikRef.current?.handleSubmit(),
          }
        ]}
      />
      {state.activeBiddingField ? (
        <BiddingFieldForm
          formikRef={formikRef}
          type="update"
          biddingField={state.activeBiddingField}
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default UpdateBiddingField;
