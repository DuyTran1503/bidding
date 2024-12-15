import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { ITaskInitialState } from "@/services/store/task/task.slice";
import { getListTask } from "@/services/store/task/task.thunk";
import { IWorkProgressInitialState, resetStatus, setFilter } from "@/services/store/workProgresses/workProgresses.slice";
import { deleteWorkProgress, getAllWorkProgresses } from "@/services/store/workProgresses/workProgresses.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { mappingTypeFeedback, TypeFeedback } from "@/shared/enums/typeFeedback";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { formatTreeData } from "../BiddingFields/BiddingFields/BiddingFields";
import { convertDataOptions } from "../Project/helper";
import { optionWorkProgress } from "./ActionModule";
import { EPermissions } from "@/shared/enums/permissions";

const WorkProgresses = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IWorkProgressInitialState>("work_progress");
  const { state: stateTask, dispatch: dispatchTask } = useArchive<ITaskInitialState>("task");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const [parentOptions, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);

  const feedbackColors: { [key in TypeFeedback]: string } = {
    [TypeFeedback.POOR]: "bg-red-500 text-white", // Màu cho Kém
    [TypeFeedback.MEDIUM]: "bg-yellow-500 text-black", // Màu cho Trung bình
    [TypeFeedback.GOOD]: "bg-green-500 text-white", // Màu cho Tốt
    [TypeFeedback.VERYGOOD]: "bg-blue-500 text-white",
    [TypeFeedback.EXCELLENT]: "bg-[#009071]",
  };
  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-[80px]",
    },
    {
      dataIndex: "project",
      title: "Dự án",
      className: "w-[200px]",
      render: (_, record) => {
        return <span>{record.project?.name || ""}</span>;
      },
    },
    {
      dataIndex: "name",
      title: "Tên tiến độ",
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
        return record.task && Array.isArray(record.task) && record.task.length > 0 ? (
          <ul className="list-disc pl-4">
            {record.task.map((task: any, index: number) => (
              <li key={index}>{task.name}</li>
            ))}
          </ul>
        ) : (
          "Không có"
        );
      },
    },

    {
      dataIndex: "feedback",
      title: "Nhận xét",
      render: (_, record) => {
        const feedback = record.feedback as TypeFeedback;
        const feedbackText = mappingTypeFeedback[feedback] || "Không xác định";
        const feedbackClass = feedbackColors[feedback] || "bg-[#009071] text-black";

        return (
          <Tag color={` ${feedbackClass}`} className={`inline-block rounded-full px-3 py-1 ${feedbackClass}`}>
            {feedbackText}
          </Tag>
        );
      },
    },
    {
      dataIndex: "expense",
      title: "Chi phí",
      render: (_, record) => {
        return convertMoney(record.expense);
      },
    },
  ];
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`detail/${record?.key}`);
      },
      permission: EPermissions.DETAIL_WORK_PROGRESS,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_WORK_PROGRESS,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteWorkProgress(record?.key));
      },
      permission: EPermissions.DESTROY_WORK_PROGRESS,
    },
  ];
  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên tiến độ...",
      label: "Tên tiến độ",
      type: "text",
    },
    {
      id: "project_id",
      placeholder: "Chọn dự án ...",
      label: "Tên dự án",
      type: "treeSelect",
      treeData: parentOptions,
    },
    {
      id: "task",
      placeholder: "Chọn nhiệm vụ...",
      label: "Nhiệm vụ ",
      type: "select",
      options: convertDataOptions(Array.isArray(stateTask?.listTasks) ? stateTask.listTasks : []),
    },
    {
      id: "feedback",
      placeholder: "Chọn nhận xét...",
      label: "Nhận xét ",
      type: "select",
      options: optionWorkProgress,
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
    const formattedData = formatTreeData(stateProject?.listProjects || []);
    setTreeData(formattedData);
  }, [stateProject?.listProjects]);
  useEffect(() => {
    dispatch(getAllWorkProgresses({ query: state.filter }));
    dispatchTask(getListTask());
    dispatchProject(getListProject());
  }, [state.filter]);
  return (
    <>
      <Heading
        title="Tiến độ dự án "
        hasBreadcrumb
        buttons={[
          {
            text: "Tạo mới",
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_WORK_PROGRESS,
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
