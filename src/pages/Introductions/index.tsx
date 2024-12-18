import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus, setFilter } from "@/services/store/introduction/introduction.slice";
import { IIntroductionInitialState } from "@/services/store/introduction/introduction.slice";
import { changeStatusIntroduction, deleteIntroduction, getAllIntroductions } from "@/services/store/introduction/introduction.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPermissions } from "@/shared/enums/permissions";
import { mappingStatus, statusEnumArray } from "@/shared/enums/statusActive";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import IntroductionForm from "./ActionMoudle";

const Introductions = () => {
  const { state, dispatch } = useArchive<IIntroductionInitialState>("introduction");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      permission: EPermissions.DETAIL_INTRODUCTION,
    },
    {
      type: EButtonTypes.UPDATE,
      permission: EPermissions.UPDATE_INTRODUCTION,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteIntroduction(record?.key));
      },
      permission: EPermissions.DESTROY_INTRODUCTION,
    },
  ];

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-[80px]",
    },
    {
      dataIndex: "introduction",
      title: "Giới thiệu",
      className: "w-[250px]",

      render(_, record) {
        return <div className="text-compact-3" dangerouslySetInnerHTML={{ __html: record?.introduction || "" }}></div>;
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
      dispatch(changeStatusIntroduction(String(confirmItem.key)));
    }
  };
  const statusOptions: IOption[] = statusEnumArray.map((e) => ({
    value: e,
    label: mappingStatus[e],
  }));
  const search: ISearchTypeTable[] = [
    {
      id: "introduction",
      placeholder: "Nhập bài giới thiệu...",
      label: "Bài giới thiệu",
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

  const data: ITableData[] = useMemo(
    () =>
      state.introductions && state.introductions.length > 0
        ? state.introductions.map(({ id, introduction, is_use }, index) => ({
          index: index + 1,
          key: id,
          introduction,
          is_use,
        }))
        : [],
    [JSON.stringify(state.introductions)],
  );

  useEffect(() => {
    dispatch(getAllIntroductions({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllIntroductions({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "introduction",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  return (
    <>
      <Heading
        title="Giới thiệu"
        hasBreadcrumb
        ModalContent={(props) => <IntroductionForm {...(props as any)} />}
        buttons={[
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_INTRODUCTION,
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
        }}
        setFilter={setFilter}
        filter={state.filter}
        ModalContent={(props) => <IntroductionForm {...(props as any)} />}
      />
    </>
  );
};

export default Introductions;
