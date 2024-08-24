import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import FundingSourceForm, { IFundingSourceInitialValues } from "../ActionModule";
import { IFundingSourceInitialState, resetStatus } from "@/services/store/funding_source/funding_source.slice";
import { getFundingSourceById } from "@/services/store/funding_source/funding_source.thunk";
import { FaPlus } from "react-icons/fa";
import { EPageTypes } from "@/shared/enums/page";

const UpdateFundingSource = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IFundingSourceInitialValues>>(null);
  const { id } = useParams();
  const { state, dispatch } = useArchive<IFundingSourceInitialState>("funding_source");
  const [data, setData] = useState<IFundingSourceInitialValues>();

  useFetchStatus({
    module: "funding_source",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/funding-sources",
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

  useEffect(() => {
    if (!!state.fundingSource) {
      setData(state.fundingSource);
    }
  }, [JSON.stringify(state.fundingSource)]);

  useEffect(() => {
    if (data) {
      if (formikRef.current) {
        formikRef.current.setValues({
          name: data.name,
          code: data.code,
          type: data.type,
          description: data.description,
          is_active: data.is_active,
        });
      }
    }
  }, [data]);

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
              navigate("/funding-sources");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Cập nhật",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              if (formikRef.current) {
                formikRef.current.handleSubmit();
              }
            },
          },
        ]}
      />
      <FundingSourceForm type={EPageTypes.UPDATE} formikRef={formikRef} fundingSource={data} />
    </>
  );
};

export default UpdateFundingSource;
