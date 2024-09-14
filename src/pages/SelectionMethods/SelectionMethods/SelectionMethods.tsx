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
import { ReactNode, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { ISelectionMethodInitialState, resetStatus, setFilter } from "@/services/store/selectionMethod/selectionMethod.slice";
import { changeStatusSelectionMethod, deleteSelectionMethod, getAllSelectionMethods } from "@/services/store/selectionMethod/selectionMethod.thunk";
// import { EPermissions } from "@/shared/enums/permissions";
import { GoDownload } from "react-icons/go";
import FormModal from "@/components/form/FormModal";
import DetailSelectionMethod from "../DetailSelectionMethod/DetailSelectionMethod";

const SelectionMethods = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useArchive<ISelectionMethodInitialState>("selection_method");
    const [isModal, setIsModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ReactNode>(null);
    const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);

    const buttons: IGridButton[] = [
        {
            type: EButtonTypes.VIEW,
            onClick(record) {
                setModalContent(<DetailSelectionMethod record={record} />);
                setIsModalOpen(true);
            },
            // permission: EPermissions.DETAIL_SELECTION_METHOD,
        },
        {
            type: EButtonTypes.UPDATE,
            onClick(record) {
                navigate(`update/${record?.key}`);
            },
            // permission: EPermissions.UPDATE_SELECTION_METHOD,
        },
        {
            type: EButtonTypes.DESTROY,
            onClick(record) {
                dispatch(deleteSelectionMethod(record?.key));
            },
            // permission: EPermissions.DESTROY_SELECTION_METHOD,
        },
    ];

    const columns: ColumnsType<ITableData> = [
        {
            dataIndex: "index",
            title: "STT",
        },
        {
            dataIndex: "method_name",
            title: "Method_Name",
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

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChangeStatus = (item: ITableData) => {
        setIsModal(true);
        setConfirmItem(item);
    };

    const onConfirmStatus = () => {
        if (confirmItem && confirmItem.key) {
            dispatch(changeStatusSelectionMethod(String(confirmItem.key)));
        }
    };

    const search: ISearchTypeTable[] = [
        {
            id: "method_name",
            placeholder: "Nhập tên hình thức...",
            label: "Tên hình thức",
            type: "text",
        },
    ];

    const data: ITableData[] = useMemo(
        () =>
            state.selectionMethods && state.selectionMethods.length > 0
                ? state.selectionMethods.map(({ id, method_name, description, is_active }, index) => ({
                    index: index + 1,
                    key: id,
                    method_name,
                    description,
                    is_active,
                }))
                : [],
        [JSON.stringify(state.selectionMethods)],
    );

    useFetchStatus({
        module: "selection_method",
        reset: resetStatus,
        actions: {
            success: { message: state.message },
            error: { message: state.message },
        },
    });

    useEffect(() => {
        if (state.status === EFetchStatus.FULFILLED) {
            dispatch(getAllSelectionMethods({ query: state.filter }));
        }
    }, [JSON.stringify(state.status)]);

    useEffect(() => {
        dispatch(getAllSelectionMethods({ query: state.filter }));
    }, [JSON.stringify(state.filter)]);

    return (
        <>
            <Heading
                title="Hình thức lựa chọn Nhà thầu"
                hasBreadcrumb
                buttons={[
                    {
                        text: "Export",
                        type: "ghost",
                        icon: <GoDownload className="text-[18px]" />,
                    },
                    {
                        icon: <FaPlus className="text-[18px]" />,
                        // permission: EPermissions.CREATE_SELECTION_METHOD,
                        text: "Thêm mới",
                        onClick: () => navigate("create"),
                    },
                ]}
            />
            <FormModal open={isModalOpen} onCancel={handleCancel}>
                {modalContent}
            </FormModal>
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

export default SelectionMethods;
