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
import { IEnterpriseInitialState, resetStatus } from "@/services/store/enterprise/enterprise.slice";
import EnterpriseForm, { IEnterpriseInitialValues } from "../ActionModule";
const CreateEnterprise = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IEnterpriseInitialValues>>(null);
  const { state } = useArchive<IEnterpriseInitialState>("enterprise");

  useFetchStatus({
    module: "enterprise",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/enterprise",
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
              navigate("/enterprise");
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
      <EnterpriseForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreateEnterprise;
