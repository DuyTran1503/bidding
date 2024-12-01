import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import useFetchStatus from "@/hooks/useFetchStatus";
import BidDocumentForm, { IBidDocumentInitialValues } from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import { useArchive } from "@/hooks/useArchive";
import { IBidDocumentInitialState, resetStatus } from "@/services/store/bid_document/bid_document.slice";
import { getBidDocumentById } from "@/services/store/bid_document/bid_document.thunk";
import ProjectDetailsCard from "@/pages/Project/Detail/ProjectDetailsCard";
import { Tooltip } from "antd";
import { IBidDocument } from "@/services/store/bid_document/bid_document.model";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";
import { getListBidBond } from "@/services/store/bid_bond/bidBond.thunk";

const DetailBidDocument = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBidDocumentInitialValues>>(null);
  const { id } = useParams();

  const { state, dispatch } = useArchive<IBidDocumentInitialState>("bid_document");
  const { state: stateBidBond, dispatch: dispatchBidBond } = useArchive<IBidBondInitialState>("bid_bond");
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
      dispatch(getBidDocumentById(id));
      dispatchBidBond(getListBidBond());
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
          project_id: data?.project_id ?? undefined,
          enterprise: data?.enterprise || undefined,
          project: data?.project || undefined,
          bid_bond_id: data?.bid_bond_id ?? 0,
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
  const handleRedirect = (id: string | number, type: string) => {
    if (type === "enterprise") {
      return navigate(`/enterprise/detail/${id}`, { replace: true });
    }
    return navigate(`/project/detail/${id}`, { replace: true });
  };
  const codeBidBond =
    stateBidBond.listBidBonds && data?.bid_bond_id && stateBidBond?.listBidBonds.find((item) => item.id === data.bid_bond_id)?.bond_number;
  const labels = [
    {
      label: "Tên dự án",
      value: (
        <Tooltip title={"Chi tiết dự án"} color={"#108ee9"}>
          <span
            onClick={() => handleRedirect(data?.project?.id as unknown as string, "project")}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {data?.project && data?.project.name}
          </span>
        </Tooltip>
      ),
    },
    {
      label: "Tên doanh nghiệp",
      value: (
        <Tooltip title={"Chi tiết doanh nghiệp"} color={"#108ee9"}>
          <span
            onClick={() => handleRedirect(data?.enterprise?.id as unknown as string, "enterprise")}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {data?.enterprise && data?.enterprise.name}
          </span>
        </Tooltip>
      ),
    },
    { label: "Mã bảo lãnh dự thầu", value: codeBidBond },
    { label: "Giá thầu ", value: convertMoney(data?.bid_price as string) },
    { label: "Ngày gửi hồ sơ", value: data?.submission_date },
    { label: "Thời gian thực hiện", value: data?.implementation_time },
    { label: "Thời gian hiệu lực", value: data?.validity_period },
    { label: "Ghi chú", value: data?.notes || "Bạn chưa có ghi chú nào" },
  ];
  return (
    <>
      <Heading
        title="Chi tiết hồ sơ dự thầu"
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
      {/* <BidDocumentForm type={EPageTypes.VIEW} formikRef={formikRef} bidDocument={data} /> */}
      <ProjectDetailsCard dataBidDoc={data as IBidDocument} customDetails={labels} showDefaultDetails={false} title={"Thông tin hồ sơ dự thầu"} />
    </>
  );
};

export default DetailBidDocument;
