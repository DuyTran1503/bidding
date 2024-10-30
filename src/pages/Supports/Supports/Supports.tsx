import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { ISupportInitialState, resetStatus, setFilter } from "@/services/store/support/support.slice";
import { changeStatusSupport, deleteSupport, getAllSupports } from "@/services/store/support/support.thunk";
import { GoDownload } from "react-icons/go";
import { EButtonTypes } from "@/shared/enums/button";
import FormRadio from "@/components/form/FormRadio";
import FormModal from "@/components/form/FormModal";
import { mappingSupport, statusEnumArray } from "@/shared/enums/support";
import { RadioChangeEvent } from "antd";

const Supports = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<ISupportInitialState>("support");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);

  const statusOptions: IOption[] = statusEnumArray.map((key) => ({
    value: key,
    label: mappingSupport[key],
  }));

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/supports/detail/${record?.key}`);
      },
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteSupport(record?.key));
      },
    },
  ];

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "sender",
      title: "Người gửi",
      render: (_, record) => {
        return <div>{record.sender?.name || "Không xác định"}</div>;
      },
    },
    {
      dataIndex: "email",
      title: "Email",
    },
    {
      title: "Hỗ trợ",
      dataIndex: "title",
    },
    {
      title: "Yêu cầu",
      dataIndex: "type",
      render: (_, record) => {
        const statusMap: { [key: string]: string } = {
          1: "Khác",
          2: "Kỹ thuật",
          3: "Tự vấn đấu thầu",
          4: "Hỗ trợ tài khoản",
          5: "Báo lỗi",
        };
        return (
          <div className="flex items-center space-x-2">
            {statusMap[record.type as number] || "Không xác định"}
          </div>
        );
      },
    },
    {
      title: "Nội dung hỗ trợ",
      dataIndex: "content",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => {
        const statusMap: { [key: string]: string } = {
          "sent": "Đã gửi",
          "processing": "Đang xử lý",
          "responded": "Đã xử lý",
        };
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenModal(record)}
            >
              {statusMap[record.status as string] || "Không xác định"}
            </button>
          </div>
        );
      },
    },
  ];

  const search: ISearchTypeTable[] = [
    {
      id: "title",
      placeholder: "Nhập tiêu đề thư hỗ trợ...",
      label: "Tiêu đề thư hỗ trợ",
      type: "text",
    },
  ];

  const data: ITableData[] = useMemo(
    () =>
      state.supports && state.supports.length > 0
        ? state.supports.map(({ id, title, email, phone, sender, content, document, type, status }, index) => ({
          index: index + 1,
          key: id,
          id: id,
          title: title,
          email,
          phone,
          sender,
          content,
          document,
          type,
          status,
        }))
        : [],
    [state.supports],
  );

  useFetchStatus({
    module: "support",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  const handleOpenModal = (item: ITableData) => {
    setConfirmItem(item);
    setSelectedStatus(item.status as string); // Lưu trạng thái hiện tại
    setIsModalVisible(true);
  };

  const handleConfirmStatus = () => {
    if (confirmItem && selectedStatus) {
      // Gửi request với id và status
      dispatch(changeStatusSupport({ id: String(confirmItem.key), status: selectedStatus }));
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllSupports({ query: state.filter }));
    }
  }, [state.status]);

  useEffect(() => {
    dispatch(getAllSupports({ query: state.filter }));
  }, [state.filter]);

  return (
    <>
      <Heading
        title="Thư hỗ trợ"
        hasBreadcrumb
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
          },
          {
            icon: <FaPlus className="text-[18px]" />,
            text: "Thêm mới",
            onClick: () => navigate("create"),
          },
        ]}
      />
      <FormModal
        title="Cập nhật trạng thái"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleConfirmStatus}
      >
        <FormRadio
          value={selectedStatus}
          options={statusOptions}
          onChange={(e: RadioChangeEvent) => {
            // console.log("Selected status:", e.target.value);
            setSelectedStatus(e.target.value)
          }}
        />
      </FormModal>
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

export default Supports;
