import React, { useEffect } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import FilterTableStatus from "./FilterTableStatus";
import FormInput from "../form/FormInput";
import { IoSearchOutline } from "react-icons/io5";
import DateRangePicker from "../form/FormDateRangePicker";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ISearchParams } from "@/shared/utils/shared-interfaces";
import { useDispatch } from "react-redux";
import SearchComponent, { ISearchProps } from "./SearchComponent";

export interface ITableData {
  key: React.Key;
  [key: string]: unknown;
}

export interface ISearchTable {
  status: { value: string; label: string }[];
}
interface IPrimaryTableProps<T extends ISearchParams> extends ISearchProps<T> {
  columns: ColumnsType;
  data: ITableData[];
  setFilter: ActionCreatorWithPayload<ISearchParams>;
  pagination?: { pageSize: number; current: number; total: number; showSideChanger?: boolean };
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
  ...rest // This allows you to spread any additional props from ISearchProps
}: IPrimaryTableProps<T>) => {
  const dispatch = useDispatch();
  const getShowingText = (total: number, range: [number, number]) => {
    return `Showing ${range[0]}-${range[1]} from ${total}`;
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
        onChange={(newPagination) => {
          dispatch(
            setFilter({
              _page: newPagination.current,
              _size: newPagination.pageSize,
            }),
          );
        }}
        columns={columns}
        dataSource={data}
        pagination={
          pagination
            ? {
                ...pagination,
                showTotal: getShowingText,
                showSizeChanger: pagination.showSideChanger ?? false,
              }
            : false
        }
        className="shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]"
      />
    </div>
  );
};

export default PrimaryTable;
