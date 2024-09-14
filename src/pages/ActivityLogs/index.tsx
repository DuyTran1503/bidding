import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus, setFilter } from "@/services/store/account/account.slice";
import { IActivityLogInitialState } from "@/services/store/activityLogs/activityLog.slice";
import { getAllActivityLogs } from "@/services/store/activityLogs/activityLog.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPermissions } from "@/shared/enums/permissions";
import { activityLogOptions } from "@/shared/enums/typeActivityLog";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DetailActivityLogProps from "./Detail";
import FormModal from "@/components/form/FormModal";

const ActivityLogs = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IActivityLogInitialState>("activity_log");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "log_name",
      title: "Tên nhật ký",
    },
    {
      dataIndex: "event",
      title: "Sự kiện",
    },
    {
      dataIndex: "action_performer",
      title: "Người thực hiện",
    },
    {
      dataIndex: "description",
      title: "Mô tả",
      render(_, record: any) {
        return <div dangerouslySetInnerHTML={{ __html: record?.description || "" }} className="text-compact-3"></div>;
      },
    },
  ];

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        setModalContent(<DetailActivityLogProps record={record} />);
        setIsModalOpen(true);
      },
      // permission: EPermissions.CREATE_ACTIVITYLOG,
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập ...",
      label: "Nhật ký hoạt động",
      type: "text",
    },
    {
      id: "event",
      placeholder: "--",
      label: "Sự kiện",
      type: "select",
      options: activityLogOptions
    }
  ];

  const data: ITableData[] = useMemo(() => {
    return Array.isArray(state.activityLogs)
      ? state.activityLogs.map(({ id, log_name, event, action_performer, description }, index) => ({
          index: index + 1,
          key: id,
          log_name,
          description,
          event,
          action_performer,
        }))
      : [];
  }, [JSON.stringify(state.activityLogs)]);

  useEffect(() => {
    dispatch(getAllActivityLogs({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);
    
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllActivityLogs({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "activity_log",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });
  useEffect(() => {
    return () => {
      setFilter({ page: 1, size: 10 });
    };
  }, []);

  // console.log(state);
  return (
    <>
      <Heading title="Nhật ký hoạt động" hasBreadcrumb />
      <FormModal open={isModalOpen} onCancel={handleCancel}>
        {modalContent}
      </FormModal>
      <ManagementGrid
        columns={columns}
        data={data}
        search={search}
        buttons={buttons}
        pagination={{
          current: state.filter.page ?? 1,
          pageSize: state.filter.size ?? 10,
          total: state.totalRecords,
          number_of_elements: state.number_of_elements && state.number_of_elements,
          // showSideChanger: true,
        }}
        setFilter={setFilter}
        filter={state.filter}
      />
    </>
  );
};

export default ActivityLogs;