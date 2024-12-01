import { Card, Collapse, Descriptions, Tooltip, Typography } from "antd";
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
import { IBidBond } from "@/services/store/bid_bond/bidBond.model";
import { mappingBidBond, TypeBidBond } from "@/shared/enums/types";
import { IEnterprise } from "@/services/store/enterprise/enterprise.model";
import BiddingDocument from "./BiddingDocument";
import { IBiddingResult } from "@/services/store/biddingResult/biddingResult.model";
import { IBidDocument } from "@/services/store/bid_document/bid_document.model";
import IMAGE_ICON from "@/assets/images/customerDefaultAvatar.png";
import DEFAULT_FILE from "@/assets/images/file_error.png";
import BiddingResult from "./BiddingResult";
const { Title } = Typography;
const { Panel } = Collapse;
interface ProjectDetailsCardProps {
  data?: INewProject | undefined;
  data2?: IBiddingResult;
  dataBidDoc?: IBidDocument;
  title?: string;
  customDetails?: { label: string; value: any }[];
  listEnterprise?: IEnterprise[];
  showDefaultDetails?: boolean;
}
interface BiddingBondsListProps {
  items: {
    bidding_bond: IBidBond;
  }[];
  title_project?: string;
  listEnterprise?: IEnterprise[];
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

export const getFileIcon = (fileType: string | undefined) => {
  if (!fileType) {
    return DEFAULT_FILE;
  }

  const isFullFileName = fileType.includes(".");
  const extension = isFullFileName ? fileType.split(".").pop()!.toLowerCase() : fileType.toLowerCase(); // Sử dụng '!' để khẳng định rằng pop không trả về undefined

  switch (extension) {
    case "pdf":
      return PDF;
    case "xlsx":
    case "xls":
      return EXCEL;
    case "doc":
    case "docx":
      return WORD;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return IMAGE_ICON;
    default:
      return DEFAULT_FILE;
  }
};

const BiddingBondsList: React.FC<BiddingBondsListProps> = ({ items, title_project, listEnterprise }) => {
  const enterpriseName = (value: number) => {
    if (listEnterprise!.length > 0 && !!value) {
      return listEnterprise!.find((item) => item.id === value)?.name;
    }
  };
  const collapseItems = items.map((data, index) => ({
    key: index.toString(), // Convert index to string for key
    label: `Bảo lãnh dự án ${title_project}`, // Dynamic label for each panel
    children: (
      <div className="w-full">
        <div>
          <strong>Số tiền bảo lãnh:</strong> {data.bidding_bond.bond_amount}
        </div>
        <div>
          <strong>Loại bảo lãnh:</strong>{" "}
          {data?.bidding_bond?.bond_type ? mappingBidBond[data?.bidding_bond?.bond_type as unknown as TypeBidBond] : ""}
        </div>
        <div>
          <strong>Số bảo lãnh:</strong> {data.bidding_bond.bond_number}
        </div>
        <div>
          <strong>Số tiền bảo lãnh (viết bằng chữ):</strong> {data.bidding_bond.bond_amount_in_words}
        </div>
        <div>
          <strong>Tên tổ chức phát hành:</strong> {enterpriseName(+data?.bidding_bond?.enterprise_id!)}
        </div>
        <div>
          <strong>Ngày phát hành:</strong> {data.bidding_bond.issue_date}
        </div>
        <div>
          <strong>Ngày hết hạn:</strong> {data.bidding_bond.expiry_date}
        </div>
        <div>
          <strong>Mô tả:</strong> {data.bidding_bond.description}
        </div>
      </div>
    ),
  }));

  return (
    <Collapse defaultActiveKey={["1"]}>
      {collapseItems.length > 0 ? (
        collapseItems.map((item) => (
          <Panel header={item.label} key={item.key}>
            {item.children}
          </Panel>
        ))
      ) : (
        <Panel header="Bảo lãnh dự án" key="1">
          <div>Chưa có dịch vụ mua sắm đấu thầu công</div>
        </Panel>
      )}
    </Collapse>
  );
};
const ProjectDetailsCard: React.FC<ProjectDetailsCardProps> = ({
  data2,
  data,
  title,
  customDetails = [],
  listEnterprise,
  showDefaultDetails = true,
  dataBidDoc,
}) => {
  // Mặc định các trường dự án
  const defaultDetails = [
    { label: "Tên dự án", value: data?.name },
    { label: "Địa điểm", value: data?.location },
    { label: "Nguồn tài trợ", value: data?.funding_sourceName },
    { label: "Ngành nghề", value: data?.arrayIndustry?.map((industry) => industry).join(", ") },
    { label: "Số tiền", value: data?.amount !== undefined && convertMoney(data.amount.toString()) },
    { label: "Hình thức lựa chọn nhà thầu", value: data?.selection_methodName },
    { label: "Bên mời thầu", value: data?.tendererName },
    { label: "Người phê duyệt", value: data?.staffName },
    { label: "Số quyết định ban hành", value: data?.decision_number_issued },
    { label: "Tổng đầu tư", value: data?.total_amount !== undefined && convertMoney(data.total_amount.toString()) },
    { label: "Hình thức tham gia đấu thầu", value: data && getSubmissionMethodLabel(data.submission_method) },
    { label: "Chủ đầu tư", value: data?.investorName },
    {
      label: "Dịch vụ mua sắm đấu thầu công",
      value: (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {data?.procurement_category_name && data.procurement_category_name.length > 0 ? (
            data.procurement_category_name.map((item: any, index: number) => (
              <div key={index}>{item}</div> // Render each name inside a div
            ))
          ) : (
            <div>Chưa có dịch vụ mua sắm đấu thầu công</div> // Fallback message
          )}
        </>
      ),
    },
    { label: "Dự án hiện tại", value: data && getDomesticLabel(data.is_domestic) },
    {
      label: "Bảo lãnh dự thầu",
      value: data?.bidding_bond ? (
        <BiddingBondsList items={[{ bidding_bond: data.bidding_bond }]} title_project={data?.name} listEnterprise={listEnterprise} />
      ) : (
        <div>Chưa có bảo lãnh dự thầu</div>
      ),
    },

    {
      label: "Kết quả đấu thầu",
      value: data?.bidding_result ? (
        <BiddingResult
          items={[{ bidding_result: data.bidding_result }]}
          listBidDocument={data?.bidding_document}
          title_project={data?.name}
          listEnterprise={listEnterprise}
        />
      ) : (
        <div>Chưa có bảo lãnh dự thầu</div>
      ),
    },
    { label: "Địa điểm nhận hồ sơ", value: data?.receiving_place },
    { label: "Thời gian nộp hồ sơ", value: data && convertTimestamp(data.bid_submission_start) },
    { label: "Ngày kết thúc nộp hồ sơ", value: data && convertTimestamp(data.bid_submission_end) },
    { label: "Ngày mở thầu", value: data && convertTimestamp(data.bid_opening_date) },
    { label: "Ngày bắt đầu đấu thầu", value: data && convertTimestamp(data.start_time) },
    { label: "Ngày kết thúc đấu thầu", value: data && convertTimestamp(data.end_time) },
    { label: "Trạng thái dự án", value: data && getStatusLabel(String(data.status)) },
    {
      label: "File đính kèm",
      value: (
        <div className="flex flex-wrap items-center gap-4">
          {data && data.attachments && data.attachments.length > 0 ? (
            data.attachments.map((file: any, index: number) => (
              <Tooltip title={file.name} color={"#108ee9"} key={index}>
                <a href={file.path} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                  {file.type && getFileIcon(file.type) && <img src={getFileIcon(file.type)} alt={file.type} className="h-6 w-6 object-contain" />}
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
      value:
        data?.tenderer?.length > 0
          ? data?.industries
              .map((item: any) => (
                <Tooltip title="Xem chi tiết" key={item.id}>
                  <Link to={`/enterprise/detail/${item.id}`} className="text-blue-600 hover:underline">
                    {item.name}
                  </Link>
                </Tooltip>
              ))
              .reduce((prev: any, curr: any) => [prev, ", ", curr])
          : "Chưa có doanh nghiệp tham gia",
    },
  ];

  // Kết hợp các trường mặc định với các trường tùy chỉnh
  const projectDetails = showDefaultDetails ? [...defaultDetails, ...customDetails] : customDetails;

  return (
    <Card title={title} className="shadow-lg">
      <Descriptions
        bordered
        column={24} // Set total columns to 24 for easier division
      >
        {projectDetails.map((item, index) => (
          <Descriptions.Item
            className="!py-[10px] px-6 font-medium"
            label={item.label}
            labelStyle={{ width: "25%" }} // Make label take up 25% of space (6/24)
            contentStyle={{ width: "75%" }} // Make content take up 75% of space (18/24)
            span={24} // Each item takes full width
            key={index}
          >
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
      {showDefaultDetails && (
        <>
          <BiddingDocument listBidDocument={data?.bidding_document} title={"Hồ sơ dự thầu"} />
          <Typography className="mt-6">
            <Title level={4}>Mô tả dự án</Title>
            <div dangerouslySetInnerHTML={{ __html: data?.description || "" }}></div>
          </Typography>
        </>
      )}
    </Card>
  );
};

export default ProjectDetailsCard;
