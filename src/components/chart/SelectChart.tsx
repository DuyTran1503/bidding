import React from "react";
import { Select } from "antd";
import GenericChart from "@/components/chart/GenericChart";

interface SelectChartProps {
  title?: string; // Tiêu đề của biểu đồ
  data: Array<{ enterprise_name: string; completed_projects_count: string }>; // Dữ liệu biểu đồ
  selectedValue: string | undefined; // Giá trị đã chọn trong Select
  options: Array<{ label: string; value: string }>; // Lựa chọn cho Select
  onChange: (value: string) => void; // Hàm xử lý khi thay đổi Select
  placeholder: string; // Placeholder cho Select
}

const SelectChart: React.FC<SelectChartProps> = ({
  title,
  data,
  selectedValue,
  options,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]">
      {/* Select component for filtering */}
      <Select
        placeholder={placeholder}
        value={selectedValue}
        options={options}
        onChange={onChange}
        style={{ width: "200px", marginBottom: "16px" }}
      />

      {/* GenericChart component to display the data */}
      <GenericChart
        chartType="bar"
        title={title}
        name={data.map((item) => item.enterprise_name)}
        value={data.map((item) => item.completed_projects_count)}
        valueType="currency"
        legendPosition="bottom"
        rotate={100}
        titleFontSize={14}
      />
    </div>
  );
};

export default SelectChart;
