import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
// import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { IStatisticalReportInitialState, resetStatus, setFilter } from "@/services/store/statisticalReport/statisticalReport.slice";
import { EPermissions } from "@/shared/enums/permissions";
import {
    changeStatusStatisticalReport,
    deleteStatisticalReport,
    getAllStatisticalReports
} from "@/services/store/statisticalReport/statisticalReport.thunk";
import { GoDownload } from "react-icons/go";

const StatisticalReports = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useArchive<IStatisticalReportInitialState>("statistical_report");
    const [isModal, setIsModal] = useState(false);
    const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);

    const buttons: IGridButton[] = [
        {
            type: EButtonTypes.VIEW,
            onClick(record) {
                navigate(`update/${record?.key}`);
            },
            permission: EPermissions.DETAIL_STATISTICAL_REPORT,
        },
        {
            type: EButtonTypes.UPDATE,
            onClick(record) {
                navigate(`update/${record?.key}`);
            },
            permission: EPermissions.UPDATE_STATISTICAL_REPORT,
        },
        {
            type: EButtonTypes.DESTROY,
            onClick(record) {
                dispatch(deleteStatisticalReport(record?.key));
            },
            permission: EPermissions.DESTROY_STATISTICAL_REPORT,
        },
    ];

    const columns: ColumnsType<ITableData> = [
        {
            dataIndex: "index",
            title: "STT",
        },
        {
            dataIndex: "name",
            title: "Name",
        },
        {
            dataIndex: "description",
            title: "Description",
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
            dispatch(changeStatusStatisticalReport(String(confirmItem.key)));
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
            state.statisticalReports && state.statisticalReports.length > 0
                ? state.statisticalReports.map(({ id, name, description, is_active }, index) => ({
                    index: index + 1,
                    key: id,
                    name,
                    description,
                    is_active,
                }))
                : [],
        [JSON.stringify(state.statisticalReports)],
    );

    useFetchStatus({
        module: "statistical_report",
        reset: resetStatus,
        actions: {
            success: { message: state.message },
            error: { message: state.message },
        },
    });

    useEffect(() => {
        if (state.status === EFetchStatus.FULFILLED) {
            dispatch(getAllStatisticalReports({ query: state.filter }));
        }
    }, [JSON.stringify(state.status)]);

    useEffect(() => {
        dispatch(getAllStatisticalReports({ query: state.filter }));
    }, [JSON.stringify(state.filter)]);

    return (
        <>
            <Heading
                title="Thông báo thống kê"
                hasBreadcrumb
                buttons={[
                    {
                        text: "Export",
                        type: "ghost",
                        icon: <GoDownload className="text-[18px]" />,
                    },
                    {
                        icon: <FaPlus className="text-[18px]" />,
                        // permission: EPermissions.CREATE_STATISTICALREPORT,
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

export default StatisticalReports;
