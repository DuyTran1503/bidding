import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import { useEffect, useRef, useState } from "react";
import BidDocumentForm, { IBidDocumentInitialValues } from "../ActionModule";
import { IBidDocumentInitialState, resetStatus } from "@/services/store/bid_document/bid_document.slice";
import { getBidDocumentById } from "@/services/store/bid_document/bid_document.thunk";
const UpdateBidDocument = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBidDocumentInitialValues>>(null);
  const { state, dispatch } = useArchive<IBidDocumentInitialState>("bid_document");
  const [data, setData] = useState<IBidDocumentInitialValues>();
  const { id } = useParams();

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
      dispatch(getBidDocumentById(id));
    }
  }, [id]);
  useEffect(() => {
    if (!!state.bidDocument) {
      setData(state.bidDocument);
    }
  }, [JSON.stringify(state.bidDocument)]);

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
        title="Cập nhật hồ sơ mời thầu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/bidDocument");
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
      <BidDocumentForm type={EPageTypes.UPDATE} formikRef={formikRef} bidDocument={data} />
    </>
  );
};

export default UpdateBidDocument;
