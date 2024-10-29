import React, { useEffect } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ISearchParams } from "@/shared/utils/shared-interfaces";
import { useDispatch } from "react-redux";
import SearchComponent, { ISearchProps } from "./SearchComponent";
import CustomTabs from "./CustomTabs";

export interface ITableData {
    key: React.Key;
    [key: string]: unknown;
}
export interface ScrollProps {
    x?: number | string | true;
    y?: number | string;
    scrollToFirstRowOnChange?: boolean;
    scrollbar?: {
        virtual?: boolean;
        nativeOn?: boolean;
    };
}
export interface ISearchTable {
    status: { value: string; label: string }[];
}

interface IAdditionalTab {
    key: string;
    label: string;
    content: React.ReactNode;
}

interface IPrimaryTableProps<T extends ISearchParams> extends ISearchProps<T> {
    columns: ColumnsType;
    data: ITableData[];
    setFilter: ActionCreatorWithPayload<ISearchParams>;
    scroll?: ScrollProps;
    pagination?: {
        pageSize: number;
        current: number;
        total: number;
        showSideChanger?: boolean;
        number_of_elements?: number;
    };
    fetching?: Function;
    chartData?: {
        name: string[];
        value: number[];
        seriesName?: string;
    };
    tableLabel?: string;
    isChart?: boolean;
    additionalTabs?: IAdditionalTab[]; // Thêm prop để nhận các tab bổ sung
}

const PrimaryTabless = <T extends ISearchParams>({
    search,
    columns,
    data,
    pagination,
    setFilter,
    fetching,
    filter,
    scroll,
    tableLabel = "Data Table",
    additionalTabs = [],
}: IPrimaryTableProps<T>) => {
    const dispatch = useDispatch();

    const getShowingText = (total: number, range: [number, number]) => {
        return `Hiển thị ${range[0]}-${range[1]} của ${total}`;
    };

    const handleTableChange = (pagination: any) => {
        dispatch(
            setFilter({
                page: pagination.current!,
                size: pagination.pageSize!,
            })
        );
        if (fetching) dispatch(fetching());
    };

    useEffect(() => {
        if (fetching) {
            dispatch(fetching());
        }
    }, [dispatch, fetching]);

    // Điều kiện để hiển thị CustomTabs chỉ khi isChart là true hoặc có additionalTabs
    const shouldShowTabs = additionalTabs.length > 0;

    if (shouldShowTabs) {
        // Tạo tabItems với các tab mặc định và các tab bổ sung
        const tabItems: { key: string; label: string; content: React.ReactNode }[] = [
            {
                key: "table",
                label: tableLabel,
                content: (
                    <Table
                        onChange={handleTableChange}
                        columns={columns}
                        dataSource={data}
                        pagination={
                            pagination
                                ? {
                                    current: pagination.current,
                                    pageSize: pagination.pageSize,
                                    total: pagination.total,
                                    showSizeChanger: pagination.showSideChanger ?? false,
                                    showTotal: (total, [start, end]) => getShowingText(total, [start, end]),
                                }
                                : false
                        }
                        scroll={scroll}
                        rowKey="key"
                        className="shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]"
                    />
                ),
            },
            ...additionalTabs,
        ];

        return (
            <div className="primary-table flex w-full flex-col gap-6">
                {search && (
                    <SearchComponent
                        search={search}
                        setFilter={setFilter}
                        filter={filter}
                    />
                )}
                <CustomTabs items={tabItems} />
            </div>
        );
    }

    return (
        <div className="primary-table flex w-full flex-col gap-6">
            {search && (
                <SearchComponent
                    search={search}
                    setFilter={setFilter}
                    filter={filter}
                />
            )}
            <Table
                onChange={handleTableChange}
                columns={columns}
                dataSource={data}
                pagination={
                    pagination
                        ? {
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: pagination.showSideChanger ?? false,
                            showTotal: (total, [start, end]) => getShowingText(total, [start, end]),
                        }
                        : false
                }
                scroll={scroll}
                rowKey="key"
                className="shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]"
            />
        </div>
    );
};

export default PrimaryTabless;
