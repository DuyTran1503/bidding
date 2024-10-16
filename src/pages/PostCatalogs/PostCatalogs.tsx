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
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { GoDownload } from "react-icons/go";
import { IPostCatalogInitialState, resetStatus, setFilter } from "@/services/store/postCatalog/postCatalog.slice";
import { changeStatusPostCatalog, deletePostCatalog, getAllPostCatalogs } from "@/services/store/postCatalog/postCatalog.thunk";
import PostCatalogForm from "./PostCatalogForm";

const PostCatalogs = () => {
    const { state, dispatch } = useArchive<IPostCatalogInitialState>("post_catalog");
    const [isModal, setIsModal] = useState(false);
    const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);

    const buttons: IGridButton[] = [
        {
            type: EButtonTypes.VIEW,
            //   permission: EPermissions.DETAIL_POST_CATALOG,
        },
        {
            type: EButtonTypes.UPDATE,
            // permission: EPermissions.UPDATE_POST_CATALOG,
        },
        {
            type: EButtonTypes.DESTROY,
            onClick(record) {
                dispatch(deletePostCatalog(record?.key));
            },
            // permission: EPermissions.DESTROY_POST_CATALOG,
        },
    ];

    const columns: ColumnsType<ITableData> = [
        {
            dataIndex: "index",
            title: "STT",
        },
        {
            dataIndex: "name",
            title: "Tên danh mục",
            className: "w-[300px]",
        },
        {
            dataIndex: "description",
            title: "Mô tả",
            render(_, record) {
                return <div dangerouslySetInnerHTML={{ __html: record?.description || "" }} className="text-compact-3"></div>;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "is_active",
            render(_, record) {
                return (
                    <CommonSwitch
                        onChange={() => handleChangeStatus(record)}
                        checked={!!record.is_active}
                        title={`Bạn có chắc chắn muốn ${record.is_active ? "bỏ hoạt động" : "khóa hoạt động"} ?`}
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
            dispatch(changeStatusPostCatalog(String(confirmItem.key)));
        }
    };

    const search: ISearchTypeTable[] = [
        {
            id: "name",
            placeholder: "Nhập tên vai trò...",
            label: "Tên vai trò",
            type: "text",
        },
    ];

    const data: ITableData[] = useMemo(
        () =>
            state.postCatalogs && state.postCatalogs.length > 0
                ? state.postCatalogs.map(({ id, name, description, is_active }, index) => ({
                    index: index + 1,
                    key: id,
                    id: id,
                    name,
                    description,
                    is_active,
                }))
                : [],
        [JSON.stringify(state.postCatalogs)],
    );

    useFetchStatus({
        module: "post_catalog",
        reset: resetStatus,
        actions: {
            success: { message: state.message },
            error: { message: state.message },
        },
    });

    useEffect(() => {
        if (state.status === EFetchStatus.FULFILLED) {
            dispatch(getAllPostCatalogs({ query: state.filter }));
        }
    }, [JSON.stringify(state.status)]);

    useEffect(() => {
        dispatch(getAllPostCatalogs({ query: state.filter }));
    }, [JSON.stringify(state.filter)]);

    return (
        <>
            <Heading
                title="Danh mục bài viết"
                hasBreadcrumb
                ModalContent={(props) => <PostCatalogForm {...(props as any)} />}
                buttons={[
                    {
                        text: "Export",
                        type: "ghost",
                        icon: <GoDownload className="text-[18px]" />,
                    },
                    {
                        icon: <FaPlus className="text-[18px]" />,
                        // permission: EPermissions.CREATE_POST_CATALOG,
                        text: "Thêm mới",
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
                ModalContent={(props) => <PostCatalogForm {...(props as any)} />}
            />
        </>
    );
};

export default PostCatalogs;
