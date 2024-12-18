import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus, setFilter } from "@/services/store/instruct/instruct.slice";
import { IInstructInitialState } from "@/services/store/instruct/instruct.slice";
import { changeStatusInstruct, deleteInstruct, getAllInstructs } from "@/services/store/instruct/instruct.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPermissions } from "@/shared/enums/permissions";
import { mappingStatus, statusEnumArray } from "@/shared/enums/statusActive";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import InstructForm from "./ActionModule";

const Instructs = () => {
  const { state, dispatch } = useArchive<IInstructInitialState>("instruct");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      permission: EPermissions.DETAIL_INSTRUCT,
    },
    {
      type: EButtonTypes.UPDATE,
      permission: EPermissions.UPDATE_INSTRUCT,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteInstruct(record?.key));
      },
      permission: EPermissions.DESTROY_INSTRUCT,
    },
  ];

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-[50px]",
    },
    {
      dataIndex: "instruct",
      title: "Hướng dẫn",
      className: "w-[400px]",
      render(_, record) {
        return <div className="text-compact-3" dangerouslySetInnerHTML={{ __html: record?.instruct || "" }}></div>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "is_use",
      className: "w-[50px]",

      render(_, record) {
        return (
          <CommonSwitch
            onChange={() => handleChangeStatus(record as ITableData)}
            checked={!!record.is_use}
            title={`Bạn có chắc chắn muốn thay đổi trạng thái không?`}
          />
        );
      },
    },
  ];

  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };

  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusInstruct(String(confirmItem.key)));
    }
  };

  const statusOptions: IOption[] = statusEnumArray.map((e) => ({
    value: e,
    label: mappingStatus[e],
  }));
  const search: ISearchTypeTable[] = [
    {
      id: "instruct",
      placeholder: "Nhập bài hướng dẫn",
      label: "Hướng dẫn",
      type: "text",
    },
    {
      id: "is_use",
      placeholder: "Chọn trạng thái ...",
      label: "Trạng thái",
      type: "select",

      options: statusOptions as { value: string; label: string }[],
    },
  ];

  const data: any[] = useMemo(
    () =>
      state.instructs && state.instructs.length > 0
        ? state.instructs.map(({ id, instruct, is_use }, index) => ({
          index: index + 1,
          key: id,
          instruct,
          is_use,
        }))
        : [],
    [JSON.stringify(state.instructs)],
  );

  useEffect(() => {
    dispatch(getAllInstructs({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllInstructs({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "instruct",
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

  return (
    <>
      <Heading
        title="Hướng dẫn"
        hasBreadcrumb
        ModalContent={(props) => <InstructForm {...(props as any)} />}
        buttons={[
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_INSTRUCT,
            text: "Thêm mới",
          },
        ]}
      />
      <ConfirmModal
        title={"Xác nhận"}
        content={"Bạn chắc chắn muốn thay đổi trạng thái không"}
        visible={isModal}
        setVisible={setIsModal}
        onConfirm={onConfirmStatus}
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
          number_of_elements: state.number_of_elements && state.number_of_elements,
          // showSideChanger: true,
        }}
        setFilter={setFilter}
        filter={state.filter}
        ModalContent={(props) => <InstructForm {...(props as any)} />}
        scroll={{ x: 1200 }}
      />
    </>
  );
};

export default Instructs;
