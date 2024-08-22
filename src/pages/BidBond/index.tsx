import CommonSwitch from '@/components/common/CommonSwitch';
import { ITableData } from '@/components/table/PrimaryTable';
import { useArchive } from '@/hooks/useArchive';
import { IBidBondInitialState } from '@/services/store/bidbond/bidBond.slice';
import { ColumnsType } from 'antd/es/table';
import React, { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const BidBonds = () => {
    const navigate = useNavigate();
  const { state, dispatch } = useArchive<IBidBondInitialState>("bidbond");
  const [isModal, setIsModal ] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  const [modalContent, setModalContent] = useState<ReactNode>(null);

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
      dataIndex: "code",
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