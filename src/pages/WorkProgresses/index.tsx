import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus, setFilter } from "@/services/store/employee/employee.slice";
import { IWorkProgressInitialState } from "@/services/store/workProgress/workProgress.slice";
import { deleteWorkProgress, getAllWorkProgresses } from "@/services/store/workProgress/workProgress.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { GoDownload } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const WorkProgresses = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IWorkProgressInitialState>("work_progress");

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-[200px]",
    },
    {
      dataIndex: "project",
      title: "Dự án",
      className: "w-[200px]",
      render: (_, record) => {
        return <span>{record.project?.name || "Khong co"}</span>;
      },
    },
    {
      dataIndex: "name",
      title: "Tên tiến độ",
      className: "w-[200px]",
    },
    {
      dataIndex: "progress",
      title: "Tiến độ",
      className: "w-[200px]",
    },
    {
      dataIndex: "task",
      title: "Nhiệm vụ",
      className: "w-[200px]",
      render: (_, record) => {
        return <span>{record.task?.map(name => (name.name)) || "Khoong cos"}</span>;
      },
    },
    {
      dataIndex: "feedback",
      title: "Nhận xét",
      className: "w-[200px]",
    },
    { 
      dataIndex: "expense",
      title: "Chi phí",
      className: "w-[200px]",
    },
    {
      dataIndex: "start_date",
      title: "Ngày bắt đầu",
      className: "w-[200px]",
    },
    {
      dataIndex: "end_date",
      title: "Ngày kết thúc",
      className: "w-[200px]",
    },

  ];
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`detail/${record?.key}`);
      },
      // permission: EPermissions.DETAIL_WORK_PROGRESS,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`update/${record?.key}`);
      },
      // permission: EPermissions.UPDATE_EMPLOYEE,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteWorkProgress(record?.key));
      },
      // permission: EPermissions.DESTROY_EMPLOYEE,
    },
  ];
  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên nhân viên...",
      title: "Tên nhân viên",
      type: "text",
    },

  ];

  const data: ITableData[] = useMemo(
    () =>
      state.workProgresses && state.workProgresses.length > 0
        ? state.workProgresses.map(({ id, project, name, progress, expense, start_date, end_date, task, feedback, description }, index) => ({
            index: index + 1,
            key: id,
            project,
            name,
            progress,
            expense,
            start_date,
            end_date,
            feedback,
            description,
            task,
          }))
        : [],
    [state.workProgresses],
  );

  useFetchStatus({
    module: "work_progress",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    dispatch(getAllWorkProgresses({ query: {} })); // Load toàn bộ dữ liệu khi component mount
  }, []);

  return (
    <>
      <Heading
        title="Tiến độ dự án "
        hasBreadcrumb
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
          },
          {
            text: "Thêm tiến độ dự án",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              navigate("/work-progresses/create");
            },
          },
        ]}
      />
      <ManagementGrid
        columns={columns}
        data={data}
        search={search}
        buttons={buttons}
        pagination={{
          current: state.filter.page ?? 1,
          pageSize: state.filter.size ?? 10,
          total: state.totalRecords,
        }}
        setFilter={setFilter}
        filter={state.filter}
      />
    </>
  );
};

export default WorkProgresses;
