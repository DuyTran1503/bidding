import { emptyText } from "@/components/table/PrimaryTable";
import { checkPermission } from "@/helpers/checkPermission";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { IBidDocument } from "@/services/store/bid_document/bid_document.model";
import { EPermissions } from "@/shared/enums/permissions";
import { Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import clsx from "clsx";
import { useMemo } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface IProps {
  listBidDocument?: IBidDocument[];
  title?: string;
}
const BiddingDocument: React.FC<IProps> = ({ listBidDocument, title }) => {
  const { state } = useArchive<IAuthInitialState>("auth");

  const navigate = useNavigate();
  const hasPermission = checkPermission(state?.profile?.permissions, EPermissions.DETAIL_ENTERPRISE);

  const handleRedirect = (id: string) => {
    hasPermission && navigate(`/enterprise/detail/${id}`, { replace: true });
  };

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-[40px]",
    },
    {
      title: "Doanh nghiệp",
      dataIndex: "enterpriseName",
      render(_, record) {
        return record.enterpriseName;
      },
    },
    {
      title: "Giá dự thầu",
      dataIndex: "bid_price",
    },
    {
      title: "Mã bảo lãnh doanh nghiệp",
      dataIndex: "bid_bond",
    },
    {
      title: "Ngày gửi hồ sơ",
      dataIndex: "submission_date",
    },
    {
      title: "Thời gian dự kiến ",
      dataIndex: "implementation_time",
      key: "implementation_time",
    },
    {
      title: "Thời gian hiệu lực ",
      dataIndex: "validity_period",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record, index) => {
        return (
          <Tooltip title="Chi tiết doanh nghiệp" key={index}>
            <IoEyeOutline
              className={clsx("cursor-pointer text-xl text-blue-500", { "cursor-not-allowed opacity-50": !hasPermission })}
              onClick={() => {
                handleRedirect(record.enterprise.id);
              }}
            />
          </Tooltip>
        );
      },
    },
  ];

  const data: any[] = useMemo(() => {
    return Array.isArray(listBidDocument)
      ? listBidDocument.map(
          ({ id, enterprise, bid_bond, submission_date, bid_price, implementation_time, validity_period, status, note }, index) => ({
            index: index + 1,
            id,
            key: id,
            enterpriseName: enterprise?.user?.name,
            bid_bond: bid_bond && bid_bond.bond_number,
            submission_date,
            bid_price,
            implementation_time,
            validity_period,
            status,
            note: note || "",
            enterprise,
          }),
        )
      : [];
  }, [JSON.stringify(listBidDocument)]);

  return (
    <>
      <div className="p-2 text-[14px] font-semibold text-[#000000a6]">{title}</div>
      <Table
        bordered
        columns={columns}
        dataSource={data}
        locale={{ emptyText }}
        onRow={(record) => ({
          onClick: () => handleRedirect(record?.enterprise.id),
        })}
      />
    </>
  );
};
export default BiddingDocument;
