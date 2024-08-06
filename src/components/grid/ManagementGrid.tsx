import { ColumnsType } from "antd/es/table";
import PrimaryTable, { ISearchTable, ITableData } from "../table/PrimaryTable";
import { IGridButton, ISearchParams } from "@/shared/utils/shared-interfaces";
import { useMemo } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import GridButtons from "./GridButtons";
import { TableColumnsType } from "antd";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ISearchTypeTable } from "../table/SearchComponent";

export interface IGridProps<T extends ISearchParams> {
  columns: ColumnsType;
  data: ITableData[];
  // search: ISearchTable | false;
  search?: ISearchTypeTable[];
  buttons?: IGridButton[];
  pagination?: {
    pageSize: number;
    current: number;
    total: number;
  };
  setFilter: ActionCreatorWithPayload<ISearchParams>;
  fetching?: Function;
  filter?: T;
}

const ManagementGrid = <T extends ISearchParams>({
  columns,
  data,
  search, // Keep it optional
  buttons,
  pagination,
  setFilter,
  fetching,
  filter
}: IGridProps<T>) => {
  const renderColumns = useMemo(() => {
    return buttons?.some((button) => button.type === EButtonTypes.VIEW || button.type === EButtonTypes.UPDATE || button.type === EButtonTypes.DESTROY)
      ? ([
          ...columns,
          {
            title: "Actions",
            width: "150px",
            dataIndex: "actions",
            key: "actions",
            fixed: "right",
            align: "center",
            render(_, record) {
              return <GridButtons buttons={buttons} record={record} />;
            },
          },
        ] as TableColumnsType)
      : columns;
  }, [JSON.stringify(buttons)]);
  return (
    <PrimaryTable
      search={search!}
      columns={renderColumns}
      data={data}
      pagination={pagination}
      setFilter={setFilter}
      fetching={fetching}
      filter={filter!}
    />
  );
};

export default ManagementGrid;
