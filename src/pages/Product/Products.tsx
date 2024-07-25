import Heading from "@/components/layout/Heading";
import { GoDownload } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import ManagementGrid from "@/components/grid/ManagementGrid";
import { ColumnsType } from "antd/es/table";
import { ITableData } from "@/components/table/PrimaryTable";
import { useNavigate } from "react-router-dom";
import { useArchive } from "@/hooks/useArchive";
import { IRoleInitialState, setFilter } from "@/services/store/role/role.slice";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { EButtonTypes } from "@/shared/enums/button";
import { EPermissions } from "@/shared/enums/permissions";
import { useEffect, useMemo } from "react";
import { deleteStaff, getAllStaff } from "@/services/store/account/account.thunk";
import { Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const Staffs = () => {
  const columns: ColumnsType = [
    {
      dataIndex: "name",
      title: "Name",
    },
    {
      dataIndex: "image",
      title: "Ảnh đại diện",
    },
    {
      dataIndex: "email",
      title: "Email",
    },
    {
      dataIndex: "phone",
      title: "Số điện thoại",
    },
    // {
    //   dataIndex: "total_bought",
    //   title: "Số điện thoại",
    // },

    {
      dataIndex: "account_ban_at",
      title: "Trạng thái tài khoản",
    },
  ];
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IRoleInitialState>("account");
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/staffs/detail/${record?.key}`);
      },
      permission: EPermissions.DETAIL_STAFF,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/staffs/update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_STAFF,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteStaff(record?.key));
      },
      permission: EPermissions.DESTROY_STAFF,
    },
  ];

  const data: ITableData[] = useMemo(() => {
    return Array.isArray(state.staffs)
      ? state.staffs.map(({ id, name, image, email, phone, account_ban_at }) => ({
          key: id,
          name,
          image,
          email,
          phone,
          account_ban_at: <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />,
        }))
      : [];
  }, [JSON.stringify(state.staffs)]);
  const handleChangeStatus = () => {
    console.log("sdf");
  };
  useEffect(() => {
    dispatch(getAllStaff({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);
  return (
    <>
      <Heading
        title="Nhân viên"
        hasBreadcrumb
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
          },
          {
            text: "Thêm nhân viên",
            icon: <FaPlus className="text-[18px]" />,
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
      />
    </>
  );
};

export default Staffs;
