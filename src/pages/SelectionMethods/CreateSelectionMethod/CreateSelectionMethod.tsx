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
import { ISelectionMethodInitialState, resetStatus } from "@/services/store/selectionMethod/selectionMethod.slice";
import SelectionMethodForm, { ISelectionMethodFormInitialValues } from "../SelectionMethodForm";

const CreateSelectionMethod = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<ISelectionMethodFormInitialValues>>(null);
  const { state } = useArchive<ISelectionMethodInitialState>("selection_method");

  useFetchStatus({
    module: "selection_method",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/selection-methods",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Tạo mới loại hình đấu thầu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/selection-methods");
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
      <SelectionMethodForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreateSelectionMethod;
