import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { ITagInitialState, resetStatus } from "@/services/store/tag/tag.slice";
import { useArchive } from "@/hooks/useArchive";
import  BusinessActivityForm, { IIBusinessActivityInitialValues } from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
const CreateBusinessActivity = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IIBusinessActivityInitialValues>>(null);

  const { state } = useArchive<ITagInitialState>("business");

  useFetchStatus({
    module: "business",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/business_activity",
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
              navigate("/business_activity");
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
      <BusinessActivityForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreateBusinessActivity;