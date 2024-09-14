import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { IBiddingResultInitialState, resetStatus, setFilter } from "@/services/store/biddingResult/biddingResult.slice";
import { changeStatusBiddingResult, deleteBiddingResult, getAllBiddingResults } from "@/services/store/biddingResult/biddingResult.thunk";
import { EPermissions } from "@/shared/enums/permissions";
import { GoDownload } from "react-icons/go";

const BiddingResults = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useArchive<IBiddingResultInitialState>("bidding_result");
    const [isModal, setIsModal] = useState(false);
    const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);

    const buttons: IGridButton[] = [
        {
            type: EButtonTypes.VIEW,
            onClick(record) {
                navigate(`update/${record?.key}`);
            },
            permission: EPermissions.DETAIL_BIDDING_RESULT,
        },
        {
            type: EButtonTypes.UPDATE,
            onClick(record) {
                navigate(`update/${record?.key}`);
            },
            permission: EPermissions.UPDATE_BIDDING_RESULT,
        },
        {
            type: EButtonTypes.DESTROY,
            onClick(record) {
                dispatch(deleteBiddingResult(record?.key));
            },
            permission: EPermissions.DESTROY_BIDDING_RESULT,
        },
    ];

    const columns: ColumnsType<ITableData> = [
        {
            dataIndex: "index",
            title: "STT",
        },
        {
            dataIndex: "amount",
            title: "Amount",
        },
        {
            dataIndex: "project_id",
            title: "Project_id",
        },
        {
            dataIndex: "enterprise_id",
            title: "Enterprise_id",
        },
        {
            dataIndex: "decision_number",
            title: "Decision_number",
        },
        {
            dataIndex: "decision_date",
            title: "Decision_date",
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
            dispatch(changeStatusBiddingResult(String(confirmItem.key)));
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

    const data: ITableData[] = useMemo(
        () =>
            state.biddingResults && state.biddingResults.length > 0
                ? state.biddingResults.map(({ id, project_id, enterprise_id, amount, decision_number, decision_date, is_active }, index) => ({
                    index: index + 1,
                    key: id,
                    project_id,
                    enterprise_id,
                    amount,
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
                buttons={[
                    {
                        text: "Export",
                        type: "ghost",
                        icon: <GoDownload className="text-[18px]" />,
                    },
                    {
                        icon: <FaPlus className="text-[18px]" />,
                        permission: EPermissions.CREATE_BIDDING_RESULT,
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

export default BiddingResults;
