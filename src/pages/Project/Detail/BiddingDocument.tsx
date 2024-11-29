import Button from "@/components/common/Button";
import { ITableData } from "@/components/table/PrimaryTable";
import { checkPermission } from "@/helpers/checkPermission";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { IBidDocument } from "@/services/store/bid_document/bid_document.model";
import { IEnterprise } from "@/services/store/enterprise/enterprise.model";
import { EPermissions } from "@/shared/enums/permissions";
import { Collapse, Table, TableProps, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import clsx from "clsx";
import { useMemo } from "react";
import { IoEyeOutline } from "react-icons/io5";

interface IProps {
    listBidDocument?: IBidDocument[];
    title?: string
}
interface DataType extends IBidDocument {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    tags: string[];
}
const BiddingDocument: React.FC<IProps> = ({ listBidDocument, title }) => {
    const { state } = useArchive<IAuthInitialState>("auth");
    const hasPermission = checkPermission(state?.profile?.permissions, EPermissions.DETAIL_ENTERPRISE);

    const columns: ColumnsType = [
        {
            title: 'STT',
            dataIndex: 'stt',
            render: (text, record, index: number) => <span>{index + 1}</span>, // Hiện số thứ tự
        },
        {
            title: 'Doanh nghiệp',
            dataIndex: 'enterprise',
        },
        {
            title: 'Giá dự thầu',
            dataIndex: 'bid_price',
        },
        {
            title: 'Mã bảo lãnh doanh nghiệp',
            dataIndex: 'bid_bond_id',
        },
        {
            title: 'Ngày gửi hồ sơ',
            dataIndex: 'submission_date',
        },
        {
            title: 'Thời gian dự kiến ',
            dataIndex: 'implementation_time',
            key: 'implementation_time',
        },
        {
            title: 'Thời gian hiệu lực ',
            dataIndex: 'validity_period',
           
        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => {

                return (
                    <Tooltip title="Chi tiết" key={index}>
                        <IoEyeOutline
                            className={clsx(
                                "cursor-pointer text-xl text-blue-500",
                                { "opacity-50 cursor-not-allowed": !hasPermission }
                            )}
                            onClick={() => {
                                console.log('fdg');

                            }}
                        />
                    </Tooltip>
                );
            },
        },
    ];

    const data: IBidDocument[] = useMemo(() => {
        return Array.isArray(listBidDocument)
          ? listBidDocument.map(({ id, enterprise, bid_bond_id, submission_date, bid_price, implementation_time, validity_period, technical_score, financial_score, totalScore, ranking, status, notes }, index) => ({
              id,
              key:id,
              project_id: undefined,
              enterprise_id: Number(enterprise?.id) || 0, // Chuyển đổi thành number
              bid_bond_id,
              submission_date,
              bid_price,
              implementation_time,
              validity_period,
              technical_score,
              financial_score,
              totalScore,
              ranking,
              status,
              notes: notes || '',
              enterprise: enterprise ? { id: enterprise.id, name: enterprise.name } : undefined,
              project: undefined,
            }))
          : [];
      }, [JSON.stringify(listBidDocument)]);

    return (
        <>
            <div className="p-4 text-[14px] text-[#000000a6] font-">{title}</div>
            <Table columns={columns} dataSource={data} />
        </>
    );
};
export default BiddingDocument