import React, { useCallback, useEffect, useMemo } from "react";
import { IRoleInitialState, setData } from "@/services/store/role/role.slice";
import { useArchive } from "@/hooks/useArchive";
import { getAllPermissions, getRoleById } from "@/services/store/role/role.thunk";
import { Table, TableProps } from "antd";
import { ITableData } from "@/components/table/PrimaryTable";
import { ColumnsType } from "antd/es/table";

interface DataType {
  key: string;
  name: string;
}
const DetailRole: React.FC<{ id: string }> = ({ id }) => {
  const { state, dispatch } = useArchive<IRoleInitialState>("role");
  const memoizedDispatch = useCallback(dispatch, []);
  useEffect(() => {
    if (id) memoizedDispatch(getRoleById(id));
    dispatch(getAllPermissions());
    return () => {
      memoizedDispatch(setData());
    };
  }, [JSON.stringify(id), memoizedDispatch]);
  const permission = state?.permissions
    ?.filter((item: any) => state.activeRole?.permissions?.map((ele) => +ele).includes(item.id))
    .map((item) => item.name);
  const data: ITableData[] = useMemo(() => {
    if (permission && permission.length > 0) {
      return permission.map((item, index) => ({
        index: index + 1,
        key: index + 1,
        name: item,
      }));
    }
    return [];
  }, [JSON.stringify(permission)]);
  console.log(permission);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Tên vai trò",
      dataIndex: "name",
      key: "name",
    },
  ];
  return (
    <div className="bg-white p-4">
      <h2 className="mb-4 text-3xl font-semibold">Thông tin chi tiết</h2>
      <div>
        <div className="text-m-medium mb-1 block text-black-300">Tên vai trò: {state?.activeRole?.name}</div>
        {!!state?.activeRole && permission?.length > 0 && <Table columns={columns as ColumnsType<any>} dataSource={data} />}
      </div>
    </div>
  );
};

export default DetailRole;
