import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IBiddingFieldInitialState, resetStatus, setFilter } from "@/services/store/biddingField/biddingField.slice";
import {
  changeStatusBiddingField,
  deleteBiddingField,
  getAllBiddingFields,
  getBiddingFieldAllIds
} from "@/services/store/biddingField/biddingField.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { unwrapResult } from "@reduxjs/toolkit";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { GoDownload } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const formatTreeData = (data: any[]): { title: string; value: string; key: string; children?: any[] }[] => {
  return data.map((item) => ({
    title: item.name,
    value: item.id.toString(),
    key: item.id.toString(),
    children: item.children ? formatTreeData(item.children) : [],
  }));
};
const BiddingFields = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IBiddingFieldInitialState>("bidding_field");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);
  const [parentOptions, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick: (record) => {
        navigate(`detail/${record?.key}`);
      },
      permission: EPermissions.DETAIL_BIDDING_FIELD,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick: (record) => {
        navigate(`update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_BIDDING_FIELD,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick: (record) => {
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
      render: (_, record) => (
        <CommonSwitch
          onChange={() => handleChangeStatus(record)}
          checked={!!record.is_active}
          title={`Bạn có chắc chắn muốn ${record.is_active ? "bỏ cấm" : "cấm"} lĩnh vực này?`}
        />
      ),
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
    {
      id: "code",
      placeholder: "Mã lĩnh vực...",
      label: "Mã lĩnh vực",
      type: "text",
    },
    {
      id: "parent_id",
      placeholder: "Nhập lĩnh vực cha...",
      label: "Lĩnh vực cha",
      type: "treeSelect", // Chuyển đổi thành treeSelect
      treeData: parentOptions, // Sử dụng treeData thay vì options
    },
  ];

  const data: ITableData[] = useMemo(() => {
    return state.biddingFields && state.biddingFields.length > 0
      ? state.biddingFields.map(({ id, name, is_active, code, parent }, index) => ({
          index: index + 1,
          key: id,
          name,
          is_active,
          code,
          parent_name: parent?.name || "",
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
    dispatch(getAllBiddingFields({ query: state.filter }));
    dispatch(getBiddingFieldAllIds())
      .then(unwrapResult)
      .then((result) => {
        const fields = result.data;
        const formattedData = formatTreeData(fields);
        setTreeData(formattedData);
      });
  }, [dispatch, state.filter]);

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllBiddingFields({ query: state.filter }));
      dispatch(getBiddingFieldAllIds())
    }
  }, [JSON.stringify(state.status)]);

  return (
    <>
      <Heading
        title="Lĩnh vực đấu thầu"
        hasBreadcrumb
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
          },
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_BIDDING_FIELD,
            text: "Thêm mới",
            onClick: () => navigate("create"),
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
      />
    </>
  );
};

export default BiddingFields;
