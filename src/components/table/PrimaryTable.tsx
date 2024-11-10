import React, { useEffect } from "react";
import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
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

export interface IAdditionalTab {
  key: string;
  label: string;
  content: React.ReactNode
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
  tabLabel?: string;
  additionalTabs?: IAdditionalTab[]
}

const PrimaryTable = <T extends ISearchParams>({
  search,
  columns,
  data,
  pagination,
  setFilter,
  fetching,
  filter,
  scroll,
  tabLabel = "Danh sách dữ liệu",
  additionalTabs = []
  // ...rest
}: IPrimaryTableProps<T>) => {
  const dispatch = useDispatch();

  const getShowingText = (total: number, range: [number, number]) => {
    return `Hiển thị ${range[0]}-${range[1]} của ${total}`;
  };

  const handleTableChange = (pagination: any) => {
    dispatch(
      setFilter({
        page: pagination.current,
        size: pagination.pageSize,
      }),
    );
  };
  const newHandleTableChange = (newPagination: TablePaginationConfig) => {
    const newFilter: ISearchParams = {
      page: newPagination.current,
      size: newPagination.pageSize,
    };

    dispatch(setFilter(newFilter));

    if (fetching) {
      dispatch(fetching());
    }
  }

  const newPagination = pagination
    ? {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      showSizeChanger: pagination.showSideChanger ?? false,
      showTotal: (total: number, [start, end]: [number, number]) => getShowingText(total, [start, end]),
      onChange: handleTableChange,
    }
    : false;

  const tabItems = [
    {
      key: "table",
      label: tabLabel,
      content: (
        <Table
          onChange={newHandleTableChange}
          columns={columns}
          dataSource={data}
          pagination={newPagination}
          scroll={scroll}
          rowKey="key"
        />
      ),
    },
    ...additionalTabs,
  ];

  useEffect(() => {
    if (fetching) {
      dispatch(fetching());
    }
  }, [dispatch]);

  return (
    <div className="primary-table flex w-full flex-col gap-6">
      {search && (
        <SearchComponent search={search} setFilter={setFilter} filter={filter} />
      )}
      {additionalTabs.length > 0 ? (
        <CustomTabs items={tabItems} />
      ) : (
        <Table
          onChange={newHandleTableChange}
          columns={columns}
          dataSource={data}
          pagination={newPagination}
          scroll={scroll}
          rowKey="key"
          className="shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]"
        />
      )}
      {/* <div className="flex items-center justify-between">
        <div>
          Hiển thị {pagination?.current} - {pagination?.pageSize} trên tổng {pagination?.total}
        </div>
        <Pagination
          className="justify-end"
          onChange={(value) => {
            dispatch(setFilter({ page: value, size: 10 }));
            if (fetching) {
              dispatch(fetching());
            }
          }}
          showSizeChanger={pagination?.showSideChanger ?? false}
          defaultCurrent={1}
          total={pagination?.total}
        />
      </div> */}
    </div>
  );
};

export default PrimaryTable;
