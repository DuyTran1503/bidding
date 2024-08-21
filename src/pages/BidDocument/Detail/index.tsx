import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import useFetchStatus from "@/hooks/useFetchStatus";
import BidDocumentForm, { IBidDocumentInitialValues } from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import { IEnterpriseInitialState, resetStatus } from "@/services/store/enterprise/enterprise.slice";
import { useArchive } from "@/hooks/useArchive";
import { getEnterpriseById } from "@/services/store/enterprise/enterprise.thunk";

const DetailBidDocument = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBidDocumentInitialValues>>(null);
  const { id } = useParams();

  const { state, dispatch } = useArchive<IEnterpriseInitialState>("bid_document");
  const [data, setData] = useState<IBidDocumentInitialValues>();
  useFetchStatus({
    module: "bid_document",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/bid-document",
      },
      error: {
        message: state.message,
      },
    },
  });
  useEffect(() => {
    if (id) {
      dispatch(getEnterpriseById(id));
    }
  }, [id]);
  useEffect(() => {
    if (!!state.enterprise) {
      setData(state.enterprise);
    }
  }, [JSON.stringify(state.enterprise)]);
  useEffect(() => {
    if (data) {
      if (formikRef.current) {
        formikRef.current.setValues({
          id_project: data?.id_project ?? 0,
          id_enterprise: data?.id_enterprise ?? 0,
          id_bid_bond: data?.id_bid_bond ?? 0,
          submission_date: data?.submission_date ?? "",
          bid_price: data?.bid_price ?? "",
          implementation_time: data?.implementation_time ?? "",
          validity_period: data?.validity_period ?? "",
          technical_score: data?.technical_score ?? "",
          financial_score: data?.financial_score ?? "",
          totalScore: data?.totalScore ?? "",
          ranking: data?.ranking ?? "",
          status: data?.status ?? "",
          notes: data?.notes ?? "",
        });
      }
    }
  }, [data]);
  return (
    <>
      <Heading
        title="Chi tiết hồ sơ mời thầu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/bid-document");
            },
          },
        ]}
      />
      <BidDocumentForm type={EPageTypes.VIEW} formikRef={formikRef} bidDocument={data} />
    </>
  );
};

export default DetailBidDocument;
