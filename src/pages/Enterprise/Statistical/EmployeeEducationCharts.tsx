import React from "react";
import { Row, Col } from "antd"; // Import Row và Col từ Ant Design
import GenericChart from "@/components/chart/GenericChart";
import { educationLevelMapping } from "../Detail/Details/EmployeeEnterprise";

const EmployeeEducationCharts: React.FC<{ stateChartEnterprise: any }> = ({ stateChartEnterprise }) => {
  return (
    <Row gutter={16}>
      {" "}
      {/* Thêm khoảng cách giữa các cột nếu cần */}
      {stateChartEnterprise.map((enterprise: any) => {
        const { enterprise_name, education_levels } = enterprise;

        // Tạo mảng tên và giá trị
        const mappedNames = Object.keys(education_levels).map((name) => educationLevelMapping[name] || name);
        const values = Object.values(education_levels);

        return (
          <Col span={24} key={enterprise_name} md={24} xl={12}>
            <GenericChart
              name={mappedNames}
              value={values as any}
              chartType="pie"
              title={`Biểu đồ hồ sơ năng lực của nhân viên - ${enterprise_name}`}
              legendPosition="bottom"
              valueType="quantity"
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default EmployeeEducationCharts;
