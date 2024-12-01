import { ITableData } from "@/components/table/PrimaryTable";
import { checkPermission } from "@/helpers/checkPermission";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { INewProject } from "@/services/store/project/project.model";
import { EPermissions } from "@/shared/enums/permissions";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import clsx from "clsx";
import { useMemo } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface IProps {
  listChildrenProject?: INewProject[];
  title?: string;
}
const ListChildrenProject: React.FC<IProps> = ({ listChildrenProject, title }) => {
  const { state } = useArchive<IAuthInitialState>("auth");

  const navigate = useNavigate();
  const hasPermission = checkPermission(state?.profile?.permissions, EPermissions.DETAIL_ENTERPRISE);

  const handleRedirect = (id: string) => {
    hasPermission && navigate(`/project/detail/${id}`, { replace: true });
  };

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-[40px]",
    },
    {
      dataIndex: "name",
      title: "Tên dự án",
    },
    {
      dataIndex: "investor",
      title: "Chủ đầu tư",
      render(_, record) {
        return record.investor?.name;
      },
    },
    {
      dataIndex: "total_amount",
      title: "Tổng giá gói thầu",
      render(_, record) {
        return convertMoney(record?.total_amount);
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, record, index) => {
        return (
          <Tooltip title="Chi tiết dự án" key={index}>
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

  const data: ITableData[] = useMemo(() => {
    return Array.isArray(listChildrenProject)
      ? listChildrenProject.map(({ id, name, investor, total_amount, upload_time, bid_submission_start, bid_opening_date, status }, index) => ({
          index: index + 1,
          key: id,
          name,
          investor,
          total_amount,
          upload_time,
          bid_submission_start,
          bid_opening_date,
          status,
        }))
      : [];
  }, [JSON.stringify(listChildrenProject)]);
  return (
    <>
      <div className="pb-2 pt-5 text-[14px] font-semibold text-[#000000a6]">{title}</div>
      <Table
        bordered
        columns={columns}
        dataSource={data}
        onRow={(record) => ({
          onClick: () => handleRedirect(record?.key),
        })}
      />
    </>
  );
};
export default ListChildrenProject;
