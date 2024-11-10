import CustomerAvatar from "@/components/common/CustomerAvatar";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IEmployeeInitialState, resetStatus, setFilter } from "@/services/store/employee/employee.slice";
import { deleteEmployee, getAllEmployee } from "@/services/store/employee/employee.thunk";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { educationLevelEnumArray, mappingEducationLevel } from "@/shared/enums/level";
import { employeeEnumArray, mappingEmployee } from "@/shared/enums/types";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { GoDownload } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const Employee = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IEmployeeInitialState>("employee");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const enterpriseName = (value: number) => {
    if (stateEnterprise?.listEnterprise!.length > 0 && !!value) {
      return stateEnterprise?.listEnterprise!.find((item) => item.id === value)?.name;
    }
  };
  const enterpriseOption: IOption[] =
    stateEnterprise?.listEnterprise! && stateEnterprise.listEnterprise.length > 0
      ? stateEnterprise.listEnterprise.map((e) => ({
          value: e.id,
          label: e.name,
        }))
      : [];
  const optionStatus: IOption[] = employeeEnumArray.map((e) => ({
    label: mappingEmployee[e],
    value: e,
  }));

  const optionEducation: IOption[] = educationLevelEnumArray.map((e) => ({
    label: mappingEducationLevel[e],
    value: e,
  }));
  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "name",
      title: "Name",
      className: "w-[200px]",
    },
    {
      dataIndex: "avatar",
      title: "Ảnh đại diện",
      render(_, record) {
        return <CustomerAvatar src={!!record.avatar && record.avatar} alt={"Ảnh đại diện"} />;
      },
      className: "w-[150px]",
    },
    {
      dataIndex: "email",
      title: "Email",
      className: "w-[200px]",
    },
    {
      dataIndex: "phone",
      title: "Số điện thoại",
      className: "w-[150px]",
    },
    {
      dataIndex: "enterprise",
      title: "Công ty làm việc",
      className: "w-[250px]",
    },
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
      placeholder: "Nhập tên nhân viên...",
      title: "Tên nhân viên",
      type: "text",
    },
    {
      id: "email",
      placeholder: "Nhập email...",
      title: "Tên email",
      type: "text",
    },
    {
      id: "address",
      placeholder: "Nhập địa chỉ...",
      title: "Tên địa chỉ",
      type: "text",
    },
    {
      id: "status",
      placeholder: "Chọn trạng thái làm việc...",
      title: "Tên trạng thái làm việc",
      type: "select",
      options: optionStatus,
    },
    {
      id: "status",
      placeholder: "Chọn trình độ học vấn...",
      title: "Tên trình độ học vấn",
      type: "select",
      options: optionEducation,
    },
    {
      id: "enterprise_id",
      placeholder: "Chọn tên doanh nghiệp...",
      title: "Tên doanh nghiệp",
      type: "select",
      options: enterpriseOption as { value: string; label: string }[],
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
          education_level: employee.education_level,
          start_date: employee.start_date,
          end_date: employee.end_date,
          salary: employee.salary,
          enterprise: enterpriseName(+employee?.enterprise?.id!),
          address: employee.address,
          status: employee.status,
          avatar: employee.avatar,
        }))
      : [];
  }, [JSON.stringify(state.employees)]);

  useFetchStatus({
    module: "employee",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    dispatch(getAllEmployee({ query: state.filter }));
    dispatchEnterprise(getListEnterprise());
  }, [JSON.stringify(state.filter), JSON.stringify(state.status)]);
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
