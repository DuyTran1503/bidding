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
import AttachmentForm, { IAttachmentInitialValues } from "../ActionModule";
import { IAttachmentInitialState, resetStatus } from "@/services/store/attachment/attachment.slice";
const CreateAttachment = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IAttachmentInitialValues>>(null);
  const { state } = useArchive<IAttachmentInitialState>("attachment");

  useFetchStatus({
    module: "attachment",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/attachment",
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
              navigate("/attachment");
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
      <AttachmentForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreateAttachment;
