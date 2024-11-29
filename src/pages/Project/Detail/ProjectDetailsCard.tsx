/* eslint-disable max-len */
import { Card, Descriptions, Tooltip, Typography } from "antd";
import { INewProject } from "@/services/store/project/project.model";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { convertTimestamp } from "@/shared/utils/common/convertTimestamp";
import { STATUS_PROJECT, STATUS_PROJECT_LABELS } from "@/shared/enums/statusProject";
import { SUBMIT_METHOD } from "@/shared/enums/submissionMethod";
import { DOMESTIC, mappingDOMESTIC } from "@/shared/enums/domestic";
import PDF from "@/assets/images/pdf.png";
import EXCEL from "@/assets/images/excel.png";
import WORD from "@/assets/images/word.jpg";
import { Link } from "react-router-dom";

const { Title } = Typography;

interface ProjectDetailsCardProps {
  data: INewProject | undefined;
  title?: string;
  customDetails?: { label: string; value: any }[]; // Thêm prop cho các trường tùy chỉnh
}

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

const ProjectDetailsCard: React.FC<ProjectDetailsCardProps> = ({ data, title, customDetails = [] }) => {
  
  // Mặc định các trường dự án
  const defaultDetails = [
    { label: "Tên Dự Án", value: data?.name },
    { label: "Địa Điểm", value: data?.location },
    { label: "Nguồn Vốn", value: data?.funding_sourceName },
    { label: "Ngành Nghề", value: data?.arrayIndustry?.map((industry) => industry).join(", ") },
    { label: "Số Tiền", value: data?.amount !== undefined && convertMoney(data.amount.toString()) },
    { label: "Hình thức lựa chọn nhà thầu", value: data?.selection_methodName },
    { label: "Bên Mời Thầu", value: data?.tendererName },
    { label: "Người phê duyệt", value: data?.staffName },
    { label: "Số quyết định ban hành", value: data?.decision_number_issued },
    { label: "Tổng đầu tư", value: data?.total_amount !== undefined && convertMoney(data.total_amount.toString()) },
    { label: "Hình thức tham gia đấu thầu", value: data && getSubmissionMethodLabel(data.submission_method) },
    { label: "Chủ đầu tư", value: data?.investorName },
    { label: "Dịch vụ mua sắm đấu thầu công", value: (data?.procurement_category_name?.map((category: any) => category.name).join(", ")) || "Chưa có dịch vụ mua sắm đấu thầu công" },
    { label: "Dự án hiện tại", value: data && getDomesticLabel(data.is_domestic) },
    { label: "Địa Điểm Nhận Hồ Sơ", value: data?.receiving_place },
    { label: "Thời Gian Nộp Hồ Sơ", value: data && convertTimestamp(data.bid_submission_start) },
    { label: "Ngày Kết Thúc Nộp Hồ Sơ", value: data && convertTimestamp(data.bid_submission_end) },
    { label: "Ngày Mở Thầu", value: data && convertTimestamp(data.bid_opening_date) },
    { label: "Ngày Bắt Đầu Đấu Thầu", value: data && convertTimestamp(data.start_time) },
    { label: "Ngày Kết Thúc Đấu Thầu", value: data && convertTimestamp(data.end_time) },
    { label: "Trạng Thái Dự Án", value: data && getStatusLabel(String(data.status)) },
    {
      label: "File đính kèm",
      value: (
        <div className="flex flex-wrap items-center gap-4">
          {data && data.attachments && data.attachments.length > 0 ? (
            data.attachments.map((file: any, index: number) => (
              <Tooltip title={file.name} color={"#108ee9"} key={index}>
                <a
                  href={file.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                  {file.type && getFileIcon(file.type) && (
                    <img src={getFileIcon(file.type)} alt={file.type} className="h-6 w-6 object-contain" />
                  )}
                </a>
              </Tooltip>
            ))
          ) : (
            <span>Không có tệp đính kèm</span>
          )}
        </div>
      ),
    },
    {
      label: "Doanh nghiệp tham gia",
      value: data?.tenderer?.length > 0 ? (
        data?.industries.map((item: any) => (
          <Tooltip title="Xem chi tiết" key={item.id}>
            <Link to={`/enterprise/detail/${item.id}`} className="text-blue-600 hover:underline">
              {item.name}
            </Link>
          </Tooltip>
        )).reduce((prev: any, curr: any) => [prev, ', ', curr])
      ) : (
        "Chưa có doanh nghiệp tham gia"
      )
    }
  ];

  // Kết hợp các trường mặc định với các trường tùy chỉnh
  const projectDetails = [...defaultDetails, ...customDetails];

  return (
    <Card title={title} className="shadow-lg">
      <Descriptions bordered>
        {projectDetails.map((item, index) => (
          <Descriptions.Item className="!py-[10px] px-6" label={item.label} span={3} key={index}>
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Typography className="mt-6">
        <Title level={4}>Mô tả dự án</Title>
        <div dangerouslySetInnerHTML={{ __html: data?.description || "" }}></div>
      </Typography>
    </Card>
  );
};

export default ProjectDetailsCard;