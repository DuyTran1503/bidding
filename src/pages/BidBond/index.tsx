import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus, setFilter } from "@/services/store/account/account.slice";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";
import { changeStatusBidBond, deleteBidBond, getAllBidBonds } from "@/services/store/bid_bond/bidBond.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GoDownload } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const BidBonds = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IBidBondInitialState>("bidbond");
  const [isModal, setIsModal] = useState(false);
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  //   const [modalContent, setModalContent] = useState<ReactNode>(null);

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/bidbonds/detail/${record?.key}`);
      },
      permission: EPermissions.DETAIL_BIDBOND,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/bidbonds/update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_BIDBOND,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteBidBond(record?.key));
      },
      permission: EPermissions.DESTROY_BIDBOND,
    },
  ];

  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusBidBond(String(confirmItem.key)));
    }
  };
  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "name",
      title: "Tên nguồn tài trợ",
      className: "w-[250px]",
    },
    {
      dataIndex: "type",
      title: "Loại nguồn tài trợ",
    },
    {
      dataIndex: "bond_amount",
      title: "Mã",
    },
    {
      dataIndex: "desciption",
      title: "Mô tả",
      className: " text-compact-3 h-[90px]",
      render(_, record) {
        return <div dangerouslySetInnerHTML={{ __html: record?.description || "" }}></div>;
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

  const data: ITableData[] = useMemo(
    () =>
      state.bidBonds && state.bidBonds.length > 0
        ? state.bidBonds.map(
            (
              { id, project_id, bidder_id, bond_amount, bond_type, bond_number, issuer, issue_date, expiry_date, scan_document, notes, status },
              index,
            ) => ({
              index: index + 1,
              key: id,
              project_id,
              bidder_id,
              bond_amount,
              bond_type,
              bond_number,
              issuer,
              issue_date,
              expiry_date,
              scan_document,
              notes,
              status,
            }),
          )
        : [],
    [JSON.stringify(state.bidBonds)],
  );

  useEffect(() => {
    dispatch(getAllBidBonds({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllBidBonds({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "bidbond",
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

  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên bão lãnh dự thầu...",
      label: "Tên bão lãnh dự thầu",
      type: "text",
    },
  ];

  return (
    <>
      <Heading
        title="Bão lãnh dự thầu"
        hasBreadcrumb
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
          },
          {
            text: "Thêm mới",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              navigate("create");
            },
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
      />
    </>
  );
};

export default BidBonds;
