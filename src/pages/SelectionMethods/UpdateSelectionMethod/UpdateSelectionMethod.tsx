import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import { getSelectionMethodById } from "@/services/store/selectionMethod/selectionMethod.thunk";
import { ISelectionMethodInitialState, resetStatus } from "@/services/store/selectionMethod/selectionMethod.slice";
import SelectionMethodForm, { ISelectionMethodFormInitialValues } from "../SelectionMethodForm";

const UpdateSelectionMethod = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<ISelectionMethodFormInitialValues>>(null);
  const { state, dispatch } = useArchive<ISelectionMethodInitialState>("selection_method");
  const [data, setData] = useState<ISelectionMethodFormInitialValues>();
  const { id } = useParams();

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

  useEffect(() => {
    if (id) {
      dispatch(getSelectionMethodById(id));
    }
  }, [id]);

  useEffect(() => {
    if (!!state.activeSelectionMethod) {
      setData(state.activeSelectionMethod);
    }
  }, [JSON.stringify(state.selectionMethod)]);

  useEffect(() => {
    if (data) {
      if (formikRef.current) {
        formikRef.current.setValues({
          method_name: data.method_name,
          description: data.description,
          is_active: data.is_active,
        });
      }
    }
  }, [data]);

  return (
    <>
      <Heading
        title="Cập nhật loại hình đấu thầu"
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
            text: "Cập nhật",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => formikRef.current?.handleSubmit(),
          },
        ]}
      />
      {state.activeSelectionMethod ? (
        <SelectionMethodForm type={EPageTypes.UPDATE} formikRef={formikRef} selectionMethod={state.activeSelectionMethod} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default UpdateSelectionMethod;
