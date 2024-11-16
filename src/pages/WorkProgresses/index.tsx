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
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { GoDownload } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const WorkProgresses = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IWorkProgressInitialState>("work_progress");
  // const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");

  // const projectName = (value: number) => {
  //   if (stateProject?.listProjects!.length > 0 && !!value) {
  //     return stateProject?.listProjects!.find((item) => item.id === value)?.name;
  //   }
  // };

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

    // {
    //   dataIndex: "desciption",
    //   title: "Mô tả",
    //   className: "w-[250px]",

    //   render(_, record) {
    //     return <div className="text-compact-3" dangerouslySetInnerHTML={{ __html: record?.description || "" }}></div>;
    //   },
    // },
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
    [JSON.stringify(state.workProgress)],
  );

  useFetchStatus({
    module: "work_progress",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  // useEffect(() => {
  //   if (state.status === EFetchStatus.FULFILLED) {
  //     dispatch(getAllWorkProgresses({query: state.status}))
  //   }
  // },[JSON.stringify(state.status)])

  useEffect(() => {
    dispatch(getAllWorkProgresses({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  // useEffect(() => {
  //   dispatch(getListProject());
  // },[dispatchProject])
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
