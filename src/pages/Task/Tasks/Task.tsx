import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import TaskForm from "../TaskForm";
import { ITaskInitialState, resetStatus, setFilter } from "@/services/store/task/task.slice";
import { deleteTask, getAllTasks } from "@/services/store/task/task.thunk";
import { levelTaskEnumArray, mappingLevelTask } from "@/shared/enums/level";
import { IEmployeeInitialState } from "@/services/store/employee/employee.slice";
import { getListEmployee } from "@/services/store/employee/employee.thunk";
import { EPermissions } from "@/shared/enums/permissions";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { unwrapResult } from "@reduxjs/toolkit";
import { formatTreeSelect } from "@/shared/enums/formatTreeSelect";
import Loading from "@/pages/Loading/Loading";

interface TreeNode {
  title: string;
  value: string;
  key: string;
  children?: TreeNode[];
}
const Tasks = () => {
  const { state, dispatch } = useArchive<ITaskInitialState>("task");
  const { state: stateEmployee, dispatch: dispatchEmployee } = useArchive<IEmployeeInitialState>("employee");
  const { dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      permission: EPermissions.DETAIL_TASK,
    },
    {
      type: EButtonTypes.UPDATE,
      permission: EPermissions.UPDATE_TASK,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteTask(record?.key));
      },
      permission: EPermissions.DESTROY_TASK,
    },
  ];
  const optionEmployees: IOption[] =
    (stateEmployee?.getListEmployee.length &&
      stateEmployee?.getListEmployee.map((item) => ({
        value: item.id,
        label: item.name,
      }))) ||
    [];

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "name",
      title: "Tên công việc",
    },
    {
      dataIndex: "code",
      title: "Mã công việc",
    },
    {
      dataIndex: "project",
      title: "Dự án thực hiện",
      render: (_, record) => <>{record.project.name}</>,
    },
    {
      dataIndex: "employees",
      title: "Nhân viên",
      render: (_, record) => {
        return (
          <>
            {record.employees?.length > 0 ? (
              record.employees.map((item: any) => <div key={item.id}>{item?.name}</div>)
            ) : (
              <div>Không có nhân viên</div>
            )}
          </>
        );
      },
    },
    {
      dataIndex: "level_task",
      title: "Mức độ",
    },
  ];
  const optionLevel: IOption[] = levelTaskEnumArray.map((e) => ({
    label: mappingLevelTask[e],
    value: e,
  }));
  const search: ISearchTypeTable[] = [
    {
      id: "code",
      placeholder: "Nhập mã ...",
      label: "Mã công việc",
      type: "text",
    },
    {
      id: "name",
      placeholder: "Nhập tên ...",
      label: "Tên công việc",
      type: "text",
    },
    {
      id: "project",
      placeholder: "Chọn dự án ...",
      label: "Tên dự án",
      isMultiple: true,
      type: "treeSelect",
      treeData: treeData,
    },
    {
      id: "employee_id",
      placeholder: "Chọn nhân viên ...",
      label: "Nhân viên",
      type: "select",
      options: optionEmployees,
    },
    {
      id: "difficulty_level",
      placeholder: "Chọn mức độ ...",
      label: "Mức độ",
      type: "select",
      options: optionLevel,
    },
  ];

  const data: ITableData[] = useMemo(
    () =>
      state.tasks && state.tasks.length > 0
        ? state.tasks.map(({ id, name, description, code, difficulty_level, employees, level_task, project_id, project }, index) => ({
            index: index + 1,
            key: id,
            id: id,
            name,
            description,
            employees,
            code,
            level_task: !!difficulty_level && mappingLevelTask[difficulty_level],
            difficulty_level,
            project_id,
            project,
          }))
        : [],
    [JSON.stringify(state.tasks)],
  );
  useFetchStatus({
    module: "task",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });
  useEffect(() => {
    // Tránh fetch dư thừa bằng cách chỉ fetch khi thực sự cần
    if (state.status === EFetchStatus.FULFILLED || state.filter) {
      dispatch(getAllTasks({ query: state.filter }));
    }
  }, [state.status, state.filter]);

  useEffect(() => {
    dispatchEmployee(getListEmployee());
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const result = await dispatchProject(getListProject()).then(unwrapResult);
      const formattedData = formatTreeSelect(result.data);
      setTreeData(formattedData);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }, [dispatchProject]);

  useEffect(() => {
    fetchProjects();
  }, []);
  if (!data.length) {
    return <Loading />;
  }
  return (
    <>
      <Heading
        title="Công việc"
        hasBreadcrumb
        ModalContent={(props) => <TaskForm {...(props as any)} treeData={treeData} />}
        buttons={[
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_TASK,
            text: "Thêm mới",
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
          total: state.totalRecords!,
        }}
        setFilter={setFilter}
        filter={state.filter}
        ModalContent={(props) => <TaskForm {...(props as any)} treeData={treeData} />}
      />
    </>
  );
};

export default Tasks;
