// TopEnterpriseChart.tsx

import React, { useEffect, useState, useCallback } from "react";
import { Col, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import GenericChart from "@/components/chart/GenericChart";

interface TopEnterpriseChartProps {
  title: string;
  stateSelector: (state: any) => any[]; // selector để lấy dữ liệu từ Redux state
  actionCreator: (id: number) => any;   // Thunk action cho dispatch
  valueKey: string;   // Khóa giá trị cho Select
  labelKey: string;   // Khóa nhãn cho Select
  placeholder: string;
}

const TopEnterpriseChart: React.FC<TopEnterpriseChartProps> = ({
  title,
  stateSelector,
  actionCreator,
  valueKey,
  labelKey,
  placeholder,
}) => {
  const dispatch = useDispatch();
  const data = useSelector(stateSelector) || []; // Đảm bảo data không undefined
  const [selectedValue, setSelectedValue] = useState<string | undefined>();

  const memoizedActionCreator = useCallback(
    (id: number) => actionCreator(id),
    [actionCreator]
  );

  useEffect(() => {
    if (data.length > 0 && !selectedValue) {
      const defaultId = String(data[0][valueKey]);
      setSelectedValue(defaultId);
      dispatch(memoizedActionCreator(+defaultId));
    }
  }, [data, selectedValue, dispatch, memoizedActionCreator, valueKey]);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    dispatch(memoizedActionCreator(+value));
  };

  return (
    <Col xs={24} sm={24} md={24} xl={12}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]">
        <Select
          placeholder={placeholder}
          value={selectedValue}
          options={data.map((item) => ({
            label: item[labelKey],
            value: String(item[valueKey]),
          }))}
          onChange={handleSelectChange}
          style={{ width: "200px", marginBottom: "16px" }}
        />
        {data.length > 0 ? (
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
        ) : (
          <p>Đang tải dữ liệu...</p> // Thông báo khi chưa có dữ liệu
        )}
      </div>
    </Col>
  );
};

export default TopEnterpriseChart;
