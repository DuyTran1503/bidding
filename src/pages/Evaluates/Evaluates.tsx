import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { GoDownload } from "react-icons/go";
import { IEvaluateInitialState, resetStatus, setFilter } from "@/services/store/evaluate/evaluate.slice";
import { deleteEvaluate, getAllEvaluates } from "@/services/store/evaluate/evaluate.thunk";
import EvaluateForm from "./EvaluateForm";

const Evaluates = () => {
    const { state, dispatch } = useArchive<IEvaluateInitialState>("evaluate");

    const buttons: IGridButton[] = [
        {
            type: EButtonTypes.VIEW,
            //   permission: EPermissions.DETAIL_EVALUATE,
        },
        {
            type: EButtonTypes.UPDATE,
            // permission: EPermissions.UPDATE_EVALUATE,
        },
        {
            type: EButtonTypes.DESTROY,
            onClick(record) {
                dispatch(deleteEvaluate(record?.key));
            },
            // permission: EPermissions.DESTROY_EVALUATE,
        },
    ];

    const columns: ColumnsType<ITableData> = [
        {
            dataIndex: "index",
            title: "STT",
            className: "w-4",
        },
        {
            dataIndex: "evaluate",
            title: "Tên danh mục",
            className: "w-[300px]",
        },
        {
            dataIndex: "score",
            title: "Tên danh mục",
            className: "w-[300px]",
        },
        {
            dataIndex: "title",
            title: "Mô tả",
            className: "w-[300px]",
        },
    ];

    const search: ISearchTypeTable[] = [
        {
            id: "title",
            placeholder: "Nhập tên vai trò...",
            label: "Tên vai trò",
            type: "text",
        },
    ];

    const data: ITableData[] = useMemo(
        () =>
            state.evaluates && state.evaluates.length > 0
                ? state.evaluates.map(({ id, title, score, evaluate, project }, index) => ({
                    index: index + 1,
                    key: id,
                    id: id,
                    title,
                    score,
                    evaluate,
                    project
                }))
                : [],
        [JSON.stringify(state.evaluates)],
    );

    useFetchStatus({
        module: "evaluate",
        reset: resetStatus,
        actions: {
            success: { message: state.message },
            error: { message: state.message },
        },
    });

    useEffect(() => {
        if (state.status === EFetchStatus.FULFILLED) {
            dispatch(getAllEvaluates({ query: state.filter }));
        }
    }, [JSON.stringify(state.status)]);

    useEffect(() => {
        dispatch(getAllEvaluates({ query: state.filter }));
    }, [JSON.stringify(state.filter)]);

    return (
        <>
            <Heading
                title="Danh mục bài viết"
                hasBreadcrumb
                ModalContent={(props) => <EvaluateForm {...(props as any)} />}
                buttons={[
                    {
                        text: "Export",
                        type: "ghost",
                        icon: <GoDownload className="text-[18px]" />,
                    },
                    {
                        icon: <FaPlus className="text-[18px]" />,
                        // permission: EPermissions.CREATE_EVALUATE,
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
                ModalContent={(props) => <EvaluateForm {...(props as any)} />}
            />
        </>
    );
};

export default Evaluates;
