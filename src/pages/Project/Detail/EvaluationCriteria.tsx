import { checkPermission } from "@/helpers/checkPermission";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { IEvaluationCriteria } from "@/services/store/evaluation/evaluation.model";
import { EPermissions } from "@/shared/enums/permissions";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
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
          index: index + 1,
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
