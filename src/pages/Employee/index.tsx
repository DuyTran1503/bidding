import Heading from "@/components/layout/Heading";
import { GoDownload } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import ManagementGrid from "@/components/grid/ManagementGrid";
import { ColumnsType } from "antd/es/table";
import { ITableData } from "@/components/table/PrimaryTable";
import { useNavigate } from "react-router-dom";
import { useArchive } from "@/hooks/useArchive";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { EButtonTypes } from "@/shared/enums/button";
import { EPermissions } from "@/shared/enums/permissions";
import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "@/components/common/CommonModal";
import useFetchStatus from "@/hooks/useFetchStatus";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import CustomerAvatar from "@/components/common/CustomerAvatar";
import { IEmployeeInitialState, resetStatus, setFilter } from "@/services/store/employee/employee.slice";
import { deleteEmployee, getAllEmployee } from "@/services/store/employee/employee.thunk";

const Employee = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IEmployeeInitialState>("employee");
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
      render(_, record) {
        return <CustomerAvatar src={record.avatar} alt={"Ảnh đại diện"} />;
      },
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

    // {
    //   title: "Trạng thái tài khoản",
    //   dataIndex: "account_ban_at",
    //   render(_, record) {
    //     return (
    //       <CommonSwitch
    //         onChange={() => handleChangeStatus(record)}
    //         checked={!!record.account_ban_at}
    //         title={`Bạn có chắc chắn muốn ${record.account_ban_at ? "bỏ cấm" : "cấm"} tài khoản này?`}
    //       />
    //     );
    //   },
    // },
  ];
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/employees/detail/${record?.key}`);
      },
      // permission: EPermissions.DETAIL_EMPLOYEE,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/employees/update/${record?.key}`);
      },
      // permission: EPermissions.UPDATE_EMPLOYEE,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteEmployee(record?.key));
      },
      // permission: EPermissions.DESTROY_EMPLOYEE,
    },
  ];
  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên vai trò...",
      title: "Tên vai trò",
      type: "text",
    },
  ];
  const data: ITableData[] = useMemo(() => {
    return Array.isArray(state.employees)
      ? state.employees.map((employee, index) => ({
          index: index + 1,
          key: employee.id, // Use employee.id as the unique key
          enterprise_id: employee.enterprise_id,
          code: employee.code,
          name: employee.name,
          phone: employee.phone,
          email: employee.email,
          birthday: employee.birthday,
          gender: employee.gender,
          taxcode: employee.taxcode,
          educational_level: employee.educational_level,
          start_date: employee.start_date,
          end_date: employee.end_date,
          salary: employee.salary,
          address: employee.address,
          status: employee.status,
        }))
      : [];
  }, [JSON.stringify(state.employees)]);
  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };
  // const onConfirmStatus = () => {
  //   if (confirmItem && confirmItem.key) {
  //     dispatch(changeStatusEmployee(String(confirmItem.key)));
  //   }
  // };

  useEffect(() => {
    dispatch(getAllEmployee({ query: state.filter }));
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
              navigate("/employees/create");
            },
          },
        ]}
      />
      {/* <ConfirmModal
        title={"Xác nhận"}
        content={"Bạn chắc chắn muốn thay đổi trạng thái không"}
        visible={isModal}
        setVisible={setIsModal}
        onConfirm={onConfirmStatus}
      /> */}
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
      />
    </>
  );
};

export default Employee;
