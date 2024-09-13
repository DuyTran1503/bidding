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
import { IBiddingHistoryInitialState, resetStatus, setFilter } from "@/services/store/biddingHistory/biddingHistory.slice";
import { changeStatusBiddingHistory, deleteBiddingHistory, getAllBiddingHistorys } from "@/services/store/biddingHistory/biddingHistory.thunk";
import { EPermissions } from "@/shared/enums/permissions";
import { GoDownload } from "react-icons/go";

const BiddingHistorys = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useArchive<IBiddingHistoryInitialState>("bidding_type");
    const [isModal, setIsModal] = useState(false);
    const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);

    const buttons: IGridButton[] = [
        {
            type: EButtonTypes.VIEW,
            onClick(record) {
                navigate(`update/${record?.key}`);
            },
            permission: EPermissions.DETAIL_BIDDING_TYPE,
        },
        {
            type: EButtonTypes.UPDATE,
            onClick(record) {
                navigate(`update/${record?.key}`);
            },
            permission: EPermissions.UPDATE_BIDDING_TYPE,
        },
        {
            type: EButtonTypes.DESTROY,
            onClick(record) {
                dispatch(deleteBiddingHistory(record?.key));
            },
            permission: EPermissions.DESTROY_BIDDING_TYPE,
        },
    ];

    const columns: ColumnsType<ITableData> = [
        {
            dataIndex: "index",
            title: "STT",
        },
        {
            dataIndex: "event_date",
            title: "Event_date",
        },
        {
            dataIndex: "project_id",
            title: "Project_id",
        },
        {
            dataIndex: "event_type",
            title: "Event_type",
        },
        {
            dataIndex: "event_description",
            title: "Event_description",
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
            dispatch(changeStatusBiddingHistory(String(confirmItem.key)));
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
            state.biddingHistorys && state.biddingHistorys.length > 0
                ? state.biddingHistorys.map(({ id, project_id, event_date, event_description, event_type, is_active }, index) => ({
                    index: index + 1,
                    key: id,
                    project_id,
                    event_type,
                    event_date,
                    event_description,
                    is_active,
                }))
                : [],
        [JSON.stringify(state.biddingHistorys)],
    );

    useFetchStatus({
        module: "bidding_type",
        reset: resetStatus,
        actions: {
            success: { message: state.message },
            error: { message: state.message },
        },
    });

    useEffect(() => {
        if (state.status === EFetchStatus.FULFILLED) {
            dispatch(getAllBiddingHistorys({ query: state.filter }));
        }
    }, [JSON.stringify(state.status)]);

    useEffect(() => {
        dispatch(getAllBiddingHistorys({ query: state.filter }));
    }, [JSON.stringify(state.filter)]);

    return (
        <>
            <Heading
                title="Lịch sử đấu thầu"
                hasBreadcrumb
                buttons={[
                    {
                        text: "Export",
                        type: "ghost",
                        icon: <GoDownload className="text-[18px]" />,
                    },
                    {
                        icon: <FaPlus className="text-[18px]" />,
                        permission: EPermissions.CREATE_BIDDING_TYPE,
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

export default BiddingHistorys;
