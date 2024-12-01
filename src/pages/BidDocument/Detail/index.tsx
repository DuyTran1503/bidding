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
import ProjectDetailsCard, { getFileIcon } from "@/pages/Project/Detail/ProjectDetailsCard";
import { Tooltip } from "antd";
import { IBidDocument } from "@/services/store/bid_document/bid_document.model";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";

const DetailBidDocument = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBidDocumentInitialValues>>(null);
  const { id } = useParams();

  const { state, dispatch } = useArchive<IBidDocumentInitialState>("bid_document");
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
    }
  }, [id]);
  useEffect(() => {
    if (!!state.bidDocument) {
      setData(state.bidDocument as IBidDocumentInitialValues);
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
          note: data?.note ?? "",
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
            onClick={() => handleRedirect(data?.enterprise?.user?.id as unknown as string, "enterprise")}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {data?.enterprise && data?.enterprise.user?.name}
          </span>
        </Tooltip>
      ),
    },
    { label: "Email doanh nghiệp ", value: data?.enterprise?.user?.email },
    { label: "Mã số thuế doanh nghiệp ", value: data?.enterprise?.user?.taxcode },
    { label: "Số điện thoại doanh nghiệp ", value: data?.enterprise?.phone },
    { label: "Địa chỉ doanh nghiệp ", value: data?.enterprise?.address },
    { label: "Mã bảo lãnh dự thầu", value: data?.bid_bond?.bond_number },
    { label: "Giá thầu ", value: convertMoney(data?.bid_price as string) },
    { label: "Ngày gửi hồ sơ", value: data?.submission_date },
    { label: "Thời gian thực hiện", value: data?.implementation_time },
    { label: "Thời gian hiệu lực", value: data?.validity_period },
    {
      label: "File đính kèm",
      value: (
        <div className="flex flex-wrap items-center gap-4">
          {data && data.file ? (
            <Tooltip title={data.file as string} color={"#108ee9"}>
              <a
                href={data.file as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                {data.file && getFileIcon(data.file as string) && (
                  <img src={getFileIcon(data.file as string)} alt={data.file as string} className="h-6 w-6 object-contain" />
                )}
              </a>
            </Tooltip>
          ) : (
            <span>Không có tệp đính kèm</span>
          )}
        </div>
      ),
    },
    { label: "Ghi chú", value: data?.note || "Bạn chưa có ghi chú nào" },
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
