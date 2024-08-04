import { useEffect, useRef } from "react";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import FundingSourceForm, { IFundingSourceFormInitialValues } from "../FundingSourceForm";
import { IFundingSourceInitialState, resetStatus } from "@/services/store/funding_source/funding_source.slice";
import { getFundingSourceById } from "@/services/store/funding_source/funding_source.thunk";

const UpdateFundingSource = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IFundingSourceFormInitialValues>>(null);
  const { id } = useParams();
  const { state, dispatch } = useArchive<IFundingSourceInitialState>("fundingsource");

  useFetchStatus({
    module: "fundingsource",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/funding_sources",
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getFundingSourceById(id));
    }
  }, [id]);

  // useEffect(() => {
  //   if (state.activeFundingSource) {
  //     if (formikRef.current) {
  //       formikRef.current.setValues({
  //         name: activeFun
  //       });
  //     }
  //   }
  // }, [state.activeFundingSource]);
  return (
    <>
      <Heading
        title="Cập nhật Nguồn Tài Trợ"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Cancel",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/funding_sources");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Save change",
            icon: <IoSaveOutline className="text-[18px]" />,
            onClick: () => {
              if (formikRef.current) {
                formikRef.current.handleSubmit();
              }
            },
          },
        ]}
      />
      {state.activeFundingSource && <FundingSourceForm type="update" formikRef={formikRef} fundingsource={state.activeFundingSource} />}
    </>
  );
};

export default UpdateFundingSource;
