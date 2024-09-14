import Heading from "@/components/layout/Heading";
import { GoDownload } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import ManagementGrid from "@/components/grid/ManagementGrid";
import { ColumnsType } from "antd/es/table";
import { ITableData } from "@/components/table/PrimaryTable";
import { useNavigate } from "react-router-dom";
import { useArchive } from "@/hooks/useArchive";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { EButtonTypes } from "@/shared/enums/button";
import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "@/components/common/CommonModal";
import useFetchStatus from "@/hooks/useFetchStatus";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IBidDocumentInitialState, resetStatus, setFilter } from "@/services/store/bid_document/bid_document.slice";
import { changeStatusBidDocument, deleteBidDocument, getAllBidDocument } from "@/services/store/bid_document/bid_document.thunk";
import CommonSwitch from "@/components/common/CommonSwitch";

const BidDocument = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IBidDocumentInitialState>("bid_document");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "max-w-[80px]",
    },
    {
      dataIndex: "id_project",
      title: "Dự án",
      className: "max-w-[250px]",
    },
    {
      dataIndex: "id_enterprise",
      title: "Doanh nghiệp",
      className: "max-w-[250px]",
    },
    {
      dataIndex: "id_bid_bond",
      title: "Bảo lãnh dự thầu",
      className: "max-w-[250px]",
    },
    {
      dataIndex: "submission_date",
      title: "Ngày nộp hồ sơ",
      className: "max-w-[250px]",
    },
    {
      dataIndex: "bid_price",
      title: "Giá thầu",
      className: "max-w-[250px]",
    },
    {
      dataIndex: "implementation_time",
      title: "Thời gian thực hiện",
      className: "max-w-[250px]",
    },
    {
      dataIndex: "technical_score",
      title: "Điểm kỹ thuật",
      className: "max-w-[250px]",
    },
    {
      dataIndex: "financial_score",
      title: "Điểm tài chính",
      className: "max-w-[250px]",
    },
    {
      dataIndex: "totalScore",
      title: "Tổng điểm",
      className: "max-w-[250px]",
    },
    {
      dataIndex: "ranking",
      title: "Thứ hạng",
      className: "max-w-[250px]",
    },
    // {
    //   dataIndex: "status",
    //   title: "Trạng thái",
    //   className: "w-[250px]",
    // },

    {
      title: "Trạng thái",
      dataIndex: "status",
      render(_, record) {
        return (
          <CommonSwitch
            onChange={() => handleChangeStatus(record)}
            checked={!!record.is_active}
            title={`Bạn có chắc chắn muốn ${record.is_active ? "bỏ cấm" : "cấm"} tài khoản này?`}
          />
        );
      },
    },
  ];
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/bid-document/detail/${record?.key}`);
      },
      // permission: EPermissions.CREATE_BUSINESS_ACTIVITY_TYPE,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/bid-document/update/${record?.key}`);
      },
      // permission: EPermissions.UPDATE_BUSINESS_ACTIVITY_TYPE,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteBidDocument(record?.key));
      },
      // permission: EPermissions.DESTROY_BUSINESS_ACTIVITY_TYPE,
    },
  ];
  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập ...",
      label: "Loại hình doanh nghiệp",
      type: "text",
    },
  ];
  const data: ITableData[] = useMemo(() => {
    return Array.isArray(state.bidDocuments)
      ? state.bidDocuments.map(
          (
            {
              id_project,
              id_enterprise,
              id_bid_bond,
              submission_date,
              bid_price,
              implementation_time,
              validity_period,
              technical_score,
              financial_score,
              totalScore,
              ranking,
              status,
              notes,
            },
            index,
          ) => ({
            index: index + 1,
            key: id_project,
            id_project,
            id_enterprise,
            id_bid_bond,
            submission_date,
            bid_price,
            implementation_time,
            validity_period,
            technical_score,
            financial_score,
            totalScore,
            ranking,
            status,
            notes,
          }),
        )
      : [];
  }, [JSON.stringify(state.bidDocuments)]);
  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };
  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusBidDocument(String(confirmItem.key)));
    }
  };
  useEffect(() => {
    dispatch(getAllBidDocument({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllBidDocument({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "bid_document",
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
        title="Hồ sơ dự thầu"
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
              navigate("/bid-document/create");
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
          // showSideChanger:true
        }}
        setFilter={setFilter}
        filter={state.filter}
        scroll={{ x: 1600 }}
      />
    </>
  );
};

export default BidDocument;
