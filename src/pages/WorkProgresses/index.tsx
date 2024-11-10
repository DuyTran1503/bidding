import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus, setFilter } from "@/services/store/employee/employee.slice";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { IWorkProgressInitialState } from "@/services/store/workProgress/workProgress.slice";
import { deleteWorkProgress, getAllWorkProgresses } from "@/services/store/workProgress/workProgress.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { List } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { GoDownload } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const WorkProgresses = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IWorkProgressInitialState>("work_progress");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");

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
    {
      dataIndex: "feedback",
      title: "Nhận xét",
      className: "w-[200px]",
    },
    {
      dataIndex: "desciption",
      title: "Mô tả",
      className: "w-[250px]",

      render(_, record) {
        return <div className="text-compact-3" dangerouslySetInnerHTML={{ __html: record?.description || "" }}></div>;
      },
    },
    {
      dataIndex: "task",
      title: "Nhiệm vụ",
      className: "w-[200px]",
      render(_, record) {
        // console.log(record?.task?.map(item=>item.name));

        return (
          <List
          dataSource={record?.task || []}  // Gán dataSource là mảng task từ record
          renderItem={(stateProject) => (
            <List.Item
              style={{
                padding: '4px 8px',  
              }}
            >
              {stateProject.name} {/* Hiển thị tên của mỗi nhiệm vụ */}
            </List.Item>
          )}
        />
        );
      },
    },
  ];
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/work-progress/detail/${record?.key}`);
      },
      // permission: EPermissions.DETAIL_EMPLOYEE,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/work-progress/update/${record?.key}`);
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
    // {
    //   id: "name",
    //   placeholder: "Nhập tên nhân viên...",
    //   title: "Tên nhân viên",
    //   type: "text",
    // },
    // {
    //   id: "email",
    //   placeholder: "Nhập email...",
    //   title: "Tên email",
    //   type: "text",
    // },
    // {
    //   id: "address",
    //   placeholder: "Nhập địa chỉ...",
    //   title: "Tên địa chỉ",
    //   type: "text",
    // },
    // {
    //   id: "status",
    //   placeholder: "Chọn trạng thái làm việc...",
    //   title: "Tên trạng thái làm việc",
    //   type: "select",
    //   options: optionStatus,
    // },
    // {
    //   id: "status",
    //   placeholder: "Chọn trình độ học vấn...",
    //   title: "Tên trình độ học vấn",
    //   type: "select",
    //   options: optionEducation,
    // },
    // {
    //   id: "enterprise_id",
    //   placeholder: "Chọn tên doanh nghiệp...",
    //   title: "Tên doanh nghiệp",
    //   type: "select",
    //   options: enterpriseOption as { value: string; label: string }[],
    // },
  ];
  const data: ITableData[] = useMemo(() => {
    return Array.isArray(state.workProgresses)
      ? state.workProgresses.map((item, index) => ({
          index: index + 1,
          key: item.id, // Use item.id as the unique key
          project: item.project,
          name: item.name,
          progress: item.progress,
          expense: item.expense,
          start_date: item.start_date,
          end_date: item.end_date,
          feedback: item.feedback,
          description: item.description,
          task: item.task,
        }))
      : [];
  }, [JSON.stringify(state.workProgresses)]);

  useFetchStatus({
    module: "work_progress",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    dispatch(getAllWorkProgresses({ query: state.filter }));
    dispatchProject(getListProject());
  }, [JSON.stringify(state.filter), JSON.stringify(state.status)]);
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
