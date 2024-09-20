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
import { ITenderNoticeInitialState, resetStatus, setFilter } from "@/services/store/tenderNotice/tenderNotice.slice";
import { changeStatusTenderNotice, deleteTenderNotice, getAllTenderNotices } from "@/services/store/tenderNotice/tenderNotice.thunk";
// import { EPermissions } from "@/shared/enums/permissions";
import { GoDownload } from "react-icons/go";

const TenderNotices = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useArchive<ITenderNoticeInitialState>("tender_notice");
    const [isModal, setIsModal] = useState(false);
    const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);

    const buttons: IGridButton[] = [
        {
            type: EButtonTypes.VIEW,
            onClick(record) {
                navigate(`update/${record?.key}`);
            },
            // permission: EPermissions.DETAIL_TENDER_NOTICE,
        },
        {
            type: EButtonTypes.UPDATE,
            onClick(record) {
                navigate(`update/${record?.key}`);
            },
            // permission: EPermissions.UPDATE_TENDER_NOTICE,
        },
        {
            type: EButtonTypes.DESTROY,
            onClick(record) {
                dispatch(deleteTenderNotice(record?.key));
            },
            // permission: EPermissions.DESTROY_TENDER_NOTICE,
        },
    ];

    const columns: ColumnsType<ITableData> = [
        {
            dataIndex: "index",
            title: "STT",
        },
        {
            dataIndex: "notice_content",
            title: "Notice_content",
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
            dataIndex: "notice_date",
            title: "Notice_date",
        },
        {
            dataIndex: "expiry_date",
            title: "Expiry_date",
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
            dispatch(changeStatusTenderNotice(String(confirmItem.key)));
        }
    };

    const search: ISearchTypeTable[] = [
        {
            id: "name",
            placeholder: "Nhập tên thông báo...",
            label: "Tên thông báo",
            type: "text",
        },
    ];

    const data: ITableData[] = useMemo(
        () =>
            state.tenderNotices && state.tenderNotices.length > 0
                ? state.tenderNotices.map(({ id, project_id, enterprise_id, notice_content, notice_date, expiry_date, is_active }, index) => ({
                    index: index + 1,
                    key: id,
                    project_id,
                    enterprise_id,
                    notice_content,
                    notice_date,
                    expiry_date,
                    is_active,
                }))
                : [],
        [JSON.stringify(state.tenderNotices)],
    );

    useFetchStatus({
        module: "tender_notice",
        reset: resetStatus,
        actions: {
            success: { message: state.message },
            error: { message: state.message },
        },
    });

    useEffect(() => {
        if (state.status === EFetchStatus.FULFILLED) {
            dispatch(getAllTenderNotices({ query: state.filter }));
        }
    }, [JSON.stringify(state.status)]);

    useEffect(() => {
        dispatch(getAllTenderNotices({ query: state.filter }));
    }, [JSON.stringify(state.filter)]);

    return (
        <>
            <Heading
                title="Thông báo mời thầu"
                hasBreadcrumb
                buttons={[
                    {
                        text: "Export",
                        type: "ghost",
                        icon: <GoDownload className="text-[18px]" />,
                    },
                    {
                        icon: <FaPlus className="text-[18px]" />,
                        // permission: EPermissions.CREATE_TENDER_NOTICE,
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

export default TenderNotices;
