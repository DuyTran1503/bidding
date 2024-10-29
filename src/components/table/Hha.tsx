import { ColumnsType } from "antd/es/table";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ISearchParams } from "@/shared/utils/shared-interfaces";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { EButtonTypes } from "@/shared/enums/button";
import { ISearchTypeTable } from "../table/SearchComponent";
import GridButtons from "../grid/GridButtons";
import { SetStateAction, useMemo, Dispatch, ReactNode, useState } from "react";
import { TableColumnsType } from "antd";
import PrimaryTabless, { ITableData, ScrollProps } from "./Hehehe";

interface IAdditionalTab {
    key: string;
    label: string;
    content: React.ReactNode;
}

export interface IModalProps<T> {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    item?: T | ITableData;
    isDetail?: boolean;
    setItem?: Dispatch<SetStateAction<T | undefined>>;
    type?: EButtonTypes;
}

interface IGridProps<T extends ISearchParams> {
    columns: ColumnsType;
    data: ITableData[];
    search?: ISearchTypeTable[];
    buttons?: IGridButton[];
    pagination?: {
        pageSize: number;
        current: number;
        total: number;
        showSideChanger?: boolean;
        number_of_elements?: number;
    };
    setFilter: ActionCreatorWithPayload<ISearchParams>;
    fetching?: Function;
    filter?: T;
    scroll?: ScrollProps;
    tableLabel?: string;
    ModalContent?: (props: IModalProps<T>) => ReactNode;
    additionalTabs?: IAdditionalTab[];
}

const ManagementGridss = <T extends ISearchParams>({
    columns,
    data,
    search,
    buttons,
    pagination,
    setFilter,
    fetching,
    filter,
    scroll,
    ModalContent,
    tableLabel,
    additionalTabs = [],
}: IGridProps<T>) => {
    const [modalUpdate, setModalUpdate] = useState(false);
    const [isDetail, setIsDetail] = useState(false);
    const [item, setItem] = useState<ITableData>({} as ITableData);
    const [type, setType] = useState<EButtonTypes>(EButtonTypes.VIEW);

    const handleButtonClick = (record: ITableData, type: EButtonTypes) => {
        if (type === EButtonTypes.UPDATE || type === EButtonTypes.VIEW) {
            setItem(record); // Wrap record in an array
            setIsDetail(type === EButtonTypes.VIEW);
            setType(type);
            setModalUpdate(true);
        } else if (type === EButtonTypes.DESTROY) {
            // Handle delete action if needed
        }
    };

    const renderColumns = useMemo(() => {
        return buttons?.some((button) =>
            [EButtonTypes.VIEW, EButtonTypes.UPDATE, EButtonTypes.DESTROY].includes(button.type)
        )
            ? ([
                ...columns,
                {
                    title: "Hành động",
                    width: "120px",
                    dataIndex: "actions",
                    key: "actions",
                    fixed: "right",
                    align: "center",
                    render: (_, record) => (
                        <GridButtons
                            buttons={buttons}
                            record={record as any}
                            onClick={(record, type) => handleButtonClick(record as any, type)}
                        />
                    ),
                },
            ] as TableColumnsType)
            : columns;
    }, [JSON.stringify(buttons)]);
    const Modal = useMemo(
        () =>
            ModalContent && (
                <ModalContent
                    type={type}
                    visible={modalUpdate}
                    setVisible={setModalUpdate}
                    item={item} // Pass item, which is now an array
                    isDetail={isDetail}
                    setItem={setItem as any}
                />
            ),
        [modalUpdate, item, isDetail],
    );

    return (
        <>
            <PrimaryTabless
                scroll={scroll}
                search={search!}
                columns={renderColumns}
                data={data}
                pagination={pagination}
                setFilter={setFilter}
                fetching={fetching}
                filter={filter!}
                additionalTabs={additionalTabs}
                tableLabel={tableLabel} // Truyền tên cho các tab
            />
            {Modal}
        </>
    );
};

export default ManagementGridss;
