import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { ISelectionMethodInitialState, resetStatus, setFilter } from "@/services/store/selectionMethod/selectionMethod.slice";
import { changeStatusSelectionMethod, deleteSelectionMethod, getAllSelectionMethods } from "@/services/store/selectionMethod/selectionMethod.thunk";
import { GoDownload } from "react-icons/go";
import SelectionMethodForm from "../SelectionMethodForm";

const SelectionMethods = () => {
  const { state, dispatch } = useArchive<ISelectionMethodInitialState>("selection_method");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,

      //   permission: EPermissions.DETAIL_SELECTION_METHOD,
    },
    {
      type: EButtonTypes.UPDATE,
      // permission: EPermissions.UPDATE_SELECTION_METHOD,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteSelectionMethod(record?.key));
      },
      // permission: EPermissions.DESTROY_SELECTION_METHOD,
    },
  ];

  const columns: ColumnsType<ITableData> = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "method_name",
      title: "Tên hình thức lựa chọn nhà thầu",
      className: "w-[300px]",
    },
    {
      dataIndex: "description",
      render(_, record) {
        return <div dangerouslySetInnerHTML={{ __html: record?.description || "" }} className="text-compact-3"></div>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render(_, record) {
        return (
          <CommonSwitch
            onChange={() => handleChangeStatus(record)}
            checked={!!record.is_active}
            title={`Bạn có chắc chắn muốn ${record.is_active ? "bỏ hoạt động" : "khóa hoạt động"} ?`}
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
      dispatch(changeStatusSelectionMethod(String(confirmItem.key)));
    }
  };

  const search: ISearchTypeTable[] = [
    {
      id: "method_name",
      placeholder: "Nhập tên hình thức...",
      label: "Tên hình thức",
      type: "text",
    },
  ];

  const data: ITableData[] = useMemo(
    () =>
      state.selectionMethods && state.selectionMethods.length > 0
        ? state.selectionMethods.map(({ id, method_name, description, is_active }, index) => ({
            index: index + 1,
            key: id,
            id: id,
            method_name,
            description,
            is_active,
          }))
        : [],
    [JSON.stringify(state.selectionMethods)],
  );

  useFetchStatus({
    module: "selection_method",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllSelectionMethods({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useEffect(() => {
    dispatch(getAllSelectionMethods({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  return (
    <>
      <Heading
        title="Hình thức lựa chọn Nhà thầu"
        hasBreadcrumb
        ModalContent={(props) => <SelectionMethodForm {...(props as any)} />}
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
          },
          {
            icon: <FaPlus className="text-[18px]" />,
            // permission: EPermissions.CREATE_SELECTION_METHOD,
            text: "Thêm mới",
            // onClick: () => navigate("create"),
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
          total: state.totalRecords!,
        }}
        setFilter={setFilter}
        filter={state.filter}
        ModalContent={(props) => <SelectionMethodForm {...(props as any)} />}
      />
    </>
  );
};

export default SelectionMethods;
