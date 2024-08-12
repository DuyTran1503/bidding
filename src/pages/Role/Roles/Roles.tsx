import ManagementGrid from "@/components/grid/ManagementGrid";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import Heading from "@/components/layout/Heading";
import { fetching, IRoleInitialState, resetStatus, setFilter } from "@/services/store/role/role.slice";
import { deleteRole, getAllRoles } from "@/services/store/role/role.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import DetailRole from "../DetailRole/DetailRole";
import FormModal from "@/components/form/FormModal";

const Roles = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const { state, dispatch } = useArchive<IRoleInitialState>("role");
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        setModalContent(<DetailRole id={record?.key} />);
        setIsModalOpen(true);
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
      title: "Tên vai trò",
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên vai trò...",
      label: "Tên vai trò",
      type: "text",
    },
  ];
  return (
    <>
      <Heading
        title="Vai trò"
        hasBreadcrumb
        buttons={[
          {
            icon: <FaPlus className="text-[18px]" />,
<<<<<<< HEAD
            // permission: EPermissions.CREATE_ROLE,
            text: "Create Role",
=======
            permission: EPermissions.CREATE_ROLE,
            text: "Tạo mới",
>>>>>>> 0c6d7c227de676031411e8cba8334225f850cac8
            onClick: () => navigate("/roles/create"),
          },
        ]}
      />
      <FormModal open={isModalOpen} onCancel={handleCancel}>
        {modalContent}
      </FormModal>
      <ManagementGrid
        columns={columns}
        data={data}
        search={search}
        buttons={buttons}
        pagination={{
          current: state.filter.page ?? 1,
          pageSize: state.filter.size ?? 10,
          total: state.totalRecords,
        }}
        setFilter={setFilter}
        filter={state.filter}
        fetching={fetching}
      />
    </>
  );
};

export default Roles;
