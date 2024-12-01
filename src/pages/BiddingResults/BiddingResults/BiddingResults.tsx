import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IBiddingResultInitialState, resetStatus, setFilter } from "@/services/store/biddingResult/biddingResult.slice";
import { getAllBiddingResults } from "@/services/store/biddingResult/biddingResult.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
// import { EPermissions } from "@/shared/enums/permissions";
import { EPermissions } from "@/shared/enums/permissions";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ActionModuleBiddingResult from "../ActionModuleBiddingResult/ActionModuleBiddingResult";

const BiddingResults = () => {
  const { state, dispatch } = useArchive<IBiddingResultInitialState>("bidding_result");
  const navigate = useNavigate();
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      permission: EPermissions.DETAIL_BIDDING_RESULT,
      onClick(record) {
        navigate(`detail/${record?.key}`);
      },
    },

    {
      type: EButtonTypes.UPDATE,
      permission: EPermissions.UPDATE_BIDDING_RESULT,
    },
  ];

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "project",
      title: "Tên dự án",
      render: (_, record) => {
        return <span>{record.project?.name || "Không có tên dự án"}</span>;
      },
    },
    {
      dataIndex: "total_amount",
      title: "Tổng chi phí",
      render: (_, record) => {
        return <span>{convertMoney(record.project?.total_amount)}</span>;
      },
    },
    {
      dataIndex: "enterprise",
      title: "Doanh nghiệp trúng thầu",
      render: (_, record) => {
        return <span>{record.enterprise?.user?.name}</span>;
      },
    },
    {
      dataIndex: "decision_number",
      title: "Số quyết đinh",
    },
    {
      dataIndex: "decision_date",
      title: "Thời gian kết thúc",
    },
  ];

  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên lĩnh vực...",
      label: "Tên lĩnh vực",
      type: "text",
    },
  ];

  const data: ITableData[] = useMemo(
    () =>
      state.biddingResults && state.biddingResults.length > 0
        ? state.biddingResults.map(({ id, project, enterprise, bid_document, win_amount, decision_number, decision_date, is_active }, index) => ({
            index: index + 1,
            key: id,
            project,
            enterprise,
            bid_document,
            win_amount,
            decision_number,
            decision_date,
            is_active,
          }))
        : [],
    [JSON.stringify(state.biddingResults)],
  );

  useFetchStatus({
    module: "bidding_result",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllBiddingResults({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useEffect(() => {
    dispatch(getAllBiddingResults({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  return (
    <>
      <Heading
        title="Kết quả đấu thầu"
        hasBreadcrumb
        ModalContent={(props) => <ActionModuleBiddingResult {...(props as any)} />}
        buttons={[
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_BIDDING_RESULT,
            text: "Thêm mới",
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
          total: state.totalRecords!,
        }}
        setFilter={setFilter}
        filter={state.filter}
        ModalContent={(props) => <ActionModuleBiddingResult {...(props as any)} />}
      />
    </>
  );
};

export default BiddingResults;
