import GenericChart from "@/components/chart/GenericChart";
import CustomerAvatar from "@/components/common/CustomerAvatar";
import PaginatedTable from "@/components/table/PaginatedTable";
import { useArchive } from "@/hooks/useArchive";
import { IChartInitialState } from "@/services/store/chart/chart.slice";
import { employeeEducationLevelStatisticByEnterprise } from "@/services/store/chart/chart.thunk";
import { IEmployeeInitialState } from "@/services/store/employee/employee.slice";
import { getAllEmployee } from "@/services/store/employee/employee.thunk";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
const EmployeeEnterprise = () => {
  const { state, dispatch } = useArchive<IEmployeeInitialState>("employee");
  const { state: stateChart, dispatch: dispatchChart } = useArchive<IChartInitialState>("chart");
  const { id } = useParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const handlePageChange = (page: number, pageSize: number) => {
    dispatch({
      type: "employee/updateFilter",
      payload: { page, size: pageSize },
    });
  };

  useEffect(() => {
    if (id) {
      dispatchChart(employeeEducationLevelStatisticByEnterprise(id));
    }
  }, [dispatchChart, id]);

  const handleRowSelection = {
    selectedRowKeys, // Các hàng đang được chọn
    onChange: (keys: any) => setSelectedRowKeys(keys), // Xử lý chọn hàng
  };
  const columns: ColumnsType = [
    {
      dataIndex: "name",
      title: "Name",
      render: (text: string, record) => (
        <Link to={`/employees/detail/${record.id}`} className="hover:text-cyan-600">
          {text}
        </Link>
      ),
    },
    {
      dataIndex: "avatar",
      title: "Ảnh đại diện",
      render(_, record) {
        return <CustomerAvatar src={!!record.avatar && record.avatar} size={"large"} alt={"Ảnh đại diện"} />;
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
  ];

  useEffect(() => {
    dispatch(
      getAllEmployee({
        query: {
          page: state.filter.page,
          size: state.filter.size,
          enterprise: id,
        },
      }),
    );
  }, []);

  const educationLevelMapping: Record<string, string> = {
    after_university: "Sau đại học",
    college: "Cao đẳng",
    high_school: "Trung học phổ thông",
    primary_school: "Tiểu học",
    secondary_school: "Trung học cơ sở",
    university: "Đại học",
  };

  const names = Object.keys(stateChart.employeeEducationLevelStatisticByEnterprise || {});
  const mappedNames = names.map((name) => educationLevelMapping[name] || name);
  const values = Object.values(stateChart.employeeEducationLevelStatisticByEnterprise || {});

  return (
    <div className="pt-2">
      <h2 className="my-4 text-xl font-medium">
        Danh sách nhân viên <span className="ml-2 text-sm text-gray-500">Tổng: ({state.totalRecords} nhân viên)</span>
      </h2>

      <PaginatedTable
        columns={columns}
        dataSource={state.employees}
        currentPage={state.filter.page!}
        pageSize={state.filter.size!}
        totalRecords={state.totalRecords}
        onPageChange={handlePageChange}
        rowSelection={handleRowSelection}
        bordered={true}
      />
      <GenericChart
        name={mappedNames}
        value={values as number[]}
        chartType="pie"
        title="Biểu đồ hồ sơ năng lực của nhân viên"
        legendPosition="bottom"
        valueType="quantity"
      />
    </div>
  );
};

export default EmployeeEnterprise;
