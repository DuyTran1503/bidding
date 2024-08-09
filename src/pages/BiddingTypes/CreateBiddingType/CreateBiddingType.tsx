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
import { IBiddingTypeInitialState, resetStatus } from "@/services/store/biddingType/biddingType.slice";
import BiddingTypeForm, { IBiddingTypeFormInitialValues } from "../BiddingTypeForm";

const UpdateBiddingType = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBiddingTypeFormInitialValues>>(null);
  const { state } = useArchive<IBiddingTypeInitialState>("bidding_type");

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

  return (
    <>
      <Heading
        title="Tạo mới loại đấu thầu"
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
      <BiddingTypeForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default UpdateBiddingType;
