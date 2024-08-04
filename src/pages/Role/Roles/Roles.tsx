import ManagementGrid from "@/components/grid/ManagementGrid";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import Heading from "@/components/layout/Heading";
import { fetching, IRoleInitialState, resetStatus, setData, setFilter } from "@/services/store/role/role.slice";
import { deleteRole, getAllRoles } from "@/services/store/role/role.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Roles = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IRoleInitialState>("role");
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/roles/detail/${record?.key}`);
      },
      permission: EPermissions.DETAIL_ROLE,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/roles/update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_ROLE,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteRole(record?.key));
      },
      permission: EPermissions.DESTROY_ROLE,
    },
  ];

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "name",
      title: "Name",
    },
  ];

  const data: ITableData[] = useMemo(() => {
    if (state.roles && state.roles.length > 0) {
      return state.roles.map((role, index) => ({
        index: index + 1,
        key: role.id,
        name: role.name,
      }));
    }
    return [];
  }, [JSON.stringify(state.roles)]);

  useFetchStatus({
    module: "role",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    dispatch(getAllRoles({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  return (
    <>
      <Heading
        title="Vai trò"
        hasBreadcrumb
        buttons={[
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_ROLE,
            text: "Tạo mới",
            onClick: () => navigate("/roles/create"),
          },
        ]}
      />
      <ManagementGrid
        columns={columns}
        data={data}
        search={{ status: [] }}
        buttons={buttons}
        pagination={{
          current: state.filter._page! ?? 1,
          pageSize: state.filter._page! ?? 10,
          total: state.totalRecords,
        }}
        setFilter={setFilter}
        fetching={fetching}
      />
    </>
  );
};

export default Roles;
