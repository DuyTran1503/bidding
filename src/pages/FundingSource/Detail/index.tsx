import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IFundingSourceInitialState } from "@/services/store/funding_source/funding_source.slice";
import { resetStatus } from "@/services/store/industry/industry.slice";
import { EPageTypes } from "@/shared/enums/page";
import { FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import FundingSourceForm, { IFundingSourceInitialValues } from "../ActionModule";
import { getFundingSourceById } from "@/services/store/funding_source/funding_source.thunk";
const DetailFundingSource = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IFundingSourceInitialValues>>(null);
  const { state, dispatch } = useArchive<IFundingSourceInitialState>("funding_source");
  const [data, setData] = useState<IFundingSourceInitialValues>();
  const { id } = useParams();

  useFetchStatus({
    module: "funding_source",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/funding-source",
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
        title="Chi tiết nguồn tài trợ"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/industry");
            },
          },
        ]}
      />
      <FundingSourceForm type={EPageTypes.VIEW} formikRef={formikRef} fundingSource={data} />
    </>
  );
};

export default DetailFundingSource;
