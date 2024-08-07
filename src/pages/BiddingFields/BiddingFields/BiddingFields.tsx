import FormModal from "@/components/form/FormModal";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IBiddingFieldInitialState, resetStatus, setFilter } from "@/services/store/biddingField/biddingField.slice";
import { deleteBiddingField, getAllBiddingFields } from "@/services/store/biddingField/biddingField.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState, ReactNode } from "react"; // Import ReactNode
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const BiddingFields = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useArchive<IBiddingFieldInitialState>("biddingfield");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ReactNode>(null);

    const buttons: IGridButton[] = [
        {
            type: EButtonTypes.VIEW,
            onClick(record) {
                setModalContent(
                    <>
                        <p><strong>Tên của lĩnh vực đấu thầu:</strong> {record.name}</p>
                        <p><strong>Mô tả của lĩnh vực đấu thầu:</strong> {record.description}</p>
                        <p><strong>Code:</strong> {record.code}</p>
                        <p><strong>is_active:</strong> {record.is_active ? "Có" : "Không"}</p>
                        <p><strong>Lĩnh vực cha:</strong> {record.parent_name}</p>
                    </>
                );
                setIsModalOpen(true);
            },
            // permission: EPermissions.DETAIL_BIDDINGFIELD,
        },
        {
            type: EButtonTypes.UPDATE,
            onClick(record) {
                navigate(`/bidding-fields/update/${record?.key}`);
            },
            // permission: EPermissions.UPDATE_BIDDINGFIELD,
        },
        {
            type: EButtonTypes.DELETE,
            onClick(record) {
                dispatch(deleteBiddingField(record?.key));
            },
            // permission: EPermissions.DESTROY_BIDDINGFIELD,
        },
    ];

    const columns: ColumnsType<ITableData> = [
        {
            dataIndex: "name",
            title: "Name",
        },
        {
            dataIndex: "code",
            title: "Code",
        },
        {
            dataIndex: "description",
            title: "Description",
        },
    ];

    const handleSubmit = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const data: ITableData[] = useMemo(() => {
        if (state.biddingFields && state.biddingFields.length > 0) {
            return state.biddingFields.map((field) => ({
                key: field.id,
                name: field.name,
                description: field.description,
                code: field.code,
                is_active: field.is_active,
                parent_name: field.parent_name,
            }));
        }
        return [];
    }, [JSON.stringify(state.biddingFields)]);

    useFetchStatus({
        module: "biddingfield",
        reset: resetStatus,
        actions: {
            success: { message: state.message },
            error: { message: state.message },
        },
    });

    useEffect(() => {
        dispatch(getAllBiddingFields({ query: state.filter }));
    }, [JSON.stringify(state.filter)]);

    return (
        <>
            <Heading
                title="Bidding Fields"
                hasBreadcrumb
                buttons={[
                    {
                        icon: <FaPlus className="text-[18px]" />,
                        // permission: EPermissions.CREATE_BIDDINGFIELD,
                        text: "Create Bidding Field",
                        onClick: () => navigate("/bidding-fields/create"),
                    },
                ]}
            />
            <FormModal
                title="Bidding Field Details"
                open={isModalOpen}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                submitText="Submit"
            >
                {modalContent}
            </FormModal>
            <ManagementGrid
                columns={columns}
                data={data}
                search={{ status: [] }}
                buttons={buttons}
                pagination={{
                    current: state.filter._page! ?? 1,
                    pageSize: state.filter._size! ?? 10,
                    total: state.totalRecords!,
                }}
                setFilter={setFilter}
            />
        </>
    );
}

export default BiddingFields;
