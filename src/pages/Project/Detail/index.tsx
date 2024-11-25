import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { INewProject } from "@/services/store/project/project.model";
import { IProjectInitialState, resetStatus } from "@/services/store/project/project.slice";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "@/services/store/project/project.thunk";
import { Card, Descriptions, Tooltip, Typography } from "antd";
import { SUBMIT_METHOD } from "@/shared/enums/submissionMethod";
import { DOMESTIC, mappingDOMESTIC } from "@/shared/enums/domestic";
import { convertTimestamp } from "@/shared/utils/common/convertTimestamp";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { STATUS_PROJECT, STATUS_PROJECT_LABELS } from "@/shared/enums/statusProject";
import PDF from "@/assets/images/pdf.png";
import EXCEL from "@/assets/images/excel.png";
import WORD from "@/assets/images/word.jpg";
const { Title, Paragraph } = Typography;
const DetailProject = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IProjectInitialState>("project");
  const [data, setData] = useState<INewProject>();
  const { id } = useParams();
  useFetchStatus({
    module: "project",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/project",
      },
      error: {
        message: state.message,
      },
    },
  });
  useEffect(() => {
    if (id) {
      dispatch(getProjectById(id));
    }
  }, [id]);
  useEffect(() => {
    if (!!state.project) {
      setData(state.project);
    }
  }, [JSON.stringify(state.project)]);
  const getSubmissionMethodLabel = (method?: string) => {
    return method ? SUBMIT_METHOD[method as keyof typeof SUBMIT_METHOD] || "Không xác định" : "Không xác định";
  };
  const getDomesticLabel = (id?: number) => {
    if (id !== undefined) {
      const domesticValue = parseInt(String(id), 10);
      return mappingDOMESTIC[domesticValue as DOMESTIC] || "Không xác định";
    }
    return "Không xác định";
  };
  const getStatusLabel = (status?: string): string => {
    if (!status) return "Không xác định";

    const statusNumber = parseInt(status, 10);
    return STATUS_PROJECT_LABELS[statusNumber as STATUS_PROJECT] || "Không xác định";
  };
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return PDF;
      case "xlsx":
      case "xls":
        return EXCEL;
      case "doc":
      case "docx":
        return WORD;
      default:
        return "📁";
    }
  };
  return (
    <>
      <Heading
        title="Chi tiết dự án"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Quay lại",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/project");
            },
          },
        ]}
      />
      <Card title="Thông Tin Dự Án" className="shadow-lg">
        <Descriptions bordered>
          <Descriptions.Item className="!py-[10px] px-6" label="Tên Dự Án" span={3}>
            {data && data.name}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Địa Điểm" span={3}>
            {data && data.location}
          </Descriptions.Item>
          {/* <Descriptions.Item className="!py-[10px] px-6" label="Địa Điểm" span={3}>
          </Descriptions.Item> */}
          <Descriptions.Item className="!py-[10px] px-6" label="Nguồn Vốn" span={3}>
            {data && data.funding_sourceName}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Ngành Nghề" span={3}>
            {data && data.arrayIndustry?.map((industry: any) => industry).join(", ")}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Số Tiền" span={3}>
            {data && data.amount !== undefined && convertMoney(data.amount.toString())}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Hình thức lựa chọn nhà thầu" span={3}>
            {data && data.selection_methodName}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Bên Mời Thầu" span={3}>
            {data && data.tendererName}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Người phê duyệt" span={3}>
            {data && data.staffName}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Số quyết định ban hành" span={3}>
            {data && data.decision_number_issued}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Tổng đầu tư" span={3}>
            {data && data.total_amount !== undefined && convertMoney(data.total_amount.toString())}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Hình thức tham gia đấu thầu" span={3}>
            {data && getSubmissionMethodLabel(data.submission_method)}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Chủ đầu tư" span={3}>
            {data && data.investorName}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Dịch vụ mua sắm đấu thầu công" span={3}>
            {(data && data.procurement_category_name?.map((category: any) => category.name).join(", ")) || "Chưa có dịch vụ mua sắm đấu thầu công"}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Dự án hiện tại" span={3}>
            {data && getDomesticLabel(data.is_domestic)}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Địa Điểm Nhận Hồ Sơ" span={3}>
            {data && data.receiving_place}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Thời Gian Nộp Hồ Sơ" span={3}>
            {data && convertTimestamp(data.bid_submission_start)}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Ngày Kết Thúc Nộp Hồ Sơ" span={3}>
            {data && convertTimestamp(data.bid_submission_end)}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Ngày Mở Thầu" span={3}>
            {data && convertTimestamp(data.bid_opening_date)}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Ngày Bắt Đầu Đấu Thầu" span={3}>
            {data && convertTimestamp(data.start_time)}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Ngày Kết Thúc Đấu Thầu" span={3}>
            {data && convertTimestamp(data.end_time)}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="Trạng Thái Dự Án" span={3}>
            {data && getStatusLabel(String(data.status))}
          </Descriptions.Item>
          <Descriptions.Item className="!py-[10px] px-6" label="File đính kèm" span={3}>
            <div className="flex flex-wrap items-center gap-4">
              {data && data.attachments!.length > 0 ? (
                data.attachments!.map((file: any, index) => (
                  <Tooltip title={file.name} color={"#108ee9"} key={index}>
                    <a
                      key={index}
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                      {file.type && getFileIcon(file.type) && <img src={getFileIcon(file.type)} alt={file.type} className="h-6 w-6 object-contain" />}
                    </a>
                  </Tooltip>
                ))
              ) : (
                <span>Không có tệp đính kèm</span>
              )}
            </div>
          </Descriptions.Item>
        </Descriptions>
        <Typography className="mt-6">
          <Title level={4}>Mô tả dự án</Title>
          <div dangerouslySetInnerHTML={{ __html: (data && data.description) || "" }}></div>
        </Typography>
      </Card>
      {/* <ActionModule type={EPageTypes.VIEW} formikRef={formikRef} project={data} /> */}
    </>
  );
};

export default DetailProject;
