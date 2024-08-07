import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import FilterTableStatus from "./FilterTableStatus";
import FormInput from "../form/FormInput";
import { IoSearchOutline } from "react-icons/io5";
import DateRangePicker from "../form/FormDateRangePicker";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ISearchParams } from "@/shared/utils/shared-interfaces";
import { useDispatch } from "react-redux";

export interface ITableData {
  key: React.Key;
  [key: string]: unknown;
}

export interface ISearchTable {
  status: { value: string; label: string }[];
}

interface IPrimaryTableProps {
  search?: ISearchTable | false;
  columns: ColumnsType<ITableData>;
  data: ITableData[];
  setFilter: ActionCreatorWithPayload<ISearchParams>;
  pagination?: {
    pageSize: number;
    current: number;
    total: number;
    showSizeChanger?: boolean;
  };
}

const PrimaryTable: React.FC<IPrimaryTableProps> = ({ search, columns, data, pagination, setFilter }) => {
  const dispatch = useDispatch();

  const getShowingText = (total: number, range: [number, number]) => {
    return `Showing ${range[0]}-${range[1]} of ${total}`;
  };

  const handleTableChange = (pagination: any) => {
    dispatch(
      setFilter({
        _page: pagination.current,
        _size: pagination.pageSize,
      })
    );
  };

  return (
    <div className="primary-table flex w-full flex-col gap-6">
      {search && (
        <div className="flex justify-between mb-4">
          <FilterTableStatus options={search.status} />
          <div className="flex gap-4">
            <FormInput icon={IoSearchOutline} placeholder="Search product..." type="text" />
            <DateRangePicker />
          </div>
        </div>
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
              showSizeChanger: pagination.showSizeChanger ?? false,
              showTotal: (total, [start, end]) => getShowingText(total, [start, end]),
              onChange: handleTableChange,
            }
            : false
        }
        className="shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]"
        rowKey="key"
      />
    </div>
  );
};

export default PrimaryTable;
