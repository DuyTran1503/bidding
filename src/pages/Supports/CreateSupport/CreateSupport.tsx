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
import { ISupportInitialState, resetStatus } from "@/services/store/support/support.slice";
import SupportForm, { ISupportFormInitialValues } from "../SupportForm";

const CreateSupport = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<ISupportFormInitialValues>>(null);
  const { state } = useArchive<ISupportInitialState>("support");

  useFetchStatus({
    module: "support",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/supports",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Thêm mới tài khoản hỗ trợ"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/supports");
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
      <SupportForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreateSupport;
