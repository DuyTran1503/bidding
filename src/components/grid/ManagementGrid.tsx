import { ColumnsType } from "antd/es/table";
import PrimaryTable, { ITableData, ScrollProps } from "../table/PrimaryTable";
import { IGridButton, ISearchParams } from "@/shared/utils/shared-interfaces";
import { SetStateAction, useMemo, Dispatch, ReactNode, useState } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import GridButtons from "./GridButtons";
import { TableColumnsType } from "antd";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ISearchTypeTable } from "../table/SearchComponent";

export interface IModalProps<T> {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: T | ITableData;
  isDetail?: boolean;
  setItem?: Dispatch<SetStateAction<T | undefined>>;
  type?: EButtonTypes;
}
export interface IGridProps<T extends ISearchParams> {
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
  ModalContent?: (props: IModalProps<T>) => ReactNode;
}

const ManagementGrid = <T extends ISearchParams>({
  columns,
  data,
  search, // Keep it optional
  buttons,
  pagination,
  setFilter,
  fetching,
  filter,
  scroll,
  ModalContent,
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
    return buttons?.some((button) => button.type === EButtonTypes.VIEW || button.type === EButtonTypes.UPDATE || button.type === EButtonTypes.DESTROY)
      ? ([
          ...columns,
          {
            title: "Hành động",
            width: "120px",
            dataIndex: "actions",
            key: "actions",
            fixed: "right",
            align: "center",
            render(_, record) {
              return <GridButtons buttons={buttons} record={record as any} onClick={(record, type) => handleButtonClick(record as any, type)} />;
            },
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
      <PrimaryTable
        scroll={scroll}
        search={search!}
        columns={renderColumns}
        data={data}
        pagination={pagination}
        setFilter={setFilter}
        fetching={fetching}
        filter={filter!}
      />
      {Modal}
    </>
  );
};

export default ManagementGrid;
