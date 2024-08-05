import Heading from "@/components/layout/Heading";
import { GoDownload } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import ManagementGrid from "@/components/grid/ManagementGrid";
import { ColumnsType } from "antd/es/table";
import { ITableData } from "@/components/table/PrimaryTable";
import { useNavigate } from "react-router-dom";
import { useArchive } from "@/hooks/useArchive";
import { setFilter } from "@/services/store/role/role.slice";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { EButtonTypes } from "@/shared/enums/button";
import { EPermissions } from "@/shared/enums/permissions";
import { useEffect, useMemo, useState } from "react";
import { changeStatusStaff, deleteStaff, getAllStaff } from "@/services/store/account/account.thunk";
import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import { IAccountInitialState, resetStatus } from "@/services/store/account/account.slice";
import useFetchStatus from "@/hooks/useFetchStatus";

const Staffs = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IAccountInitialState>("account");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "name",
      title: "Name",
    },
    {
      dataIndex: "avatar",
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
      title: "Trạng thái tài khoản",
      dataIndex: "account_ban_at",
      render(_, record) {
        return (
          <CommonSwitch
            onChange={() => handleChangeStatus(record)}
            checked={!!record.account_ban_at}
            title={`Bạn có chắc chắn muốn ${record.account_ban_at ? "bỏ cấm" : "cấm"} tài khoản này?`}
          />
        );
      },
    },
  ];
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
      ? state.staffs.map(({ id_user, name, avatar, email, phone, account_ban_at }, index) => ({
          index: index + 1,
          key: id_user,
          name,
          avatar,
          email,
          phone,
          account_ban_at,
        }))
      : [];
  }, [JSON.stringify(state.staffs)]);
  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };
  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusStaff(String(confirmItem.key)));
      dispatch(getAllStaff({ query: state.filter }));
    }
  };
  useEffect(() => {
    dispatch(getAllStaff({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);
  useFetchStatus({
    module: "account",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });
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
            onClick: () => {
              navigate("/staffs/create");
            },
          },
        ]}
      />
      <ConfirmModal
        title={"Xác nhận"}
        content={"Bạn chắc chắn muốn thay đổi trạng thái không"}
        visible={isModal}
        setVisible={setIsModal}
        onConfirm={onConfirmStatus}
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
