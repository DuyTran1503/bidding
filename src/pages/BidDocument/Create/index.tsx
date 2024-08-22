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
import BidDocumentForm, { IBidDocumentInitialValues } from "../ActionModule";
import { IBidDocumentInitialState, resetStatus } from "@/services/store/bid_document/bid_document.slice";
const CreateBidDocument = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBidDocumentInitialValues>>(null);
  const { state } = useArchive<IBidDocumentInitialState>("bid_document");

  useFetchStatus({
    module: "bid_document",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/bid-document",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Tạo mới "
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/bid-document");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Tạo mới",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              if (formikRef.current) {
                formikRef.current.handleSubmit();
              }
            },
          },
        ]}
      />
      <BidDocumentForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreateBidDocument;
