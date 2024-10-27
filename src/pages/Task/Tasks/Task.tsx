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
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { GoDownload } from "react-icons/go";
import { EPermissions } from "@/shared/enums/permissions";
import CustomerAvatar from "@/components/common/CustomerAvatar";
import TaskForm from "../TaskForm";
import { ITaskInitialState, resetStatus, setFilter } from "@/services/store/task/task.slice";
import { deleteTask, getAllTasks } from "@/services/store/task/task.thunk";
import { levelTaskEnumArray, mappingLevelTask } from "@/shared/enums/level";

const Tasks = () => {
  const { state, dispatch } = useArchive<ITaskInitialState>("task");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      permission: EPermissions.DETAIL_BANNER,
    },
    {
      type: EButtonTypes.UPDATE,
      permission: EPermissions.UPDATE_BANNER,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteTask(record?.key));
      },
      permission: EPermissions.DESTROY_BANNER,
    },
  ];

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
      id: "name",
      placeholder: "Nhập tên ...",
      label: "Tên công việc",
      type: "text",
    },
    {
      id: "code",
      placeholder: "Nhập tên ...",
      label: "Tên công việc",
      type: "text",
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
        ? state.tasks.map(({ id, name, document, code, difficulty_level }, index) => ({
            index: index + 1,
            key: id,
            id: id,
            name,
            document,
            code,
            difficulty_level,
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
