import React, { useEffect } from "react";
import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ISearchParams } from "@/shared/utils/shared-interfaces";
import { useDispatch } from "react-redux";
import SearchComponent, { ISearchProps } from "./SearchComponent";

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
  ...rest
}: IPrimaryTableProps<T>) => {
  const dispatch = useDispatch();

  const getShowingText = (total: number, range: [number, number]) => {
    return `Showing ${range[0]}-${range[1]} of ${total}`;
  };

  const handleTableChange = (pagination: any) => {
    dispatch(
      setFilter({
        _page: pagination.current,
        _size: pagination.pageSize,
      }),
    );
  };

  useEffect(() => {
    if (fetching) {
      dispatch(fetching());
    }
  }, [dispatch]);
  return (
    <div className="primary-table flex w-full flex-col gap-6">
      {search && (
        <>
          {/* <FilterTableStatus options={search.status} /> */}
          <SearchComponent search={search} setFilter={setFilter} filter={filter} />
          {/* <div className="flex gap-4"> */}
          {/* <FormInput icon={IoSearchOutline} placeholder="Search product. . ." type="text" /> */}
          {/* <DateRangePicker /> */}
          {/* </div> */}
        </>
      )}
      <Table
        onChange={(newPagination: TablePaginationConfig) => {
          const newFilter: ISearchParams = {
            page: newPagination.current,
            size: newPagination.pageSize,
          };

          dispatch(setFilter(newFilter));

          if (fetching) {
            dispatch(fetching());
          }
        }}
        columns={columns}
        dataSource={data}
        // pagination={false}
        pagination={
          pagination
            ? {
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: pagination.showSideChanger ?? false,
                showTotal: (total, [start, end]) => getShowingText(total, [start, end]),
                onChange: handleTableChange,
              }
            : false
        }
        className="shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]"
        rowKey="key"
        scroll={scroll}
      />
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
