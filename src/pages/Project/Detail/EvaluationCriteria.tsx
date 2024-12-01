import Button from "@/components/common/Button";
import { ITableData } from "@/components/table/PrimaryTable";
import { checkPermission } from "@/helpers/checkPermission";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";
import { getListBidBond } from "@/services/store/bid_bond/bidBond.thunk";
import { IBidDocument } from "@/services/store/bid_document/bid_document.model";
import { IEnterprise } from "@/services/store/enterprise/enterprise.model";
import { IEvaluationCriteria } from "@/services/store/evaluation/evaluation.model";
import { EPermissions } from "@/shared/enums/permissions";
import { Collapse, Table, TableProps, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import clsx from "clsx";
import { useEffect, useMemo } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface IProps {
  listEvaluationCriteria?: IEvaluationCriteria[];
  title?: string;
}
const EvaluationCriteria: React.FC<IProps> = ({ listEvaluationCriteria, title }) => {
  const { state } = useArchive<IAuthInitialState>("auth");

  const navigate = useNavigate();
  const hasPermission = checkPermission(state?.profile?.permissions, EPermissions.DETAIL_ENTERPRISE);

  const handleRedirect = (id: string) => {
    hasPermission && navigate(`/enterprise/detail/${id}`, { replace: true });
  };

  const columns: ColumnsType = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (text, record, index: number) => <span>{index + 1}</span>, // Hiện số thứ tự
    },
    {
      title: "Tên tiêu chí đánh giá",
      dataIndex: "name",
    },
    {
      title: "Tên dự án",
      dataIndex: "project_id",
    },
    {
      title: "Số điểm",
      dataIndex: "weight",
    },
    {
      title: "Ngày tạo tiêu chí đánh giá",
      dataIndex: "submission_date",
    },
  ];

  const data: any[] = useMemo(() => {
    return Array.isArray(listEvaluationCriteria)
      ? listEvaluationCriteria.map(({ id, name, project_id, weight, created_at }, index) => ({
          id,
          key: id,
          name: name,
          project_id: project_id,
          weight,
          created_at,
        }))
      : [];
  }, [JSON.stringify(listEvaluationCriteria)]);

  return (
    <>
      <div className="p-2 text-[14px] font-semibold text-[#000000a6]">{title}</div>
      <Table
        bordered
        columns={columns}
        dataSource={data}
        onRow={(record) => ({
          onClick: () => handleRedirect(record?.id),
        })}
      />
    </>
  );
};
export default EvaluationCriteria;
