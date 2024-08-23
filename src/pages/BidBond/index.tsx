import ConfirmModal from '@/components/common/CommonModal';
import CommonSwitch from '@/components/common/CommonSwitch';
import FormModal from '@/components/form/FormModal';
import ManagementGrid from '@/components/grid/ManagementGrid';
import Heading from '@/components/layout/Heading';
import { ITableData } from '@/components/table/PrimaryTable';
import { useArchive } from '@/hooks/useArchive';
import { setFilter } from '@/services/store/account/account.slice';
import { IBidBondInitialState } from '@/services/store/bidbond/bidBond.slice';
import { changeStatusBidBond, deleteBidBond } from '@/services/store/bidbond/bidBond.thunk';
import { EButtonTypes } from '@/shared/enums/button';
import { EPermissions } from '@/shared/enums/permissions';
import { IGridButton } from '@/shared/utils/shared-interfaces';
import { ColumnsType } from 'antd/es/table';
import React, { ReactNode, useMemo, useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import { GoDownload } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

const BidBonds = () => {
    const navigate = useNavigate();
  const { state, dispatch } = useArchive<IBidBondInitialState>("bidbond");
  const [isModal, setIsModal ] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/bidbonds/detail/${record?.key}`);
      },
      permission: EPermissions.DETAIL_BIDBOND
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
      className: "w-[250px]"
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
      render(_,record) {
        return (
          <CommonSwitch
            onChange={() => handleChangeStatus(record)}
            checked={!!record.is_active}
            title={`Bạn có chắc chắn muốn thay đổi trạng thái không?`}
          />
        )
      }
    },
  ];


  const handleChangeStatus = (item : ITableData) =>{
    setIsModal(true);
    setConfirmItem(item)
  };

  const data: ITableData[] = useMemo(
    () =>
      state.bidBonds && state.bidBonds.length > 0
        ? state.bidBonds.map(({ id, bidding_submissionId, bond_amount, type, issuer,issue_date,expiry_date, is_active }, index) => ({
            index: index + 1,
            key: id,
            bidding_submissionId,
            bond_amount,
            type,
            issuer,
            issue_date,
            expiry_date,
            is_active,
          }))
        : [],
    [JSON.stringify(state.fundingSources)],
  );




  return (
    <>
    <Heading
      title="Nguồn Tài Trợ"
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
    <FormModal open={isModalOpen} onCancel={handleCancel}>
      {modalContent}
    </FormModal>
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
  )
}

export default BidBonds