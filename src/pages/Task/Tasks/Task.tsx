import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { GoDownload } from "react-icons/go";
import TaskForm from "../TaskForm";
import { ITaskInitialState, resetStatus, setFilter } from "@/services/store/task/task.slice";
import { deleteTask, getAllTasks } from "@/services/store/task/task.thunk";
import { levelTaskEnumArray, mappingLevelTask } from "@/shared/enums/level";
import { IEmployeeInitialState } from "@/services/store/employee/employee.slice";
import { getListEmployee } from "@/services/store/employee/employee.thunk";

const Tasks = () => {
  const { state, dispatch } = useArchive<ITaskInitialState>("task");
  const { state: stateEmployee, dispatch: dispatchEmployee } = useArchive<IEmployeeInitialState>("employee");

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      // permission: EPermissions.DETAIL_TASK,
    },
    {
      type: EButtonTypes.UPDATE,
      // permission: EPermissions.UPDATE_TASK,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteTask(record?.key));
      },
      // permission: EPermissions.DESTROY_TASK,
    },
  ];
  const employeeIds = (value: number[]) => {
    if (stateEmployee?.getListEmployee!.length > 0 && value.length) {
      return stateEmployee.getListEmployee!.filter((item) => value.includes(+item.id)).map((item) => item.name);
    }
  };
  const optionEmployees: IOption[] =
    (stateEmployee?.getListEmployee.length &&
      stateEmployee?.getListEmployee.map((item) => ({
        value: item.id,
        label: item.name,
      }))) ||
    [];

  const columns: ColumnsType<ITableData> = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "name",
      title: "Tên công việc",
      className: "w-[200px]",
    },
    {
      dataIndex: "code",
      title: "Mã công việc",
    },
    {
      dataIndex: "employees",
      title: "Nhân viên",
      render(_, record) {
        return (
          <div className="flex flex-col">
            {(record?.employees as any[])?.map((item: string, index: number) => <div key={index}>{item ? item : ""}</div>)}
          </div>
        );
      },
    },
    {
      dataIndex: "difficulty_level",
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
        ? state.tasks.map(({ id, name, document, code, difficulty_level, employees }, index) => ({
            index: index + 1,
            key: id,
            id: id,
            name,
            document,
            employees: (employees?.map((item) => item.id).length && employeeIds(employees?.map((item) => +item.id))) || [],
            code,
            difficulty_level: !!difficulty_level && mappingLevelTask[difficulty_level],
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
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllTasks({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useEffect(() => {
    dispatch(getAllTasks({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);
  useEffect(() => {
    dispatchEmployee(getListEmployee());
  }, [dispatchEmployee]);
  return (
    <>
      <Heading
        title="Công việc"
        hasBreadcrumb
        ModalContent={(props) => <TaskForm {...(props as any)} />}
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
          },
          {
            icon: <FaPlus className="text-[18px]" />,
            // permission: EPermissions.CREATE_TASK,
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
        ModalContent={(props) => <TaskForm {...(props as any)} />}
      />
    </>
  );
};

export default Tasks;
