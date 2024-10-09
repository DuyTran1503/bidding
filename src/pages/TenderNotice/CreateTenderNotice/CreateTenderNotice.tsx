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
import { ITenderNoticeInitialState, resetStatus } from "@/services/store/tenderNotice/tenderNotice.slice";
import TenderNoticeForm, { ITenderNoticeFormInitialValues } from "../TenderNoticeForm";

const CreateTenderNotice = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<ITenderNoticeFormInitialValues>>(null);
  const { state } = useArchive<ITenderNoticeInitialState>("tender_notice");

  useFetchStatus({
    module: "tender_notice",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/tender-notices",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Tạo mới thông báo mời thầu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/tender-notices");
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
      <TenderNoticeForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreateTenderNotice;
