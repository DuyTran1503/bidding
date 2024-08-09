import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import FormModal from "@/components/form/FormModal";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IBiddingFieldInitialState, resetStatus, setFilter } from "@/services/store/biddingField/biddingField.slice";
import { changeStatusBiddingField, deleteBiddingField, getAllBiddingFields } from "@/services/store/biddingField/biddingField.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState, ReactNode } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import BiddingFieldDetail from "../DetailBiddingField/DetailBiddingField";

const BiddingFields = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IBiddingFieldInitialState>("bidding_field");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/bidding-fields/detail/${record?.key}`);
      },
      permission: EPermissions.DETAIL_BIDDING_FIELD,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/bidding-fields/update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_BIDDING_FIELD,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteBiddingField(record?.key));
      },
      permission: EPermissions.DESTROY_BIDDING_FIELD,
    },
  ];

  const columns: ColumnsType<ITableData> = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "name",
      title: "Tên lĩnh vực đấu thầu",
    },
    {
      dataIndex: "parent_name",
      title: "Lĩnh vực cha",
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render(_, record) {
        return (
          <CommonSwitch
            onChange={() => handleChangeStatus(record)}
            checked={!!record.is_active}
            title={`Bạn có chắc chắn muốn ${record.is_active ? "bỏ cấm" : "cấm"} lĩnh vực này?`}
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
      dispatch(changeStatusBiddingField(String(confirmItem.key)));
    }
  };

  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên lĩnh vực...",
      label: "Tên lĩnh vực",
      type: "text",
    },
  ];
  const data: ITableData[] = useMemo(() => {
    return state.biddingFields && state.biddingFields.length > 0
      ? state.biddingFields.map(({ id, name, is_active, parent }, index) => ({
          index: index + 1,
          key: id,
          name,
          is_active,
          parent_name: parent?.name,
        }))
      : [];
  }, [JSON.stringify(state.biddingFields)]);
  useFetchStatus({
    module: "bidding_field",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllBiddingFields({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);
  useEffect(() => {
    dispatch(getAllBiddingFields({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  return (
    <>
      <Heading
        title="Lĩnh vực đấu thầu"
        hasBreadcrumb
        buttons={[
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_BIDDING_FIELD,
            text: "Tạo mới",
            onClick: () => navigate("/bidding-fields/create"),
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
      />
    </>
  );
};

export default BiddingFields;
