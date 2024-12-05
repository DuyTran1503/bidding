import Heading from "@/components/layout/Heading";

import { FaPlus } from "react-icons/fa6";
import ManagementGrid from "@/components/grid/ManagementGrid";
import { ColumnsType } from "antd/es/table";
import { ITableData } from "@/components/table/PrimaryTable";
import { useNavigate } from "react-router-dom";
import { useArchive } from "@/hooks/useArchive";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { EButtonTypes } from "@/shared/enums/button";
import { useEffect, useMemo } from "react";
import useFetchStatus from "@/hooks/useFetchStatus";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IBidDocumentInitialState, resetStatus, setFilter } from "@/services/store/bid_document/bid_document.slice";
import { deleteBidDocument, getAllBidDocument } from "@/services/store/bid_document/bid_document.thunk";
import { EPermissions } from "@/shared/enums/permissions";
import { convertMoney } from "@/shared/utils/common/convertMoney";

const BidDocument = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IBidDocumentInitialState>("bid_document");
  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "max-w-[80px] w-[80px]",
    },
    {
      dataIndex: "project_id",
      title: "Dự án",
      className: "w-[250px]",
      render(_, record) {
        return <div>{record?.project?.name}</div>;
      },
    },
    {
      dataIndex: "enterprise_id",
      title: "Doanh nghiệp",
      className: "w-[250px]",
      render(_, record) {
        return <div>{record?.enterprise?.name}</div>;
      },
    },
    {
      dataIndex: "submission_date",
      title: "Ngày nộp hồ sơ",
      className: "w-[250px]",
    },
    {
      dataIndex: "bid_price",
      title: "Giá gói thầu",
      className: "w-[250px]",
      render(_, record) {
        return convertMoney(record?.bid_price);
      },
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   align: "center",
    //   className: "w-[200px]",
    //   render(_, record) {
    //     return (
    //       <CommonSwitch
    //         onChange={() => handleChangeStatus(record as ITableData)}
    //         checked={!!record.is_active}
    //         title={`Bạn có chắc chắn muốn ${record.is_active ? "bỏ cấm" : "cấm"} tài khoản này?`}
    //       />
    //     );
    //   },
    // },
  ];
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/bid-document/detail/${record?.id}`);
      },
      permission: EPermissions.CREATE_BUSINESS_ACTIVITY_TYPE,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/bid-document/update/${record?.id}`);
      },
      permission: EPermissions.UPDATE_BUSINESS_ACTIVITY_TYPE,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteBidDocument(record?.id));
      },
      permission: EPermissions.DESTROY_BUSINESS_ACTIVITY_TYPE,
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
    if (state.bidDocuments && state.bidDocuments.length > 0) {
      return state.bidDocuments
        .map(
          (
            {
              id,
              project_id,
              enterprise_id,
              bid_bond_id,
              submission_date,
              bid_price,
              implementation_time,
              validity_period,
              status,
              note,
              enterprise,
              project,
            },
            index,
          ) => ({
            id,
            index: index + 1,
            key: project_id !== undefined ? project_id : 0, // Provide a default value
            project_id,
            enterprise_id,
            bid_bond_id,
            submission_date,
            bid_price,
            implementation_time,
            validity_period,
            status,
            note,
            enterprise,
            project,
          }),
        )
        .filter((item) => item.key !== undefined); // Optionally filter out items with undefined keys
    }
    return [];
  }, [JSON.stringify(state.bidDocuments)]);
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
            text: "Thêm mới",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              navigate("/bid-document/create");
            },
          },
        ]}
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
        // scroll={{ x: 1400 }}
      />
    </>
  );
};

export default BidDocument;
