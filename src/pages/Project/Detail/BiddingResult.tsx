import { checkPermission } from "@/helpers/checkPermission";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { IBidDocument } from "@/services/store/bid_document/bid_document.model";
import { IBiddingResult } from "@/services/store/biddingResult/biddingResult.model";
import { IEnterprise } from "@/services/store/enterprise/enterprise.model";
import { EPermissions } from "@/shared/enums/permissions";
import { Collapse, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
const { Panel } = Collapse;
interface IProps {
  items: {
    bidding_result: IBiddingResult;
  }[];
  title_project?: string;
  listEnterprise?: IEnterprise[];
  listBidDocument?: IBidDocument[];
}
const BiddingResult: React.FC<IProps> = ({ items, title_project, listEnterprise }) => {
  const { state } = useArchive<IAuthInitialState>("auth");
  const enterpriseName = (value: number) => {
    if (listEnterprise!.length > 0 && !!value) {
      return listEnterprise!.find((item) => item.id === value)?.name;
    }
  };

  const navigate = useNavigate();
  const hasPermission = checkPermission(state?.profile?.permissions, EPermissions.DETAIL_ENTERPRISE);
  const collapseItems = items.map((data, index) => ({
    key: index.toString(), // Convert index to string for key
    label: `Bảo lãnh dự án ${title_project}`, // Dynamic label for each panel
    children: (
      <div className="w-full">
        <div className="flex gap-1">
          <strong>Doanh nghiệp trúng thầu:</strong>
          <Tooltip title={"Chi tiết doanh nghiệp"} color={"#108ee9"}>
            <div
              onClick={() => {
                hasPermission && navigate(`/enterprise/detail/${data.bidding_result.enterprise_id}`, { replace: true });
              }}
              className={`${hasPermission ? "cursor-pointer text-blue-600 hover:underline" : ""}`}
            >
              {enterpriseName(data.bidding_result.enterprise_id as number)}
            </div>
          </Tooltip>
        </div>
        <div>
          <strong>Số quyết đinh:</strong> {data.bidding_result.decision_number || ""}
        </div>
        <div>
          <strong>Ngày quyết đinh:</strong> {data.bidding_result.decision_date || ""}
        </div>
        <div>
          <strong>Số tiền trúng thầu:</strong> {data.bidding_result.win_amount || ""}
        </div>
        <div className="flex gap-1">
          <strong>Hồ sơ trúng thầu:</strong>
          <Tooltip title={"Hồ sơ trúng thầu"} color={"#108ee9"}>
            <div
              onClick={() => {
                hasPermission && navigate(`/bid-document/detail/${data.bidding_result.bid_document_id}`, { replace: true });
              }}
              className={`${hasPermission ? "cursor-pointer text-blue-600 hover:underline" : ""}`}
            >
              Hồ sơ trúng thầu của {enterpriseName(data.bidding_result.enterprise_id as number)}
            </div>
          </Tooltip>
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
export default BiddingResult;
